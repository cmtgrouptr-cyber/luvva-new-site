LUVVA Contact — V1

Scope of this patch:
- Adds the primary company email: cmtgroup.tr@luvva.tech, followed by contact@luvva.tech and partnership@luvva.tech.
- Adds the supplied WhatsApp and WeChat QR images.
- Adds a QR for the supplied Google Maps location.
- Changes Contact -> Send Securely from browser-only localStorage to the server API /api/contact-submit.
- The server links each submission to the verified identity/visitor and stores it in contact_submissions.
- Administration Dashboard now loads the latest contact details for each visitor.

IMPORTANT DATABASE STEP:
Run the SQL in supabase/schema.sql (or the included ALTER statements) against the project's Supabase database before testing Contact submissions. The existing contact_submissions table is extended with position, country, interest and consent columns.

No Google, WhatsApp OTP, gateway, About CMT, archive video, or other unrelated logic was intentionally changed.
