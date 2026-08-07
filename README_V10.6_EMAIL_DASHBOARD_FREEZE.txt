LUVVA V10.6 — EMAIL + DASHBOARD + PROVIDER FREEZE

Main gateway:
- WhatsApp button remains visible but is frozen/inert.
- WeChat button remains visible but is frozen/inert.
- Their existing dialogs, API files and internal code are preserved for later reactivation.
- All four sign-in options are forced into one clean vertical stack.

Business Email:
- Verification Code is now the default and only active Business Email sign-in mode.
- Password mode remains in the UI but is disabled until a real server-side password account system exists.
- Any valid organization-owned email domain can request an OTP.
- Common consumer/free email domains are rejected from Business Email and can use Google instead.
- Optional strict allow-list remains available with BUSINESS_EMAIL_REQUIRE_ALLOWLIST=true.

Dashboard integration:
- Successful Business Email OTP verification now creates/updates visitor, identity, permission and session records in Supabase.
- Verified Business Email visitors therefore appear in dashboard.html automatically.
- New identities receive temporary 25-minute access by default.
- Existing dashboard controls can extend, make permanent/trusted, block or unblock them.
- Blocked identities cannot re-enter through Business Email.

No WhatsApp/WeChat backend files were deleted.
