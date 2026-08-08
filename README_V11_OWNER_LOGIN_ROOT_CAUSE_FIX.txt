LUVVA V11 — Owner Dashboard Login root-cause fix

Root issue addressed:
The owner-code verification succeeded, but dashboard authorization depended on a fragile browser handoff (sessionStorage + URL hash). If that handoff was lost/not read, dashboard's first /api/admin-visitors call returned 401 and immediately routed back to index.html, appearing as “no entry”.

V11 changes only this owner access path:
1. owner-code-verify sets a Secure HttpOnly SameSite=Lax owner session cookie after successful dashboard code verification.
2. authAdmin accepts either the existing Bearer token or the new owner cookie.
3. dashboard attempts server authorization on load even if browser storage is empty, and no longer auto-redirects away on the first 401.
4. successful code verification navigates to /dashboard.html after the server cookie is established.
5. code countdown is derived from server approved_at + exactly 60 seconds, eliminating client-side timer drift/restart ambiguity.

Existing Bearer/sessionStorage compatibility is retained as a fallback.
