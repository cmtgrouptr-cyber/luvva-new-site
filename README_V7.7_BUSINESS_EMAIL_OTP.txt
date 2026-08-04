LUVVA V7.7 — BUSINESS EMAIL OTP

Implemented:
- Real 6-digit Business Email OTP through Resend.
- 10-minute expiry.
- 60-second resend protection.
- Maximum five verification attempts.
- HMAC-SHA256 code storage; the plain code is never stored.
- Supabase email_otp_challenges table with RLS and no public policies.

Required Vercel Environment Variables:
- RESEND_API_KEY
- EMAIL_OTP_SECRET (at least 32 characters, different from WhatsApp secret)
- BUSINESS_EMAIL_FROM = LUVVA Secure Gateway <cmtgroup.tr@luvva.tech>
- BUSINESS_EMAIL_ALLOWED_DOMAINS = luvva.tech

Required setup:
1. Verify luvva.tech in Resend.
2. Run supabase/schema.sql in the Supabase SQL Editor.
3. Add the environment variables in Vercel Production, Preview and Development as needed.
4. Redeploy.
5. Test with info@luvva.tech, contact@luvva.tech, investors@luvva.tech or cmtgroup.tr@luvva.tech.


V7.7.1 DELIVERY FIX
- Default sender changed to noreply@luvva.tech.
- If BUSINESS_EMAIL_FROM equals the recipient mailbox, the API automatically uses noreply@luvva.tech to prevent self-forwarding suppression in Gmail/ImprovMX.
- Recommended Vercel value: BUSINESS_EMAIL_FROM=LUVVA Secure Gateway <noreply@luvva.tech>
