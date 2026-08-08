LUVVA Owner Secure Access V7
- Fixes false Expired result caused by a race between QR status polling and Google owner approval.
- Pending QR lifetime: 3 minutes.
- Polling may expire only rows that are still pending, using a conditional server update.
- Google approval transitions pending -> approved conditionally.
- Six-digit code validity is calculated from approved_at for 5 minutes, independent of the QR expiry timestamp.
- Code consumption transitions approved -> used conditionally to preserve one-time use.
- No changes to Google visitor login, Business Email, WhatsApp, WeChat, gateway design, or dashboard design.
