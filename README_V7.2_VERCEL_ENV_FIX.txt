LUVVA V7.2 — Meta WhatsApp Vercel Environment Fix

Changes:
1. The WhatsApp API now reads the Vercel variable names already configured:
   WHATSAPP_ACCESS_TOKEN
   WHATSAPP_PHONE_NUMBER_ID
   WHATSAPP_BUSINESS_ACCOUNT_ID
2. Older META_WHATSAPP_* names remain supported for compatibility.
3. Default template name: luvva_login_code; language: en_US.
4. WHATSAPP_OTP_SECRET can fall back to SUPABASE_SERVICE_ROLE_KEY during setup.
5. The gateway now displays the real server/Meta error instead of always showing a generic unavailable message.

Still required before a successful send:
- An approved Meta WhatsApp template named luvva_login_code (or set WHATSAPP_TEMPLATE_NAME to the approved template name).
- The destination number must be added as a test recipient while using Meta's test number.
- Run the whatsapp_otp_challenges table SQL in Supabase if it has not already been created.
- Redeploy on Vercel after uploading this version.
