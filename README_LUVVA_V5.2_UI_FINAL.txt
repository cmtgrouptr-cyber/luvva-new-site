LUVVA SECURE GATEWAY & DASHBOARD — UPDATE 1
Version: V5.2

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

Folder and internal version names were reset to Professional Edition v5.0. No V6 folder name is retained.
