const {json,authAdmin,supabase}=require('./_shared');
module.exports=async(req,res)=>{if(!authAdmin(req))return json(res,401,{ok:false,message:'Unauthorized'});try{const data=await supabase('dashboard_visitors?select=*&order=last_seen_at.desc&limit=500');return json(res,200,{ok:true,rows:data});}catch(e){return json(res,503,{ok:false,message:e.message,rows:[]})}};
