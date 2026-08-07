LUVVA V7.7 / V10.6 — BUSINESS EMAIL OTP

Implemented:
- Real 6-digit Business Email OTP through Resend.
- 10-minute expiry.
- 60-second resend protection.
- Maximum five verification attempts.
- HMAC-SHA256 code storage; the plain code is never stored.
- Supabase email_otp_challenges table with RLS and no public policies.
- V10.6: verified Business Email users are created/updated in the Dashboard identity/session tables.
- V10.6: all organization-owned email domains are accepted by default; common consumer/free domains use Google instead.

Required Vercel Environment Variables:
- RESEND_API_KEY
- EMAIL_OTP_SECRET (at least 32 characters, different from WhatsApp secret)
- BUSINESS_EMAIL_FROM = LUVVA Secure Gateway <noreply@luvva.tech>

Optional strict mode (normally leave OFF):
- BUSINESS_EMAIL_REQUIRE_ALLOWLIST = true
- BUSINESS_EMAIL_ALLOWED_DOMAINS = luvva.tech,company.com

Required setup:
1. Verify luvva.tech in Resend.
2. Run supabase/schema.sql in the Supabase SQL Editor.
3. Add the environment variables in Vercel Production, Preview and Development as needed.
4. Redeploy.
5. Test with a real organization-owned mailbox.
