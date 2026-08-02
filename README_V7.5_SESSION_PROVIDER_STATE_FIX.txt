LUVVA Secure Gateway V7.5.0

Verified fixes in index.html:
- Removed the logic that disabled a different provider when an active session belonged to another provider.
- Different providers now proceed through fresh verification; only the same verified provider can resume without re-verification.
- Google Identity Services pending state is cancelled when closing/switching providers.
- Google button container is cleared to remove stale iframe/button state.
- Authentication backdrop is removed from hit-testing when closed and fully restored when reopened.
- Newly verified provider updates the in-memory saved visitor state.
- Runtime build marker: window.__LUVVA_GATEWAY_BUILD__ = "V7.5.0-session-provider-state-fix".

Deployment verification:
Open browser console and run:
window.__LUVVA_GATEWAY_BUILD__
Expected result:
V7.5.0-session-provider-state-fix
