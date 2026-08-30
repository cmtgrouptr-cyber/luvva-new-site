const {json,authAdmin,supabase}=require('./_shared');
module.exports=async(req,res)=>{
  if(!authAdmin(req)) return json(res,401,{ok:false,message:'Unauthorized'});
  try{
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
    return json(res,200,{ok:true,rows,contact_total:(contacts||[]).length});
  }catch(e){return json(res,503,{ok:false,message:e.message,rows:[]})}
};
