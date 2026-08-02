LUVVA V7.0.1 — Google Credential + Gateway Audio Fix

- Built cleanly from the original V7.0 package.
- Keeps Google Identity Services credential callback; no OAuth redirect/code flow.
- Verifies the Google ID token on Vercel.
- Allows a verified 25-minute temporary session when Supabase is not configured yet.
- Retains the full Supabase Dashboard path automatically when its environment variables are added.
- Restores fast 1px provider hover movement.
- Restores a soft provider hover tone after the browser's first user gesture.
- Adds resilient waiting for the Google Identity Services script.
