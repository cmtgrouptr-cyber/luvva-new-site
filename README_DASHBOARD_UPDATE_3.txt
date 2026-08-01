LUVVA SECURE GATEWAY & DASHBOARD — UPDATE 1
Version: DU-3.0

Included in this package:
- Updated Secure Gateway with LinkedIn removed.
- Official Google Identity Services button container (requires GOOGLE_CLIENT_ID).
- Business Email choice: LUVVA password or email verification code.
- WhatsApp OTP in the same dialog with a 60-second resend countdown.
- Direct transition from successful verification to the Welcome screen.
- 45-minute visitor session.
- Unified Dashboard for visitor identities, permissions, session extension, blocking, CSV export and JSON backup.
- Supabase starter schema for identities, permissions, sessions, notifications and audit logging.
- Environment variable template.

Important deployment status:
- WhatsApp endpoints require valid Twilio Verify credentials in Vercel.
- Google requires a Google OAuth Web Client ID and authorized luvva.tech origins.
- Business email OTP endpoints are safe placeholders until Supabase and an email provider are configured.
- The current dashboard can display and manage local test records. Cross-device operation starts after connecting Supabase and replacing localStorage writes with server API calls.
- Passwords and OTP codes are never written to the browser log or dashboard.

Folder and internal version names were reset to Dashboard Update 3. No V6 folder name is retained.


UPDATE 3 FINAL GATEWAY REFINEMENTS
- Removed internal scrolling from provider windows on standard laptop and mobile viewports.
- Added compact, provider-specific modal heights and unified spacing.
- Google uses the official Google Identity Services account chooser when the production Client ID is configured.
- WhatsApp OTP remains inside the same window; the reset option appears only after code dispatch.
- Added a short gold identity-verified confirmation before the Welcome screen.
- Unified button dimensions and reduced excess whitespace.

Update 3 addition:
- Added WeChat as a fourth secure entrance beneath WhatsApp.
- Prepared a premium WeChat authorization panel for official OAuth / QR integration.
- Live WeChat authorization requires the official WeChat App ID and approved redirect domain.
