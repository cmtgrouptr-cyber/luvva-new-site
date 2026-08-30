LUVVA 03_02 — Contact Message Delete
Base: 03_01_LUVVA_THREE_FIXES_30-8-2026

Change only:
- Added a Delete button beside every Contact Message.
- Delete requires browser confirmation: "Delete this message?"
- Confirmed deletion removes the record from Supabase contact_submissions.
- Dashboard reloads immediately so the Contact Messages counter decreases automatically.
- Added protected endpoint: /api/admin-contact-delete
- Existing dashboard/contact fixes and visual design are otherwise unchanged.
