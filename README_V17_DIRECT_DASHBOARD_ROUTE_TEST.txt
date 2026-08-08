LUVVA V17 — Temporary direct dashboard route diagnostic

Purpose:
- Bypass ONLY the Dashboard QR/code layer temporarily.
- Keep the hidden five-tap Dashboard key.
- After five taps, the existing modal shows Login.
- Login navigates directly to /dashboard.html?luvva_route_test=1.
- The dashboard uses local preview rows only for this diagnostic query, so no real admin data is exposed and no owner authentication is required for the route test.
- Normal /dashboard.html remains protected by the existing admin-auth-check flow.
- Website hidden-key QR flow is unchanged.
- No visual redesign.

After confirming the direct route opens, remove this diagnostic bypass and reconnect QR verification to the proven dashboard path.
