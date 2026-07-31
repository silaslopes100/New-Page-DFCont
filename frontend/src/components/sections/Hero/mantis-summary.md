# Hero

- **Core Components:** `Hero.jsx` (355 lines) landing hero with lead form (name/email/phone/city/activity/origin), video background, `Hero.css` (239 lines).
- **API Endpoints & Exports:** `Hero` named export; uses `leadAPI.create` (POST /api/leads/create).
- **Trust Boundaries & External Inputs:** Lead capture form - user-supplied PII (name, email, phone, city) sent to backend; renders API `detail` error text.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.

