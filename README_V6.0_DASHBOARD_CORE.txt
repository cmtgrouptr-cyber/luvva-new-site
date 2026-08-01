LUVVA Secure Gateway V6.0 — Dashboard Core & Owner Secure Access

Implemented:
- New professional one-page Dashboard Core.
- Server-side visitor list and admin action APIs.
- Supabase schema for identities, sessions, permissions, contacts, admins, audit log and owner challenges.
- Hidden lower-left Website Access and lower-right Dashboard Access zones.
- Five consecutive clicks reveal a 60-second, one-use QR.
- Mobile approval page with owner PIN confirmation.
- Server-side audit logging and no password/OTP storage.

Production setup required:
1. Create Supabase project and run supabase/schema.sql.
2. Configure .env values on hosting; never publish SERVICE_ROLE_KEY or OWNER_APPROVAL_PIN.
3. Run npm install during deployment for QR generation.
4. Set PUBLIC_BASE_URL to the production domain.
5. Replace PIN approval with passkey/push authentication when the owner mobile app is available.

Security note: hidden click zones are convenience only, not authentication. Access is granted only after the server challenge and registered-owner confirmation.
