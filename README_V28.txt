LUVVA Secure Gateway — V28

Changes:
- Session timer kept in the clear upper-right position.
- Added soft gray and burgundy frame shadows.
- Added a calm repeating flash while the numbers continue counting.
- Clicking or pressing Enter on the timer opens the Gentle Reminder again.
- WhatsApp OTP requests now stop with a clear error after a timeout instead of spinning indefinitely.
- Real WhatsApp delivery still requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID in Vercel, followed by Redeploy.
- An existing active session remains tied to its original provider; end/clear that session before testing another provider.
