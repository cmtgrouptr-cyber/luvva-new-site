LUVVA V7.7.8

Changes:
- Hard reset of the authentication overlay after closing or switching providers.
- Password mode now verifies the configured business password server-side, then sends a signed email approval link.
- Verification Code mode remains the existing six-digit email OTP path.
- WhatsApp remains fully independent and uses WhatsApp OTP APIs only.

Required Vercel environment variables for Password mode:
- BUSINESS_EMAIL_PASSWORD_SHA256 (recommended: SHA-256 hex of the password), or BUSINESS_EMAIL_PASSWORD
- EMAIL_APPROVAL_SECRET (minimum 32 characters; EMAIL_OTP_SECRET is used as fallback)
- PUBLIC_SITE_URL (for example https://your-domain.example)
- RESEND_API_KEY
- BUSINESS_EMAIL_FROM

Existing OTP variables remain unchanged.
