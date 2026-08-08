LUVVA V20 — Dashboard Route Separation

- Website hidden key remains on its existing Website QR flow.
- Dashboard hidden key now has a fully separate modal, state, QR challenge and verification code flow.
- Dashboard challenge is created explicitly with access_type=dashboard.
- After Google approval and the 6-digit code, Dashboard login uses a real browser POST to /api/owner-code-verify with redirect=1.
- The server sets the HttpOnly owner session cookie and returns HTTP 303 to /dashboard.html.
- dashboard-direct.html preview is no longer referenced by the Dashboard hidden key.
