const {json,supabase}=require('./_shared');

function isUuid(value){
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value||''));
}

function providerKey(value){
  const provider=String(value||'').trim().toLowerCase();
  if(provider.includes('google')) return 'google';
  if(provider.includes('email')) return 'email';
  if(provider.includes('whatsapp')) return 'whatsapp';
  if(provider.includes('wechat')) return 'wechat';
  return '';
}

module.exports=async(req,res)=>{
  if(req.method!=='POST') return json(res,405,{ok:false,message:'Method not allowed'});

  try{
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    if(body.consent!==true) return json(res,400,{ok:false,message:'Consent is required.'});

    const name=String(body.name||'').trim();
    const email=String(body.email||'').trim().toLowerCase();
    if(!name || !email) return json(res,400,{ok:false,message:'Name and email are required.'});

    const suppliedIdentityId=String(body.identity_id||'').trim();
    const key=providerKey(body.provider);
    let subject=String(body.provider_subject||'').trim();
    if(!subject && key && suppliedIdentityId.startsWith(`${key}:`)) subject=suppliedIdentityId.slice(key.length+1);

    let identity=null;
    if(isUuid(suppliedIdentityId)){
      const rows=await supabase(`identities?id=eq.${encodeURIComponent(suppliedIdentityId)}&verified=eq.true&select=id,visitor_id&limit=1`);
      identity=Array.isArray(rows)?rows[0]:null;
    }

    // Google can return a temporary "google:<subject>" identity when its first
    // dashboard write is delayed. Resolve the already verified database identity
    // by provider + subject so the Contact Us message still reaches the dashboard.
    if(!identity && key && subject){
      const rows=await supabase(`identities?provider=eq.${encodeURIComponent(key)}&provider_subject=eq.${encodeURIComponent(subject)}&verified=eq.true&select=id,visitor_id&limit=1`);
      identity=Array.isArray(rows)?rows[0]:null;
    }

    if(!identity) return json(res,409,{ok:false,message:'Your verified session is not linked yet. Please sign in again, then resend.'});

    const submitted={
      visitor_id:identity.visitor_id,
      identity_id:identity.id,
      name,
      email,
      phone:String(body.phone||'').trim(),
      company:String(body.company||'').trim(),
      position:String(body.position||'').trim(),
      country:String(body.country||'').trim(),
      interest:String(body.interest||'').trim(),
      message:String(body.message||'').trim(),
      consent:true
    };
    const rows=await supabase('contact_submissions',{method:'POST',body:submitted});
    return json(res,201,{ok:true,id:rows?.[0]?.id||null,submitted_at:rows?.[0]?.submitted_at||null});
  }catch(e){
    console.error('LUVVA contact submission error:',e);
    return json(res,503,{ok:false,message:e?.message||'Contact submission failed.'});
  }
};
