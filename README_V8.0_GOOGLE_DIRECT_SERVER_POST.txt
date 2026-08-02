LUVVA Secure Gateway V8.0

- Replaces the non-firing browser Google callback with a direct Google POST to /api/google-login.
- The Vercel endpoint validates Google CSRF and verifies the signed ID token.
- The verified identity is stored on the same origin, then the page returns to the 8-second Welcome screen and starts the 25-minute session.
- Removes touchscreen-based hover suppression and initializes the soft provider tone on the first provider click.
- No visual gateway design changes.
