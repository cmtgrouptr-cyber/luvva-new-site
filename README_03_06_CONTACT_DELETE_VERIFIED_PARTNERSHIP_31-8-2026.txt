LUVVA 03_06 — Verified Contact Delete + Partnership CTA — 31-8-2026

Built directly on 03_05.

Fixes:
- Contact Delete no longer reports success when Supabase deleted zero rows.
- The server checks that the message exists, deletes it, then verifies that it is gone before the dashboard updates its list and counter.
- Supports both the modern Supabase Secret key (SUPABASE_SECRET_KEY) and the legacy service_role key (SUPABASE_SERVICE_ROLE_KEY).
- If Vercel contains a public/anon key instead of a privileged server key, the dashboard now shows the real configuration problem instead of a false success.
- Both Strategic Partnership buttons now open the existing secure Contact Us form and automatically select “Strategic partnership”, instead of opening an empty mailto action.

Preserved:
- Existing Contact Messages display, counter, Messages Today behavior, bell, red NEW/unread indicator and Gmail alert to cmtgroup.tr@gmail.com.
- No notification sound.
- Existing visual design and other website routes.

Android Google note:
- This archive contains the website, APIs and Supabase schema, but not the Android Studio project. Google sign-in inside the app WebView requires the Android project for a reliable external-browser/native sign-in handoff.
