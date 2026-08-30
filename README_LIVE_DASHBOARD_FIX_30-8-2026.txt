LUVVA LIVE DASHBOARD FIX — 30-08-2026

Scope: only the hidden owner-dashboard handoff and dashboard preview detection.

Root cause found:
- index.html explicitly stored luvvaDashboardPreview=1 and opened dashboard.html?preview=1&owner=1.
- dashboard.html treated owner=1 as PREVIEW, so /api/admin-visitors was never called.
- This forced the three demo rows (M. Investor / Business Visitor / Trusted Contact) even though dashboard_visitors in Supabase was valid.

Fix:
- Owner dashboard handoff now clears the stale preview flag and opens dashboard.html?owner=1.
- dashboard.html no longer interprets owner=1 as preview.
- Explicit ?preview=1 remains available only when not in owner mode.
- No changes to Google login, Contact Us, Supabase schema, API data mapping, sound, mobile layout, rotation logic, styling, or other site sections.

Security behavior intentionally preserved:
- Live /api/admin-visitors and /api/admin-action remain protected by ADMIN_ACCESS_TOKEN.
- Therefore, if the current browser session does not already contain luvvaAdminToken, the Administrator Access prompt will appear. This is necessary to avoid exposing live visitor/admin data based only on client-side clicks.
