LUVVA Secure Gateway V7.1 – Google Sign-In Fix

Changes:
- Prevents the Google screen from remaining on an endless loading spinner.
- Loads GOOGLE_CLIENT_ID from /api/public-config with no-cache.
- Waits safely for Google Identity Services instead of checking only once.
- Attempts to open Google's native account chooser automatically.
- Keeps the official Google button visible as a reliable fallback.
- Displays actionable errors if Google configuration or scripts cannot load.

Deployment:
1. Upload this folder/ZIP to Vercel.
2. Keep GOOGLE_CLIENT_ID configured for Production and Preview.
3. Redeploy Production.
4. Test Continue with Google.

Security note:
The Google Client Secret previously appeared in a screenshot. Rotate it in Google Cloud and replace GOOGLE_CLIENT_SECRET in Vercel. The browser sign-in flow itself uses the Client ID; the secret must remain server-side only.
