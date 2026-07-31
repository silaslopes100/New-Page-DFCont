# src (frontend)

- **Core Components:** `main.jsx` (React entry, StrictMode), `App.jsx` (react-router routes: /, /planos, /como-funciona, /sobre, /blog, /contato), `App.css` (184), `index.css` (111). Subdirs: components/ (common UI + pages + sections), services/ (axios API client), hooks/, styles/.
- **API Endpoints & Exports:** SPA entry; all backend communication via services/api.js (calculator/plans/lead/contact endpoints).
- **Trust Boundaries & External Inputs:** Trust boundary = any component collecting user input: Hero/CTA/Contact forms (PII -> leads/contact), Calculator (quote -> leads). No client-side input sanitization; error `detail` text rendered to DOM. No XSS sinks found (no dangerouslySetInnerHTML/innerHTML/eval).
- **Sensitive Operations:** None client-side.
- **Historical Vulnerabilities:** None recorded. Backend /api/contact/send and /api/plans are currently broken at import (see backend summaries), so contact and plans features fail at runtime.

