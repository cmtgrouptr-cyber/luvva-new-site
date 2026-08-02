LUVVA V7.8 – Google ID Token Authentication Fix

- Replaced the OAuth authorization-code exchange with the official Sign in with Google ID-token button.
- Google returns a signed JWT credential directly to the browser callback.
- /api/google-auth verifies that JWT against GOOGLE_CLIENT_ID and creates the 25-minute session.
- GOOGLE_CLIENT_SECRET is not required by this authentication path and is never exposed to the browser.
- AudioContext is now primed on the same click that opens a provider modal; browser autoplay rules still require an initial user interaction.
