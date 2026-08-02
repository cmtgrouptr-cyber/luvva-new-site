LUVVA V7.2 – Google Client Bootstrap Fix

What changed:
- The public Google OAuth Client ID is embedded in the page as a safe public configuration value.
- /api/public-config keeps reading GOOGLE_CLIENT_ID from Vercel and falls back to the approved Client ID.
- /api/google-auth verifies Google ID tokens with the same approved Client ID fallback.
- The Google Client Secret is NOT embedded anywhere in this package.

Deployment:
1. Upload the contents of this ZIP to the Vercel project root.
2. Redeploy Production.
3. Hard refresh the site (Ctrl+F5).
4. Test Continue with Google.

Security note:
The previously displayed Google Client Secret must be rotated in Google Cloud and replaced in Vercel. Google Identity Services ID-token verification does not expose or require the secret in browser code.
