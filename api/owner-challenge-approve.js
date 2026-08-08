const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { json, supabase, hash, token } = require('./_shared');

function allowedOwnerEmails() {
  return String(process.env.OWNER_GOOGLE_EMAIL || process.env.ADMIN_GOOGLE_EMAIL || '')
    .split(',')
    .map(v => v.trim().toLowerCase())
    .filter(Boolean);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, message: 'Method not allowed' });
  }

  const raw = req.body?.token;
  const credential = req.body?.credential;

  if (!raw || !credential) {
    return json(res, 400, {
      ok: false,
      message: 'Missing secure request or Google credential'
    });
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    return json(res, 503, {
      ok: false,
      message: 'Google Client ID is not configured'
    });
  }

  const owners = allowedOwnerEmails();

  if (!owners.length) {
    return json(res, 503, {
      ok: false,
      message: 'OWNER_GOOGLE_EMAIL is not configured'
    });
  }

  try {
    const rows = await supabase(
      `owner_access_challenges?token_hash=eq.${hash(raw)}&select=*&limit=1`
    );

    const row = rows?.[0];

    if (
      !row ||
      row.status !== 'pending' ||
      new Date(row.expires_at) <= new Date()
    ) {
      return json(res, 410, {
        ok: false,
        message: 'Secure request expired'
      });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const profile = ticket.getPayload();
    const email = String(profile?.email || '').trim().toLowerCase();

    if (
      !profile?.sub ||
      profile.email_verified !== true ||
      !owners.includes(email)
    ) {
      return json(res, 403, {
        ok: false,
        message: 'This Google account is not authorized for owner access'
      });
    }

    const code = String(crypto.randomInt(100000, 1000000));
    const session = token();

    const sealed = `${hash(code)}.${session}`;
    const now = new Date().toISOString();

    await supabase(
      `owner_access_challenges?token_hash=eq.${hash(raw)}`,
      {
        method: 'PATCH',
        body: {
          status: 'approved',
          approved_at: now,
          approved_session_token: sealed
        }
      }
    );

    await supabase('audit_log', {
      method: 'POST',
      body: {
        actor: `google-owner:${profile.sub}`,
        action: 'owner_google_verified',
        entity_type: 'owner_access_challenge',
        entity_id: row.id,
        metadata: {
          access_type: row.access_type,
          email
        }
      }
    });

    return json(res, 200, {
      ok: true,
      status: 'approved',
      access_type: row.access_type,
      verification_code: code,
      expires_at: row.expires_at
    });

  } catch (e) {
    console.error('LUVVA owner Google approval error:', e);

    return json(res, 503, {
      ok: false,
      message: 'Owner verification service is unavailable'
    });
  }
};
