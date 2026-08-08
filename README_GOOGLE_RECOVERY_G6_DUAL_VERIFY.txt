LUVVA Google Recovery G6

- Restores normal Google success flow into the same LUVVA welcome/site path used by verified sessions.
- Primary verification: google-auth-library verifyIdToken.
- Independent fallback verification: Google's oauth2 tokeninfo endpoint with explicit checks for aud, iss, exp and email_verified.
- Supabase persistence remains best-effort and cannot turn a valid Google identity into a failed login.
- No Google Client Secret is required.
- No Google Cloud settings are changed by this package.
