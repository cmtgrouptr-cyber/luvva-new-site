LUVVA Secure Gateway V7.9

- Uses google-auth-library first and official Google tokeninfo as a verification fallback.
- Returns a safe, visible verification stage/message instead of a generic failure.
- Keeps local 25-minute session fallback when Supabase is not configured.
- Uses any-hover for hybrid laptops so mouse hover sound is not disabled by a touchscreen.
- Reduces provider hover lift to 1px.

Browser audio policy: initial hover sound cannot play before the first click/key interaction. After the first interaction, hover tones are enabled.
