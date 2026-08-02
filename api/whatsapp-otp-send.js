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
  if (req.method !== 'POST') return sendJson(res, 405, { ok:false, message:'Method not allowed.' });

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
    return sendJson(res, 503, {
      ok:false,
      code:'OTP_NOT_CONFIGURED',
      message:'WhatsApp verification is not active yet. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID in Vercel Environment Variables, then redeploy.'
    });
  }

  const { phone } = readBody(req);
  const normalizedPhone = String(phone || '').replace(/[\s()-]/g, '').trim();
  if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
    return sendJson(res, 400, { ok:false, message:'Enter a valid international WhatsApp number.' });
  }

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  const form = new URLSearchParams({ To: normalizedPhone, Channel: 'whatsapp' });

  try {
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${encodeURIComponent(TWILIO_VERIFY_SERVICE_SID)}/Verifications`,
      {
        method:'POST',
        headers:{ Authorization:`Basic ${auth}`, 'Content-Type':'application/x-www-form-urlencoded' },
        body:form.toString()
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return sendJson(res, response.status, { ok:false, message:data.message || 'WhatsApp could not send the verification code.' });
    }
    return sendJson(res, 200, { ok:true, status:data.status || 'pending' });
  } catch (_) {
    return sendJson(res, 502, { ok:false, message:'Unable to contact the WhatsApp verification service.' });
  }
};
