LUVVA GOOGLE RECOVERY FINAL V4

Fixes:
- Uses the exact Google OAuth Client ID from the LUVVA Secure Gateway Google Cloud project:
  399120453126-1mgl52l87784rjkpr7361b461vmdjktl.apps.googleusercontent.com
- /api/public-config and /api/google-auth now use the same Client ID, independent of a mismatched Vercel GOOGLE_CLIENT_ID environment value.
- Keeps the original working Google Identity Services flow and existing /api/google-auth route.
- Creates the LUVVA browsing session immediately after successful Google verification.
- If the browser reloads/restores after Google verification, an active Google session resumes the website directly instead of returning to the gateway.
- No new API route was introduced.
- No Google Client Secret is required for this Google Identity Services flow.
