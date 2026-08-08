LUVVA V16 — Owner dashboard direct-route fix

Root cause confirmed from V15 + deployed Vercel Source:
- owner-code-verify redirected successful login to /api/owner-dashboard.
- That new API file was not present in the deployed repository, so Vercel returned 404.

Fix:
- Successful dashboard verification still sets the Secure HttpOnly owner-session cookie.
- HTTP 303 now redirects directly to the already-existing /dashboard.html.
- dashboard.html validates the same cookie through /api/admin-auth-check.
- No gateway design/UI changes.
- No dependency on adding a new API route.
