LUVVA V21 — Dashboard QR Same-Origin Fix

Confirmed cause addressed:
- The normal Google sign-in in index.html already works on the live LUVVA origin.
- owner-challenge-create.js previously preferred PUBLIC_BASE_URL when building the QR approval URL.
- If PUBLIC_BASE_URL points to another deployment/alias (for example a vercel.app host), scanning the QR opens Google from a different origin and Google returns 400 origin_mismatch.

V21 fix:
- The QR approval URL is now built from the exact live request origin (x-forwarded-proto + x-forwarded-host/host).
- No Google Cloud settings are changed.
- No Vercel environment variables are changed.
- Website and Dashboard challenge types remain separated.
- owner-approve.html and the existing Google owner verification API are retained.
