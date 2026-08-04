LUVVA Secure Gateway V7.7.3 - Full Business Email OTP Stable

Confirmed fixes:
- Corrects @luvval.tech to @luvva.tech in the browser, send API, and verify API.
- Normalizes BUSINESS_EMAIL_ALLOWED_DOMAINS so an old luvval.tech value cannot block the corrected address.
- Uses noreply@luvva.tech when BUSINESS_EMAIL_FROM is invalid or equals the recipient.
- Keeps Supabase OTP storage and verification unchanged.
- Returns the normalized recipient in the successful send response for diagnostics.

Upload this package as a complete project to replace the old deployment.
Required Vercel variables remain:
RESEND_API_KEY
BUSINESS_EMAIL_FROM=LUVVA Secure Gateway <noreply@luvva.tech>
EMAIL_OTP_SECRET (32+ characters)
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
BUSINESS_EMAIL_ALLOWED_DOMAINS=luvva.tech (optional)
