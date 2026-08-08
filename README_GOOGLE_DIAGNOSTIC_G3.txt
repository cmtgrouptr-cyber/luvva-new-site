LUVVA GOOGLE DIAGNOSTIC G3
Purpose: isolate Google verification from the rest of the site.
After choosing a Google account:
- If a green screen says GOOGLE VERIFIED SUCCESSFULLY, Google credential + /api/google-auth + verifyIdToken are all working.
- If the existing Google error remains, failure is before the site-opening logic.
This build intentionally does NOT open the LUVVA site after Google success.
