const {json,authAdmin,supabase,hasPrivilegedSupabaseKey}=require('./_shared');
const isUuid=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v||''));
module.exports=async(req,res)=>{
  if(!authAdmin(req)) return json(res,401,{ok:false,message:'Unauthorized'});
  try{
    if(req.method==='POST'){
      const body=req.body||{};
      if(body.action==='contact-delete'){
        const id=String(body.id||'').trim();
        if(!isUuid(id)) return json(res,400,{ok:false,message:'Invalid contact message ID'});
        if(!hasPrivilegedSupabaseKey()) return json(res,503,{ok:false,message:'Contact deletion requires the Supabase Secret key or legacy service_role key in Vercel.'});
        const filter=`contact_submissions?id=eq.${encodeURIComponent(id)}`;
        const existing=await supabase(`${filter}&select=id&limit=1`);
        if(!Array.isArray(existing)||!existing.length) return json(res,404,{ok:false,message:'This contact message no longer exists. Refreshing the dashboard will remove it from the list.'});
        const deleted=await supabase(filter,{method:'DELETE'});
        const remaining=await supabase(`${filter}&select=id&limit=1`);
        if(Array.isArray(remaining)&&remaining.length) return json(res,409,{ok:false,message:'Supabase did not delete the message. Verify that Vercel uses the Supabase Secret key (or legacy service_role key), then redeploy.'});
        res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate');
        return json(res,200,{ok:true,deleted:Array.isArray(deleted)?Math.max(1,deleted.length):1,id});
      }
      if(body.action==='contact-read'){
        const ids=Array.isArray(body.ids)?body.ids.map(String).filter(isUuid):[];
        if(!ids.length) return json(res,200,{ok:true,updated:0});
        if(!hasPrivilegedSupabaseKey()) return json(res,503,{ok:false,message:'Marking messages as read requires the Supabase Secret key or legacy service_role key in Vercel.'});
        const stamp=new Date().toISOString(); let updated=0;
        for(const id of ids){
          const rows=await supabase(`contact_submissions?id=eq.${encodeURIComponent(id)}&read_at=is.null`,{method:'PATCH',body:{read_at:stamp}});
          updated+=Array.isArray(rows)?rows.length:0;
        }
        const stillUnread=[];
        for(const id of ids){
          const rows=await supabase(`contact_submissions?id=eq.${encodeURIComponent(id)}&read_at=is.null&select=id&limit=1`);
          if(Array.isArray(rows)&&rows.length)stillUnread.push(id);
        }
        if(stillUnread.length) return json(res,409,{ok:false,message:'Supabase did not save the read status. Verify the Secret/service_role key in Vercel, then redeploy.'});
        return json(res,200,{ok:true,updated});
      }
      return json(res,400,{ok:false,message:'Invalid contact action'});
    }
    if(req.method!=='GET') return json(res,405,{ok:false,message:'Method not allowed'});
    const data=await supabase('dashboard_visitors?select=*&order=last_seen_at.desc&limit=500');
    const contacts=await supabase('contact_submissions?select=*&order=submitted_at.desc&limit=1000');
    const byVisitor={};
    for(const c of (contacts||[])){
      if(!c.visitor_id) continue;
      (byVisitor[c.visitor_id] ||= []).push(c);
    }
    const rows=(data||[]).map(r=>({
      ...r,
      contact_completed:(byVisitor[r.visitor_id]?.length||0)>0 || !!r.contact_completed,
      contact_count:byVisitor[r.visitor_id]?.length||0,
      contact_details:byVisitor[r.visitor_id]?.[0]||null,
      contact_submissions:byVisitor[r.visitor_id]||[]
    }));
    res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate');
    return json(res,200,{ok:true,rows,contacts:(contacts||[]),contact_total:(contacts||[]).length});
  }catch(e){return json(res,503,{ok:false,message:e.message,rows:[]})}
};
