LUVVA Dashboard Live Patch — 30-08-2026

Changes:
1. Owner Dashboard button now opens dashboard.html in LIVE mode, not preview/demo mode.
2. Dashboard can no longer display the three hard-coded demo visitors.
3. Live visitor rows are loaded only from /api/admin-visitors (Supabase).
4. Contact Us details remain linked through contact_submissions and appear under Details.
5. Added a Contact status filter to quickly show only visitors who submitted Contact Us.
6. Hardened ADMIN_ACCESS_TOKEN comparison to safely reject wrong-length tokens.

Not changed:
- Google login
- WhatsApp login
- Mobile UI/rotation
- UI sounds
- Website design/content

Required Vercel environment variables for live dashboard:
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ADMIN_ACCESS_TOKEN
