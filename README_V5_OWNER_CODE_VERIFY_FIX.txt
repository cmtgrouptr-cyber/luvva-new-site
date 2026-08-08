LUVVA V5 Owner Code Verify Fix

Fix included:
- Ensures api/owner-code-verify.js is included in the deployment package.
- Keeps Google owner verification flow from V4.
- Keeps manual Login button after successful 6-digit verification.
- Fixes the frontend JSON error caused when /api/owner-code-verify was missing and Vercel returned an HTML 404 page.

Required Vercel environment variables remain unchanged.
