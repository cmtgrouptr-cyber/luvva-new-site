LUVVA SUPER MASTER — 30-08-2026
Built ONLY from user master: luvaa-master-30-8-2026.zip

Fixes:
1. Contact submission: resolves verified provider identity when Google temporary identity uses google:<sub>.
2. Country is a selector and automatically applies international dialing prefix to phone submissions.
3. Hidden owner dashboard flow remains 5 taps + second 5 taps and bypasses the Administrator Access token screen in owner/preview flow.
4. Dashboard already displays contact submitted_at date/time in Visitor details; schema keeps submitted_at default now().
5. No visual redesign and no changes to Google login, sound, mobile key layout, or rotation fixes beyond the targeted fixes above.

CONTACT/DASHBOARD HOTFIX:
- Restores the deployable /api/contact-submit server route used by Contact Us.
- Resolves both database UUID identities and verified Google temporary identity references.
- Inserts every successful submission into contact_submissions, which admin-visitors already joins into the dashboard details.
- Keeps the dashboard entry screen and owner 5 + 5 tap flow unchanged.
- Displays the Contact Us phone row in stable LTR international format (+90 | number) and removes the duplicate (+90) from the Türkiye label.
