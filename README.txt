LUVVA Gateway Login Windows V4 — Welcome Screen Test

What changed:
- Added a dedicated welcome screen after submitting any login window.
- The exact original gateway heart/head element is moved into the welcome screen, preserving the same golden path animation and timing.
- Added low heartbeat pairs synchronized through the welcome sequence.
- Welcome screen fades into the website automatically after about 5.6 seconds.
- Authentication validation is intentionally bypassed in this prototype so every provider window can be tested quickly.
- No passwords or verification codes are stored.

Test flow:
1. Open index.html.
2. Choose Business Email, Google, WhatsApp, or LinkedIn.
3. Press the window's Continue/Send button; test data is not required.
4. Confirm the welcome screen, golden animation, heartbeat sound, and automatic website transition.

Important:
Real provider authentication will be connected later after the welcome experience is approved.
