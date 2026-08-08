LUVVA Google Recovery Final V5

Fixes a confirmed logic bug in V4:
- Google ID token verification is authoritative.
- Supabase persistence is now best-effort and can no longer convert a valid Google login into HTTP 401.
- After /api/google-auth confirms approved=true, the gateway unlocks immediately and starts the local browsing session.
- No new callback route. No /api/google-login. No Google Cloud changes required by this build.
