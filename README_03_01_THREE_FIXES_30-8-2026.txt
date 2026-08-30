LUVVA 03_01 — Three requested fixes

1. Contact Messages: dashboard now merges direct API contacts with visitor-linked contact submissions and de-duplicates them, so clicking the counter shows the actual messages whenever returned by either source.
2. Refresh: returns the dashboard to the main overview, clears quick filters/search, closes the details drawer, then reloads fresh server data.
3. Contact form: after a successful Send, the saved contact draft is removed and all form fields are cleared while the success confirmation is shown.

Files changed:
- dashboard.html
- index.html

No visual redesign. Existing API and site structure preserved.
