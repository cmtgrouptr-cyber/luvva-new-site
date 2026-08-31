const {json,authAdmin,supabase,hasPrivilegedSupabaseKey}=require('./_shared');
const isUuid=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v||''));
module.exports=async(req,res)=>{
  if(req.method!=='POST')return json(res,405,{ok:false,message:'Method not allowed'});
  if(!authAdmin(req))return json(res,401,{ok:false,message:'Unauthorized'});
  const body=req.body||{};
  const {identity_id,action,reason}=body;
  try{
    if(action==='contact-delete'){
      const id=String(body.id||'').trim();
      if(!isUuid(id))return json(res,400,{ok:false,message:'Invalid contact message ID'});
      if(!hasPrivilegedSupabaseKey())return json(res,503,{ok:false,message:'Contact deletion requires the Supabase Secret key or legacy service_role key in Vercel.'});
      const filter=`contact_submissions?id=eq.${encodeURIComponent(id)}`;
      const existing=await supabase(`${filter}&select=id&limit=1`);
      if(!Array.isArray(existing)||!existing.length)return json(res,404,{ok:false,message:'This contact message no longer exists. Refreshing the dashboard will remove it from the list.'});
      const deleted=await supabase(filter,{method:'DELETE'});
      const remaining=await supabase(`${filter}&select=id&limit=1`);
      if(Array.isArray(remaining)&&remaining.length)return json(res,409,{ok:false,message:'Supabase did not delete the message. Verify that Vercel uses the Supabase Secret key (or legacy service_role key), then redeploy.'});
      res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate');
      return json(res,200,{ok:true,deleted:Array.isArray(deleted)?Math.max(1,deleted.length):1,id});
    }
    if(action==='contact-read'){
      const ids=Array.isArray(body.ids)?body.ids.map(String).filter(isUuid):[];
      if(!ids.length)return json(res,200,{ok:true,updated:0});
      if(!hasPrivilegedSupabaseKey())return json(res,503,{ok:false,message:'Marking messages as read requires the Supabase Secret key or legacy service_role key in Vercel.'});
      let updated=0;
      const stamp=new Date().toISOString();
      for(const id of ids){
        const rows=await supabase(`contact_submissions?id=eq.${encodeURIComponent(id)}&read_at=is.null`,{method:'PATCH',body:{read_at:stamp}});
        updated+=Array.isArray(rows)?rows.length:0;
      }
      const stillUnread=[];
      for(const id of ids){
        const rows=await supabase(`contact_submissions?id=eq.${encodeURIComponent(id)}&read_at=is.null&select=id&limit=1`);
        if(Array.isArray(rows)&&rows.length)stillUnread.push(id);
      }
      if(stillUnread.length)return json(res,409,{ok:false,message:'Supabase did not save the read status. Verify the Secret/service_role key in Vercel, then redeploy.'});
      return json(res,200,{ok:true,updated});
    }
    if(!identity_id||!['extend','permanent','temporary','block','unblock'].includes(action))return json(res,400,{ok:false,message:'Invalid request'});
    let patch={updated_at:new Date().toISOString()};
    if(action==='extend'){patch.access_state='temporary';patch.expires_at=new Date(Date.now()+25*60000).toISOString();patch.blocked_at=null}
    else if(action==='permanent'){patch.access_state='permanent';patch.expires_at=null;patch.blocked_at=null}
    else if(action==='temporary'||action==='unblock'){patch.access_state='temporary';patch.expires_at=new Date(Date.now()+25*60000).toISOString();patch.blocked_at=null}
    else if(action==='block'){patch.access_state='blocked';patch.blocked_at=new Date().toISOString();patch.blocked_reason=reason||'Blocked by administrator'}
    await supabase(`permissions?identity_id=eq.${encodeURIComponent(identity_id)}`,{method:'PATCH',body:patch});
    await supabase('audit_log',{method:'POST',body:{actor:'dashboard-admin',action,entity_type:'identity',entity_id:identity_id,metadata:{reason:reason||null}}});
    return json(res,200,{ok:true});
  }catch(e){return json(res,503,{ok:false,message:e.message})}
};
