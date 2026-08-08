LUVVA Google Login Final Recovery V3

- Google sign-in now uses server-side OAuth Authorization Code flow via /api/google-login.
- This avoids browser JavaScript origin_mismatch entirely.
- Uses the OAuth redirect URI already registered in Google Cloud: https://luvva.tech/api/google-login.
- Successful Google verification creates an HttpOnly, Secure, SameSite=Lax signed 25-minute session cookie.
- /api/google-session restores the verified session and opens LUVVA without returning to the gateway.
- Existing /api/google-auth remains in the package as a fallback/legacy endpoint but the main Google button no longer depends on Google Identity Services JS.
- No Google Client ID is hard-coded into front-end files.
