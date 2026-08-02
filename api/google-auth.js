const { OAuth2Client } = require('google-auth-library');
const { randomUUID } = require('crypto');
const { json, hash } = require('./_shared');

const SESSION_MINUTES = 25;

async function sb(path, { method = 'GET', body, prefer = 'return=representation' } = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured');
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: prefer
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
  if (!response.ok) throw new Error(typeof data === 'object' ? (data.message || JSON.stringify(data)) : String(data));
  return data;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, message: 'Method not allowed' });
  const credential = req.body?.credential;
  if (!credential) return json(res, 400, { ok: false, message: 'Missing Google credential' });
  if (!process.env.GOOGLE_CLIENT_ID) return json(res, 503, { ok: false, message: 'Google Client ID is not configured' });

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile?.email || profile.email_verified !== true) {
      return json(res, 401, { ok: false, message: 'Google account could not be verified' });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_MINUTES * 60 * 1000).toISOString();
    const normalizedEmail = String(profile.email).trim().toLowerCase();

    // Google identity verification must not depend on the Dashboard database being configured.
    // Vercel currently has the Google credentials, while Supabase can be connected later.
    // Return a verified temporary session immediately and keep the database-backed path below
    // for the moment SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are supplied.
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const localIdentityId = `google:${profile.sub}`;
      return json(res, 200, {
        ok: true,
        approved: true,
        mode: 'verified-temporary-session',
        visitor: {
          id: localIdentityId,
          identityId: localIdentityId,
          provider: 'Google',
          subject: profile.sub,
          email: normalizedEmail,
          name: profile.name || normalizedEmail,
          picture: profile.picture || ''
        },
        session: {
          id: randomUUID(),
          accessState: 'temporary',
          expiresAt,
          durationMinutes: SESSION_MINUTES
        }
      });
    }

    let identityRows = await sb(`identities?provider=eq.google&provider_subject=eq.${encodeURIComponent(profile.sub)}&select=*,visitors(*)`);
    let identity = identityRows?.[0];
    let visitor;

    if (!identity) {
      const visitorRows = await sb('visitors', {
        method: 'POST',
        body: {
          display_name: profile.name || normalizedEmail,
          first_visit_at: now.toISOString(),
          last_visit_at: now.toISOString(),
          visit_count: 1
        }
      });
      visitor = visitorRows[0];
      const identityCreated = await sb('identities', {
        method: 'POST',
        body: {
          visitor_id: visitor.id,
          provider: 'google',
          provider_subject: profile.sub,
          normalized_identity: normalizedEmail,
          verified: true,
          verified_at: now.toISOString(),
          last_login_at: now.toISOString()
        }
      });
      identity = identityCreated[0];
      await sb('permissions', {
        method: 'POST',
        body: {
          identity_id: identity.id,
          access_state: 'temporary',
          expires_at: expiresAt
        }
      });
    } else {
      visitor = identity.visitors;
      const permissions = await sb(`permissions?identity_id=eq.${identity.id}&select=*`);
      const permission = permissions?.[0];
      if (permission?.access_state === 'blocked') {
        return json(res, 403, { ok: false, blocked: true, message: permission.blocked_reason || 'This verified identity is currently restricted.' });
      }
      await sb(`visitors?id=eq.${visitor.id}`, {
        method: 'PATCH',
        body: {
          display_name: profile.name || visitor.display_name || normalizedEmail,
          last_visit_at: now.toISOString(),
          visit_count: Number(visitor.visit_count || 0) + 1,
          updated_at: now.toISOString()
        }
      });
      await sb(`identities?id=eq.${identity.id}`, {
        method: 'PATCH',
        body: {
          normalized_identity: normalizedEmail,
          verified: true,
          verified_at: identity.verified_at || now.toISOString(),
          last_login_at: now.toISOString()
        }
      });
      if (!permission) {
        await sb('permissions', { method: 'POST', body: { identity_id: identity.id, access_state: 'temporary', expires_at: expiresAt } });
      } else if (permission.access_state !== 'permanent') {
        await sb(`permissions?identity_id=eq.${identity.id}`, { method: 'PATCH', body: { access_state: 'temporary', expires_at: expiresAt, blocked_at: null, blocked_reason: null, updated_at: now.toISOString() } });
      }
    }

    const latestPermission = (await sb(`permissions?identity_id=eq.${identity.id}&select=*&limit=1`))?.[0];
    const sessionExpiresAt = latestPermission?.access_state === 'permanent' ? null : (latestPermission?.expires_at || expiresAt);
    const sessionRows = await sb('sessions', {
      method: 'POST',
      body: {
        identity_id: identity.id,
        started_at: now.toISOString(),
        expires_at: sessionExpiresAt,
        last_seen_at: now.toISOString(),
        status: 'active',
        device_hash: hash(req.body?.device || req.headers['user-agent'] || 'unknown'),
        ip_hash: hash(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'),
        user_agent: String(req.headers['user-agent'] || '').slice(0, 500)
      }
    });

    await sb('audit_log', {
      method: 'POST',
      body: {
        actor: `google:${profile.sub}`,
        action: 'google_login_verified',
        entity_type: 'identity',
        entity_id: identity.id,
        metadata: { email: normalizedEmail, session_id: sessionRows[0]?.id }
      }
    });

    return json(res, 200, {
      ok: true,
      approved: true,
      visitor: {
        id: visitor.id,
        identityId: identity.id,
        provider: 'Google',
        subject: profile.sub,
        email: normalizedEmail,
        name: profile.name || normalizedEmail,
        picture: profile.picture || ''
      },
      session: {
        id: sessionRows[0]?.id,
        accessState: latestPermission?.access_state || 'temporary',
        expiresAt: sessionExpiresAt,
        durationMinutes: SESSION_MINUTES
      }
    });
  } catch (error) {
    console.error('LUVVA Google authentication error:', error);
    return json(res, 401, { ok: false, message: 'Google verification failed. Please try again.' });
  }
};
