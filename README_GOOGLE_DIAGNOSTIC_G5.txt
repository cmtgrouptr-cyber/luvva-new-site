LUVVA GOOGLE DIAGNOSTIC G5

Purpose:
- Corrects the G4 diagnostic-only JavaScript error: decodeJwtPayload is not defined.
- Uses the already-existing decodeGoogleCredential() helper.
- Does not change Google Cloud settings, Client ID, Supabase policy, or production login behavior beyond the diagnostic checkpoint.

Expected result after choosing a Google account:
1. If the browser receives a credential and the server rejects it, a diagnostic page shows stage, HTTP status, token audience, expected audience, audience match, and verify error.
2. If verifyIdToken succeeds, a green GOOGLE VERIFIED SUCCESSFULLY screen appears.

No credential/token/password/client secret is printed.
