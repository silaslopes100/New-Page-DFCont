# Home

- **Core Components:** `Home.jsx` (23 lines) composition page: Hero, Calculator, Plans, FAQ, Testimonials, CTA sections.
- **API Endpoints & Exports:** `Home` named export; delegates to section components (which call calculator/plans/lead APIs).
- **Trust Boundaries & External Inputs:** Indirect - renders sections that collect user input (calculator form, lead form in Hero/CTA).
- **Sensitive Operations:** None directly.
- **Historical Vulnerabilities:** None recorded.

