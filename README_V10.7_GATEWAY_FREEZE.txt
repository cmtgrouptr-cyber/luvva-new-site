LUVVA V10.7 — MAIN GATEWAY FREEZE

Changes intentionally limited to the main gateway:
- WhatsApp button is frozen and cannot open its OTP modal.
- WeChat button is frozen and cannot open its authorization flow.
- Their internal pages/API files were NOT deleted.
- Business Email and Google remain active.
- All four provider buttons are stacked vertically in one column.
- Visible version badge changed to V10.7 so deployment can be verified immediately.
- Business Email server flow continues to accept verified organization-owned domains (consumer/free domains remain routed to Google), unless strict allow-list mode is explicitly enabled by environment variable.
