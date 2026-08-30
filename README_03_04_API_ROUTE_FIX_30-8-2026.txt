LUVVA 03_04 API ROUTE FIX — 30-8-2026
Based directly on 03_03.

Fixes:
- Contact Delete and Contact Read now use the already-established /api/admin-action endpoint.
- Removed the two extra admin-contact API files to avoid deployment/routing failures.
- Dashboard API parser now handles non-JSON server errors safely instead of showing "Unexpected token ... not valid JSON".
- Preserves Contact Delete -> Confirm -> permanent delete.
- Preserves bell / NEW / unread behavior and contact email alert to cmtgroup.tr@gmail.com.
- No sound added.
- No additional Supabase SQL is required beyond the read_at column already added for 03_03.
