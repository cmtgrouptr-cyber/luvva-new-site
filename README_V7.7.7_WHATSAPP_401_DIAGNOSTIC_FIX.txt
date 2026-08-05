LUVVA Secure Gateway V7.7.7 — WhatsApp 401 Diagnostic Fix

Scope: API only. No design, Google, Business Email, dashboard, or provider-navigation changes.

Changes:
- Trim whitespace/newlines from WhatsApp token, Phone Number ID, template name/language, and Graph API version.
- Preserve Meta HTTP status.
- Return and log Meta error code, error_subcode, type, fbtrace_id, used Phone Number ID, API version, token presence/length, and only the last 6 token characters.
- Never expose the full token.
- Correct the example Phone Number ID to 440660250340036.

Purpose:
The previous endpoint reduced Meta's response to a generic Authentication Error, which prevented evidence-based isolation. The next failed request will identify whether the rejection is an expired/invalid token, app/WABA mismatch, permission issue, or another Meta-side condition.
