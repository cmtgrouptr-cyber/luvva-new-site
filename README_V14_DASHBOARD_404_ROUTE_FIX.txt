LUVVA V14 — Dashboard 404 route fix

Confirmed symptom: successful owner code verification reached Vercel, then Vercel returned 404 NOT_FOUND for the static dashboard redirect target.

Fix:
- Keep the proven real form POST and server-side owner code verification.
- Keep the Secure HttpOnly owner session cookie.
- Replace the fragile redirect to /dashboard.html with /api/owner-dashboard.
- New authenticated server route serves the existing dashboard HTML directly after validating the owner cookie.
- No gateway design/provider behavior changes.
