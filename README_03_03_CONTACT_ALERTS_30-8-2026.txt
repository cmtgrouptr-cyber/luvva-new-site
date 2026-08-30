LUVVA 03_03 — Contact Alerts
Base: 03_02_LUVVA_CONTACT_DELETE_30-8-2026

Added:
- Visual unread alert on Contact messages: bell + red indicator + NEW count.
- Individual unread rows display NEW.
- Opening Contact messages marks currently unread messages as read in Supabase.
- Existing Delete -> Confirm -> permanent delete behavior is preserved.
- New contact submissions send a best-effort email alert to cmtgroup.tr@gmail.com using the existing RESEND_API_KEY.
- No notification sound.

IMPORTANT DATABASE STEP:
Run the updated supabase/schema.sql once in Supabase SQL Editor so contact_submissions gets the read_at column. The statement uses IF NOT EXISTS and is safe to run against the existing schema.

Vercel:
- Existing RESEND_API_KEY is reused.
- CONTACT_ALERT_TO is optional because the code defaults to cmtgroup.tr@gmail.com.
