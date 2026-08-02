LUVVA Secure Gateway V7.3

Main fix
- Separates Google ID-token verification from Supabase persistence.
- If Supabase server variables are not configured yet, a verified temporary 25-minute session is created after Google confirms the identity.
- When Supabase variables are later added, the same endpoint automatically uses full database/dashboard persistence.

Refinement
- Provider hover movement reduced to a subtle 1px premium lift.
- Added a very low, short navigation tone on desktop hover/focus only.
- No hover sound or movement is forced on touch devices.

Security
- GOOGLE_CLIENT_SECRET remains server-side and is never sent to the browser.
- Rotate the previously exposed Google Client Secret in Google Cloud after confirming this release.
