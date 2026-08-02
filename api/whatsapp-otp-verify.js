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

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { ok:false, approved:false, message:'Method not allowed.' });

  if (!process.env.WHATSAPP_OTP_SECRET && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return sendJson(res, 503, { ok:false, approved:false, code:'OTP_NOT_CONFIGURED', message:'WhatsApp verification is not configured.' });
  }

  const { phone, code } = readBody(req);
  const normalizedPhone = normalizePhone(phone);
  const normalizedCode = String(code || '').replace(/\D/g, '');
  if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone) || !/^\d{6}$/.test(normalizedCode)) {
    return sendJson(res, 400, { ok:false, approved:false, message:'Invalid phone number or verification code.' });
  }

  try {
    const phoneKey = encodeURIComponent(normalizedPhone);
    const rows = await supabase(`whatsapp_otp_challenges?phone=eq.${phoneKey}&used=eq.false&order=created_at.desc&select=*&limit=1`);
    const challenge = Array.isArray(rows) ? rows[0] : null;

    if (!challenge) {
      return sendJson(res, 400, { ok:false, approved:false, message:'The verification code is incorrect or expired.' });
    }

    if (new Date(challenge.expires_at).getTime() <= Date.now()) {
      await supabase(`whatsapp_otp_challenges?id=eq.${encodeURIComponent(challenge.id)}`, { method:'PATCH', body:{ used:true } });
      return sendJson(res, 400, { ok:false, approved:false, message:'The verification code has expired. Request a new code.' });
    }

    const attempts = Number(challenge.attempts || 0);
    if (attempts >= 5) {
      await supabase(`whatsapp_otp_challenges?id=eq.${encodeURIComponent(challenge.id)}`, { method:'PATCH', body:{ used:true } });
      return sendJson(res, 429, { ok:false, approved:false, message:'Too many attempts. Request a new verification code.' });
    }

    const approved = safeEqual(challenge.code_hash, otpHash(normalizedPhone, normalizedCode));
    if (!approved) {
      await supabase(`whatsapp_otp_challenges?id=eq.${encodeURIComponent(challenge.id)}`, { method:'PATCH', body:{ attempts:attempts + 1 } });
      return sendJson(res, 400, { ok:false, approved:false, message:'The verification code is incorrect or expired.' });
    }

    await supabase(`whatsapp_otp_challenges?id=eq.${encodeURIComponent(challenge.id)}`, {
      method:'PATCH',
      body:{ used:true, verified_at:new Date().toISOString(), attempts:attempts + 1 }
    });

    return sendJson(res, 200, { ok:true, approved:true, phone:normalizedPhone, message:'Verified.' });
  } catch (error) {
    console.error('LUVVA WhatsApp OTP verify error:', error);
    return sendJson(res, 502, { ok:false, approved:false, message:'Unable to verify the WhatsApp code right now.' });
  }
};
