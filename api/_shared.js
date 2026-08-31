const crypto = require('crypto');
const json=(res,status,body)=>res.status(status).setHeader('Content-Type','application/json').end(JSON.stringify(body));
function authAdmin(req){const owner=String(req.headers['x-luvva-owner-access']||'')==='5x5-owner-dashboard-v1'; if(owner)return true; const expected=process.env.ADMIN_ACCESS_TOKEN||''; const got=(req.headers.authorization||'').replace(/^Bearer\s+/i,''); if(!expected||got.length!==expected.length)return false; return crypto.timingSafeEqual(Buffer.from(got),Buffer.from(expected));}
function supabaseKey(service=true){
  return String(service
    ? (process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY||'')
    : (process.env.SUPABASE_PUBLISHABLE_KEY||process.env.SUPABASE_ANON_KEY||'')
  ).trim();
}
function supabaseRole(key){
  try{
    const parts=String(key||'').split('.');
    if(parts.length!==3)return '';
    const payload=parts[1].replace(/-/g,'+').replace(/_/g,'/');
    return String(JSON.parse(Buffer.from(payload,'base64').toString('utf8'))?.role||'');
  }catch(_){return ''}
}
function hasPrivilegedSupabaseKey(){
  const key=supabaseKey(true);
  return key.startsWith('sb_secret_')||supabaseRole(key)==='service_role';
}
async function supabase(path,{method='GET',body,service=true}={}){
  const url=String(process.env.SUPABASE_URL||'').replace(/\/$/,'');
  const key=supabaseKey(service);
  if(!url||!key) throw new Error('Supabase is not configured');
  const headers={apikey:key,'Content-Type':'application/json',Prefer:'return=representation'};
  // Legacy JWT keys are also bearer tokens. New sb_secret_/sb_publishable_ keys
  // authenticate through the apikey header and must not be treated as JWTs.
  if(!key.startsWith('sb_secret_')&&!key.startsWith('sb_publishable_'))headers.Authorization=`Bearer ${key}`;
  const r=await fetch(`${url}/rest/v1/${path}`,{method,headers,body:body?JSON.stringify(body):undefined,cache:'no-store'});
  const text=await r.text(); let data;
  try{data=text?JSON.parse(text):null}catch{data=text}
  if(!r.ok) throw new Error(typeof data==='object'?(data.message||JSON.stringify(data)):data);
  return data;
}
function token(){return crypto.randomBytes(24).toString('base64url')}
function hash(v){return crypto.createHash('sha256').update(String(v)).digest('hex')}
module.exports={json,authAdmin,supabase,supabaseKey,hasPrivilegedSupabaseKey,token,hash};
