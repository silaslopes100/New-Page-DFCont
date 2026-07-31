# Plans

- **Core Components:** `Plans.jsx` (168 lines) plans showcase grid with category toggle, `Plans.css` (210 lines).
- **API Endpoints & Exports:** `Plans` named export; uses `plansAPI.getAll` (GET /api/plans/?category=...).
- **Trust Boundaries & External Inputs:** Renders backend plan data (React-escaped); category query param built from fixed UI values.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.

