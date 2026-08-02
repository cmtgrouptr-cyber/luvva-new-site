LUVVA Secure Gateway V7.1 — Meta WhatsApp OTP

Implemented:
- Replaced Twilio Verify in the WhatsApp endpoints with Meta WhatsApp Cloud API.
- Generates a six-digit OTP on the server.
- Sends the OTP using an approved Meta Authentication Template.
- Stores only an HMAC hash of the OTP in Supabase.
- OTP expires after 5 minutes and can be used once.
- Maximum 5 verification attempts.
- One-minute resend cooldown.
- Google login, approved gateway design, audio, dashboard and all other files were preserved.

Before deployment:
1. Run the updated supabase/schema.sql in Supabase SQL Editor.
2. Create and approve an Authentication Template in Meta. Default expected name: luvva_login_code, language: en_US.
3. Add all values from .env.example to Vercel Environment Variables.
4. Put the Access Token only in META_WHATSAPP_ACCESS_TOKEN; never place it in HTML, GitHub or screenshots.
5. Redeploy and test with a Meta test recipient.

Final security step before public launch:
- Generate a fresh production/system-user Access Token.
- Revoke the temporary token shared during development.
- Keep the new token only in Vercel encrypted Environment Variables.
