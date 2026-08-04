LUVVA V7.7.2 — Business Email Domain Typo Fix

Fix:
- Automatically corrects the common typo @luvval.tech to @luvva.tech
  in both email OTP send and verification endpoints.
- This prevents OTP messages from being sent to the non-existent luvval.tech domain.
- Existing noreply@luvva.tech sender fallback is preserved.

Files changed:
- api/email-otp-send.js
- api/email-otp-verify.js
