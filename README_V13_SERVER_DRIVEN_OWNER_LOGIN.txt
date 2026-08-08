LUVVA V13 — Server-driven Dashboard owner login

Root-flow change:
- Dashboard Login no longer relies on a JavaScript redirect after fetch.
- The Login button performs a real HTTPS POST to /api/owner-code-verify.
- On a valid code the server consumes the one-time code, sets the Secure HttpOnly owner session cookie, and responds HTTP 303 directly to /dashboard.html.
- This removes client-side redirect, sessionStorage, hash handoff, and second-click races from the critical path.
- Website owner access flow is unchanged.
- Code validity remains 60 seconds from Google approval.
