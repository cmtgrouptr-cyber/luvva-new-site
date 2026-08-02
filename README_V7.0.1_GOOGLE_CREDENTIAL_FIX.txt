LUVVA V7.0.1 — Google Credential + Immediate Hover Audio Fix

- Keeps the successful Google Identity Services credential flow unchanged.
- Keeps the working /api/public-config and /api/google-auth server paths unchanged.
- Preserves the approved gateway design and 25-minute session flow.
- Provider movement remains a soft 1px lift, with a faster 95ms response.
- Audio engine is prepared on the earliest pointer movement and again on the first browser-approved gesture.
- Provider tone is bound directly to mouseenter/focus, with no touch-screen classification filter.
- Tone plays once per option entry and does not stack while the pointer remains over the same option.

Browser note: some browsers may still block all sound until the first click/key interaction. The code now attempts first-mouse-movement playback and uses the earliest permitted interaction as a guaranteed fallback.
