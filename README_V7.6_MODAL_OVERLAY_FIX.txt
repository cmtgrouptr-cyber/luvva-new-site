LUVVA V7.6 — Modal Overlay Hit-Test Fix

Root cause:
The authentication backdrop used author CSS display:grid, which overrides the browser hidden attribute.
The close routine also removed inline visibility/pointer-event protection on the next animation frame.
That could leave a transparent full-screen fixed layer above the provider buttons, swallowing every click until refresh.

Fix:
- Closed overlay is display:none and pointer-events:none.
- Open overlay is display:grid and pointer-events:auto.
- [hidden] is enforced with !important.
- closeProvider removes the overlay synchronously with no delayed requestAnimationFrame cleanup.
- Build marker: V7.6.0-modal-overlay-hit-test-fix.
