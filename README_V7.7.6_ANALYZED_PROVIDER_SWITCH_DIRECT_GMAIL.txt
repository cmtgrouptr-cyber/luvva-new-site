LUVVA V7.7.6 — Analyzed Full Build

Base:
- V7.7.3 full stable project (includes the existing V7.3/V7.6 provider backdrop fixes).

API:
- Entire API folder replaced by V7.7.5 Direct Gmail Delivery Fix.
- Only email-otp-send.js differs from V7.7.3 inside the V7.7.5 API package.

Targeted provider-switch correction:
- Provider modal opening no longer awaits AudioContext.resume().
- Audio playback is now best-effort and cannot block a second provider from opening.
- Closing the provider modal also restores document/dialog hit-testing and scrolling.

No UI redesign was added.
