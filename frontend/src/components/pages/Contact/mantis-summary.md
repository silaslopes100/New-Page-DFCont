# Contact

- **Core Components:** `Contact.jsx` (164 lines) contact form page, `Contact.css` (145 lines).
- **API Endpoints & Exports:** `Contact` named export; uses `contactAPI.send` from services/api.js.
- **Trust Boundaries & External Inputs:** User-entered name/email/phone/message collected client-side, POSTed to `/api/contact/send`. No client-side sanitization (backend responsibility). Renders API error text (`detail`) into the UI.
- **Sensitive Operations:** None; note backend /api/contact/send currently fails at import time (see backend api summary).
- **Historical Vulnerabilities:** None recorded.

