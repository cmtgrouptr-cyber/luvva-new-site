0001 UPDATE SCREEN
Base: SMS83_SESSION_NAVIGATION_SMOOTH_FINAL.zip
Scope: Refresh / same-tab session initialization only.

Root cause addressed:
1) Gateway was visible by default until restoreVisitorSession() ran near the end of the document, allowing a gateway flash before a valid session was restored.
2) Same-tab authorization depended only on sessionStorage. On some mobile reload/restore paths this could be unavailable at the instant restore logic ran, causing a valid local visitor session to be treated as unauthorized and the gateway to appear.

Fix:
- Added synchronous pre-paint validation of the existing visitor session before the first paint.
- Added a same-tab history.state authorization marker as a fallback to sessionStorage; it survives reload in the same history entry without converting authorization into a general cross-tab localStorage bypass.
- restoreVisitorSession() repairs sessionStorage from the history marker and keeps the gateway hidden while the valid session is resumed.
- Invalid/expired/unauthorized sessions explicitly remove the pre-paint state and still show the secure gateway.
- Logout clears session/local auth data and the current history authorization marker before returning to the gateway.

No design, navigation order, Brief, Investor, CMT Story, media, language, or gateway provider changes were made.
