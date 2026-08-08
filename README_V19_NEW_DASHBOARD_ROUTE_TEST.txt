LUVVA V19 — NEW DASHBOARD ROUTE TEST

Purpose: isolate the Dashboard completely from the previous QR/owner-challenge route.

Dashboard hidden control (5 taps):
  index.html -> dashboard-direct.html?luvva_direct_route=v19

This route does NOT call:
  /api/owner-challenge-create
  /api/owner-challenge-status
  /api/owner-code-verify

The Website hidden control keeps its existing QR verification flow.

This is intentionally a route test only. After this path is confirmed working, QR security can be added to this new path without reusing the old Dashboard route.
