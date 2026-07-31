LUVVA Secure Gateway — V24 WhatsApp OTP Test

Changes:
- Added a required two-step WhatsApp verification flow.
- Step 1 validates the WhatsApp number and generates a 6-digit test OTP.
- Step 2 requires the correct OTP before the welcome screen and visitor session begin.
- Reminder now appears after 3 minutes.
- Reminder notes that visitor details can be entered or updated from the Contact button.
- Existing 45-minute session restoration and local visitor dashboard data remain intact.

Important:
This package simulates OTP locally for interface testing. Real WhatsApp delivery requires a secure backend and a WhatsApp Business/Cloud API provider. Never place provider secrets in index.html.
