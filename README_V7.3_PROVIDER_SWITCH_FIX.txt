LUVVA V7.3 — Provider Switching / Modal Restore Fix

Fixes:
- Restores the authentication backdrop after it was hidden by a completed welcome transition.
- Allows Google, WhatsApp, WeChat and Business Email dialogs to open again without refreshing the gateway.
- Cancels pending Google render timers when closing or switching providers.
- Restores body scrolling and pointer events cleanly on modal close.
- Preserves the existing rule that an active remaining session credit belongs to its verified provider.
