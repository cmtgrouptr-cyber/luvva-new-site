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
      approved: false,
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
      approved: false,
      code: 'OTP_NOT_CONFIGURED',
      message: 'SMS verification is not configured.'
    });
  }

  const { phone, code } = readBody(req);

  const normalizedPhone = normalizePhone(phone);
  const normalizedCode = String(code || '').replace(/\D/g, '');

  if (
    !/^\+[1-9]\d{7,14}$/.test(normalizedPhone) ||
    !/^\d{4,10}$/.test(normalizedCode)
  ) {
    return sendJson(res, 400, {
      ok: false,
      approved: false,
      message: 'Invalid phone number or verification code.'
    });
  }

  try {
    const client = twilio(accountSid, authToken);

    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: normalizedPhone,
        code: normalizedCode
      });

    const approved = verificationCheck.status === 'approved';

    if (!approved) {
      return sendJson(res, 400, {
        ok: false,
        approved: false,
        message: 'The verification code is incorrect or expired.'
      });
    }

    return sendJson(res, 200, {
      ok: true,
      approved: true,
      phone: normalizedPhone,
      message: 'Verified.'
    });
  } catch (error) {
    console.error('LUVVA Twilio Verify check error:', {
      status: error?.status || null,
      code: error?.code || null,
      message: error?.message || null
    });

    return sendJson(
      res,
      error?.status >= 400 && error?.status < 600 ? error.status : 502,
      {
        ok: false,
        approved: false,
        code: 'TWILIO_VERIFY_FAILED',
        message: 'Unable to verify the SMS code right now.'
      }
    );
  }
};
