const twilio = require('twilio');

function sendJson(res, status, body) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.json(body);
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;

  try {
    return JSON.parse(req.body || '{}');
  } catch (_) {
    return {};
  }
}

function normalizePhone(value) {
  return String(value || '').replace(/[\s()-]/g, '').trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      ok: false,
      message: 'Method not allowed.'
    });
  }

  const accountSid = String(process.env.TWILIO_ACCOUNT_SID || '').trim();
  const authToken = String(process.env.TWILIO_AUTH_TOKEN || '').trim();
  const verifyServiceSid = String(
    process.env.TWILIO_VERIFY_SERVICE_SID || ''
  ).trim();

  if (!accountSid || !authToken || !verifyServiceSid) {
    return sendJson(res, 503, {
      ok: false,
      code: 'OTP_NOT_CONFIGURED',
      message: 'SMS verification is not configured.'
    });
  }

  const { phone } = readBody(req);
  const normalizedPhone = normalizePhone(phone);

  if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
    return sendJson(res, 400, {
      ok: false,
      message: 'Enter a valid international phone number.'
    });
  }

  try {
    const client = twilio(accountSid, authToken);

    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: normalizedPhone,
        channel: 'sms'
      });

    return sendJson(res, 200, {
      ok: true,
      status: verification.status || 'pending'
    });
  } catch (error) {
    console.error('LUVVA Twilio Verify SMS send error:', {
      status: error?.status || null,
      code: error?.code || null,
      message: error?.message || null
    });

    return sendJson(
      res,
      error?.status >= 400 && error?.status < 600 ? error.status : 502,
      {
        ok: false,
        code: 'TWILIO_SEND_FAILED',
        message: 'Unable to send the SMS verification code right now.'
      }
    );
  }
};
