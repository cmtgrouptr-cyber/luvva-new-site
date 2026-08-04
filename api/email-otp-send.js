const crypto = require('crypto');
const { supabase } = require('./_shared');

const reply = (res, status, body) => res.status(status).json(body);
const normalizeEmail = value => String(value || '').trim().toLowerCase();
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
const hashCode = (email, code) => crypto.createHmac('sha256', process.env.EMAIL_OTP_SECRET || '').update(`${email}:${code}`).digest('hex');

function domainAllowed(email) {
  const configured = String(process.env.BUSINESS_EMAIL_ALLOWED_DOMAINS || '').trim();
  if (!configured) return true;
  const domain = email.split('@')[1] || '';
  return configured.split(',').map(v => v.trim().toLowerCase()).filter(Boolean).includes(domain);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return reply(res, 405, { ok:false, message:'Method not allowed' });

  try {
    const email = normalizeEmail(req.body && req.body.email);
    if (!validEmail(email)) return reply(res, 400, { ok:false, message:'Please enter a valid business email address.' });
    if (!domainAllowed(email)) return reply(res, 403, { ok:false, message:'This email domain is not approved for Business Email access.' });

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.BUSINESS_EMAIL_FROM || 'LUVVA Secure Gateway <cmtgroup.tr@luvva.tech>';
    const secret = process.env.EMAIL_OTP_SECRET;
    if (!apiKey || !secret || secret.length < 32) {
     return reply(res, 503, {
  ok: false,
  message: 'Business email verification is not configured yet.',
  diagnostic: {
    resendKeyPresent: Boolean(apiKey),
    emailSecretPresent: Boolean(secret),
    emailSecretLength: secret ? secret.length : 0
  }
});
    }

    const recent = await supabase(`email_otp_challenges?email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=1`);
    if (Array.isArray(recent) && recent[0]) {
      const ageMs = Date.now() - new Date(recent[0].created_at).getTime();
      if (ageMs < 60000) {
        const wait = Math.max(1, Math.ceil((60000 - ageMs) / 1000));
        return reply(res, 429, { ok:false, message:`Please wait ${wait} seconds before requesting another code.` });
      }
    }

    const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const inserted = await supabase('email_otp_challenges', {
      method:'POST',
      body:{ email, code_hash:hashCode(email, code), expires_at:expiresAt }
    });
    const challenge = Array.isArray(inserted) ? inserted[0] : inserted;

    const sendResponse = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{ Authorization:`Bearer ${apiKey}`, 'Content-Type':'application/json' },
      body:JSON.stringify({
        from,
        to:[email],
        subject:'Your LUVVA secure access code',
        html:`<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:28px;border:1px solid #d7bd7a;border-radius:18px;background:#fffdf8;color:#20170f"><h2 style="margin:0 0 14px">LUVVA Secure Gateway</h2><p>Use this verification code to continue:</p><div style="font-size:34px;letter-spacing:8px;font-weight:700;margin:24px 0;color:#7b1826">${code}</div><p style="font-size:14px;color:#6d6258">The code expires in 10 minutes. Do not share it with anyone.</p></div>`,
        text:`LUVVA Secure Gateway verification code: ${code}. It expires in 10 minutes.`
      })
    });
    const sendText = await sendResponse.text();
    let sendData = null;
    try { sendData = sendText ? JSON.parse(sendText) : null; } catch { sendData = sendText; }

    if (!sendResponse.ok) {
      if (challenge && challenge.id) {
        await supabase(`email_otp_challenges?id=eq.${challenge.id}`, { method:'DELETE' }).catch(() => {});
      }
      console.error('LUVVA email OTP Resend error:', sendData);
      return reply(res, 502, { ok:false, message:'The verification email could not be sent. Please try again.' });
    }

    if (challenge && challenge.id && sendData && sendData.id) {
      await supabase(`email_otp_challenges?id=eq.${challenge.id}`, {
        method:'PATCH', body:{ provider_message_id:sendData.id }
      }).catch(() => {});
    }

    return reply(res, 200, { ok:true, expires_in:600 });
  } catch (error) {
    console.error('LUVVA email OTP send error:', error);
    return reply(res, 500, { ok:false, message:'Business email verification is temporarily unavailable.' });
  }
}
