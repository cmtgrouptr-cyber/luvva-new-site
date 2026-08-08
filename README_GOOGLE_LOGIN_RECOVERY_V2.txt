LUVVA — Google Login Stable Recovery V2

Purpose
- Fixes the observed behavior where Google account selection succeeds, LUVVA starts opening,
  then the browser returns to the secure gateway/login page.

Change
- The verified Google visitor and local browsing session are now persisted immediately after
  /api/google-auth returns success, BEFORE the 8-second Welcome transition.
- A short-lived recovery marker allows LUVVA to finish the Welcome/unlock sequence automatically
  if the browser reloads or returns to index.html during that transition.
- The marker is removed after the site unlocks.

Not changed
- Google Cloud OAuth configuration.
- GOOGLE_CLIENT_ID handling.
- /api/public-config.
- /api/google-auth token verification.
- Business Email, WhatsApp, WeChat, dashboard files, owner access, site content/design.
