LUVVA V7.5 – Google Code Flow Fix

- Replaces the unreliable FedCM ID-button callback with Google OAuth authorization-code popup flow.
- The browser receives only a one-time code.
- Vercel exchanges the code securely using GOOGLE_CLIENT_SECRET.
- Google ID token is verified server-side.
- Creates a verified temporary 25-minute session.
- Keeps the approved hover motion and soft navigation sound unchanged.

Required Vercel variables:
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

Google Cloud Authorized JavaScript origins:
https://luvva.tech
https://www.luvva.tech
http://localhost:3000
