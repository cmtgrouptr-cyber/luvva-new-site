LUVVA Secure Gateway — V37

Visual refinement
- Contact information rows now use a unified dark leather-like background matching the CMT logo panel.
- Text uses a clearer premium Montserrat/Segoe UI stack and a restrained metallic-gold tone based on the logo lettering.
- The outer CMT card, logo frame, cool white/grey/sky-blue shadows and overall layout remain unchanged.

WhatsApp verification
- The existing WhatsApp OTP connection remains server-side through Twilio Verify.
- Required Vercel variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID.
- The API sends and verifies the code; the browser never accepts a test/random code.

Controlled 25-minute trial policy (prototype/device level)
- Each official entrance (Business Email, Google, WhatsApp, LinkedIn) can provide one fresh 25-minute trial if contact details were not completed.
- A used entrance cannot be reused after its session expires; another unused entrance may provide a new 25-minute trial.
- When all four entrances are exhausted without contact completion, access is paused and a CMT contact screen appears.
- Completing the required Contact form clears the trial restrictions.
- Administration prototype unlock hook: run window.luvvaAdminUnlockAccess() in the same browser, or connect this action to dashboard.html.

Important production note
- The trial ledger currently uses localStorage, so it protects the current browser/device only. True cross-device identity matching, global blocking, dashboard unlock, Google/LinkedIn OAuth, and durable visitor records require a server database and authenticated admin API.
