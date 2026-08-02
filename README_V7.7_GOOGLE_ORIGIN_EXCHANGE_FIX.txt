LUVVA Secure Gateway V7.7

Fixes the final Google OAuth code exchange. Google Identity Services popup codes are bound to the page origin, so the server now exchanges the code using the exact approved origin (https://luvva.tech or https://www.luvva.tech) instead of the legacy postmessage value.

Audio and visual design remain unchanged from V7.6.
