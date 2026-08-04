const crypto = require('crypto');
const { supabase } = require('./_shared');

const reply = (res, status, body) => res.status(status).json(body);
const normalizeEmail = value => String(value || '').trim().toLowerCase().replace(/@luvval\.tech$/i, '@luvva.tech');
const safeEqual = (a, b) => {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
};
const hashCode = (email, code) => crypto.createHmac('sha256', process.env.EMAIL_OTP_SECRET || '').update(`${email}:${code}`).digest('hex');

export default async function handler(req, res) {
  if (req.method !== 'POST') return reply(res, 405, { ok:false, approved:false, message:'Method not allowed' });

  try {
    const email = normalizeEmail(req.body && req.body.email);
    const code = String((req.body && req.body.code) || '').replace(/\D/g, '');
    if (!email || code.length !== 6) return reply(res, 400, { ok:false, approved:false, message:'Please enter the 6-digit email code.' });
    if (!process.env.EMAIL_OTP_SECRET || process.env.EMAIL_OTP_SECRET.length < 32) {
      return reply(res, 503, { ok:false, approved:false, message:'Business email verification is not configured yet.' });
    }

    const rows = await supabase(`email_otp_challenges?email=eq.${encodeURIComponent(email)}&used=eq.false&order=created_at.desc&limit=1`);
    const challenge = Array.isArray(rows) ? rows[0] : null;
    if (!challenge) return reply(res, 401, { ok:false, approved:false, message:'The verification code is incorrect or expired.' });

    if (new Date(challenge.expires_at).getTime() <= Date.now()) {
      await supabase(`email_otp_challenges?id=eq.${challenge.id}`, { method:'PATCH', body:{ used:true } }).catch(() => {});
      return reply(res, 401, { ok:false, approved:false, message:'The verification code has expired. Request a new one.' });
    }
    if ((challenge.attempts || 0) >= 5) {
      return reply(res, 429, { ok:false, approved:false, message:'Too many attempts. Request a new verification code.' });
    }

    const approved = safeEqual(challenge.code_hash, hashCode(email, code));
    if (!approved) {
      await supabase(`email_otp_challenges?id=eq.${challenge.id}`, {
        method:'PATCH', body:{ attempts:(challenge.attempts || 0) + 1 }
      });
      return reply(res, 401, { ok:false, approved:false, message:'The verification code is incorrect or expired.' });
    }

    await supabase(`email_otp_challenges?id=eq.${challenge.id}`, {
      method:'PATCH', body:{ used:true, verified_at:new Date().toISOString() }
    });
    return reply(res, 200, { ok:true, approved:true, email });
  } catch (error) {
    console.error('LUVVA email OTP verify error:', error);
    return reply(res, 500, { ok:false, approved:false, message:'Business email verification is temporarily unavailable.' });
  }
}
