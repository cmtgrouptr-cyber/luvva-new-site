LUVVA V7.0 — Google Authentication + Live Dashboard
=====================================================

WHAT IS NOW LIVE IN CODE
- Google Identity Services button remains visually unchanged.
- The Google ID token is sent to /api/google-auth.
- The server verifies the token audience and signature using google-auth-library.
- Only a verified Google email can continue.
- Supabase receives/updates visitor, identity, permission, session and audit records.
- Dashboard reads those shared records from /api/admin-visitors.
- Session duration is 25 minutes; reminders occur after 3 minutes and 5 minutes before expiry.

REQUIRED GOOGLE CLOUD SETTINGS
1. Create/select a Google Cloud project.
2. Configure OAuth consent screen / Google Auth Platform branding.
3. Create OAuth Client ID > Web application.
4. Add Authorized JavaScript origins:
   https://luvva.tech
   https://www.luvva.tech
   https://YOUR-VERCEL-DOMAIN.vercel.app
   http://localhost:3000 (local development only)
5. No Google redirect URI is needed for the GIS credential callback used by this package.
6. Copy the Client ID to GOOGLE_CLIENT_ID in Vercel environment variables.

REQUIRED SUPABASE SETTINGS
1. Create a Supabase project.
2. Open SQL Editor and run supabase/schema.sql.
3. Add SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY to Vercel.
4. Never expose SUPABASE_SERVICE_ROLE_KEY in HTML or client JavaScript.

REQUIRED VERCEL ENVIRONMENT VARIABLES
GOOGLE_CLIENT_ID=...
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_ACCESS_TOKEN=a-long-random-private-token
PUBLIC_BASE_URL=https://luvva.tech

DASHBOARD
- Open dashboard.html.
- Enter ADMIN_ACCESS_TOKEN.
- A successful Google login appears in the visitor table after refresh (automatic every 30 seconds).

SECURITY NOTE
GOOGLE_CLIENT_SECRET is not required by this GIS ID-token verification flow. It remains reserved for possible future authorization-code flows.
