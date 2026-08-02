const crypto = require('crypto');
const { supabase } = require('./_shared');

function sendJson(res, status, body) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.json(body);
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

function normalizePhone(value) {
  return String(value || '').replace(/[\s()-]/g, '').trim();
}

function otpHash(phone, code) {
  const secret = process.env.WHATSAPP_OTP_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return crypto.createHmac('sha256', secret).update(`${phone}:${code}`).digest('hex');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { ok:false, message:'Method not allowed.' });

  // V7.2: accept both the concise Vercel names already configured by the owner
  // and the older META_* names for backward compatibility.
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || process.env.META_WHATSAPP_TEMPLATE_NAME || 'luvva_login_code';
  const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE || process.env.META_WHATSAPP_TEMPLATE_LANGUAGE || 'en_US';
  const graphApiVersion = process.env.META_GRAPH_API_VERSION || 'v23.0';
  const otpSecret = process.env.WHATSAPP_OTP_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!accessToken || !phoneNumberId || !templateName || !otpSecret) {
    return sendJson(res, 503, {
      ok:false,
      code:'OTP_NOT_CONFIGURED',
      message:'WhatsApp verification is not configured. Add the Meta WhatsApp environment variables in Vercel, then redeploy.'
    });
  }

  const { phone } = readBody(req);
  const normalizedPhone = normalizePhone(phone);
  if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
    return sendJson(res, 400, { ok:false, message:'Enter a valid international WhatsApp number.' });
  }

  try {
    const phoneKey = encodeURIComponent(normalizedPhone);
    const recent = await supabase(`whatsapp_otp_challenges?phone=eq.${phoneKey}&created_at=gte.${encodeURIComponent(new Date(Date.now()-60_000).toISOString())}&select=id&limit=1`);
    if (Array.isArray(recent) && recent.length) {
      return sendJson(res, 429, { ok:false, message:'Please wait one minute before requesting another code.' });
    }

    const code = String(crypto.randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + 5 * 60_000).toISOString();

    const response = await fetch(`https://graph.facebook.com/${encodeURIComponent(graphApiVersion)}/${encodeURIComponent(phoneNumberId)}/messages`, {
      method:'POST',
      headers:{
        Authorization:`Bearer ${accessToken}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        messaging_product:'whatsapp',
        recipient_type:'individual',
        to:normalizedPhone.slice(1),
        type:'template',
        template:{
          name:templateName,
          language:{ code:templateLanguage },
          components:[
            { type:'body', parameters:[{ type:'text', text:code }] },
            { type:'button', sub_type:'url', index:'0', parameters:[{ type:'text', text:code }] }
          ]
        }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const metaMessage = data?.error?.error_user_msg || data?.error?.message || 'WhatsApp could not send the verification code.';
      return sendJson(res, response.status >= 400 && response.status < 600 ? response.status : 502, {
        ok:false,
        code:'META_SEND_FAILED',
        message:metaMessage
      });
    }

    await supabase('whatsapp_otp_challenges', {
      method:'POST',
      body:{
        phone:normalizedPhone,
        code_hash:otpHash(normalizedPhone, code),
        expires_at:expiresAt,
        attempts:0,
        used:false,
        meta_message_id:data?.messages?.[0]?.id || null
      }
    });

    return sendJson(res, 200, { ok:true, status:'pending', expiresIn:300 });
  } catch (error) {
    console.error('LUVVA WhatsApp OTP send error:', error);
    return sendJson(res, 502, { ok:false, message:'Unable to send the WhatsApp verification code right now.' });
  }
};
