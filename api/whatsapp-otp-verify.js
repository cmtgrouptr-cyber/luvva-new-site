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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { ok:false, approved:false, message:'Method not allowed.' });

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
    return sendJson(res, 503, {
      ok:false,
      approved:false,
      code:'OTP_NOT_CONFIGURED',
      message:'WhatsApp verification is not active yet. Add the Twilio Verify credentials in Vercel and redeploy.'
    });
  }

  const { phone, code } = readBody(req);
  const normalizedPhone = String(phone || '').replace(/[\s()-]/g, '').trim();
  const normalizedCode = String(code || '').replace(/\D/g, '');
  if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone) || !/^\d{4,10}$/.test(normalizedCode)) {
    return sendJson(res, 400, { ok:false, approved:false, message:'Invalid phone number or verification code.' });
  }

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  const form = new URLSearchParams({ To:normalizedPhone, Code:normalizedCode });

  try {
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${encodeURIComponent(TWILIO_VERIFY_SERVICE_SID)}/VerificationCheck`,
      {
        method:'POST',
        headers:{ Authorization:`Basic ${auth}`, 'Content-Type':'application/x-www-form-urlencoded' },
        body:form.toString()
      }
    );
    const data = await response.json().catch(() => ({}));
    const approved = response.ok && data.status === 'approved';
    return sendJson(res, approved ? 200 : 400, {
      ok:approved,
      approved,
      message:approved ? 'Verified.' : (data.message || 'The verification code is incorrect or expired.')
    });
  } catch (_) {
    return sendJson(res, 502, { ok:false, approved:false, message:'Unable to contact the WhatsApp verification service.' });
  }
};
