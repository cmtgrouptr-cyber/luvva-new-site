LUVVA V12 — Owner Login Trace / Root-Cause Isolation Fix

This build separates owner authentication from dashboard data loading.
1. /api/admin-auth-check verifies only the owner session.
2. dashboard.html no longer treats every /api/admin-visitors failure as an authentication failure.
3. Successful code verification hands the session by HttpOnly cookie + sessionStorage + URL hash fallback.
4. audit_log failure after a valid code is non-blocking; it can no longer consume the code and then prevent the success response.
5. The code remains valid for 60 seconds from Google approval.

No gateway visual design changes.
