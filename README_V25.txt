LUVVA Secure Gateway V25 — Gateway Return With Remaining Session Credit

Changes:
- Every new opening/reload returns to the secure gateway even when the 45-minute session is active.
- The remaining session time is preserved in localStorage.
- The visitor must re-enter through the same provider originally used.
- During the remaining active credit, WhatsApp does not request a second OTP.
- Choosing another provider is blocked until the current session expires.
- The main-page session timer continues from the remaining time and never resets on return.
- The 3-minute reminder remains tied to the original session start.

Test flow:
1. Enter by WhatsApp and verify the test OTP.
2. Reach the website.
3. Close the tab or reload/open index.html again.
4. The gateway appears.
5. Choose WhatsApp again and press Continue current session.
6. The same remaining session credit continues without a new OTP.
