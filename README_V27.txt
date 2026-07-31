LUVVA Secure Gateway — V27

CHANGES
1. Session timer moved from the bottom to a clearly visible floating position below the top navigation, without covering Investor Brief.
2. WhatsApp flow remains strictly two-step:
   - Enter real WhatsApp number and request code.
   - Enter the received verification code.
   - Only an approved server response opens the Welcome screen and then the website.
3. API functions were made compatible with Vercel Node serverless functions.
4. No random number and no local/test code can open the website.

REQUIRED FOR REAL WHATSAPP DELIVERY
Upload the COMPLETE project to GitHub, including the api folder and package.json.
Then in Vercel > Project > Settings > Environment Variables add:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_VERIFY_SERVICE_SID

Add them for Production, Preview and Development if all environments will be tested.
After saving, redeploy the project.

IMPORTANT
Do not place secret values in GitHub, index.html, JavaScript, README, or any public file.
Until those three environment variables are configured and the project is redeployed, the WhatsApp field will correctly refuse to continue because no real verification service is connected.
