LUVVA Provider Entry Reset Fix

Scope: only the blocking issue that required a page refresh before choosing another sign-in provider.

Changes in index.html:
- Added one deterministic forceCloseAuthBackdrop() cleanup routine.
- Closed the authentication backdrop synchronously with display:none and pointer-events:none.
- Reset stale provider state before every provider selection.
- Kept the backdrop hidden when returning to the gateway until a provider is selected.
- Cancelled pending Google work and re-enabled the submit state during close/switch.
- No changes to email OTP, Gmail delivery, WhatsApp OTP, visual styling, or other authentication logic.

Build marker:
window.__LUVVA_GATEWAY_BUILD__
Expected: V7.7.5-provider-entry-reset-fix
