LUVVA Secure Gateway V26

Changes:
1. Session timer moved to the lower-right corner so it no longer covers Investor Brief.
2. Every provider button opens its data window. During an active return session, a different provider opens with a clear warning and cannot consume another provider's remaining credit.
3. WhatsApp no longer accepts a random number or displays a test code. It calls secure server endpoints and enters only after the verification response is approved.
4. The 45-minute balance is active browsing time. It pauses when the visitor closes/leaves the page or is at the gateway, and resumes only after re-entering the site.
5. The three-minute reminder is also based on active browsing time.

To activate real WhatsApp messages on Vercel, add these Environment Variables:
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_VERIFY_SERVICE_SID

Then redeploy. Never put these secret values inside index.html or GitHub source files.
