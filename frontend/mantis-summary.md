# frontend

- **Core Components:** Vite + React SPA. Config: `vite.config.js` (dev server port 3000, /api proxy -> http://localhost:8000), `package.json` (deps: react, react-dom, react-router-dom, axios, vite, @vitejs/plugin-react), `index.html`, `public/` (static media/svg). Source in src/ (see src/mantis-summary.md).
- **API Endpoints & Exports:** None server-side; SPA consumes /api/* endpoints via src/services/api.js.
- **Trust Boundaries & External Inputs:** Browser-side only; dev proxy forwards /api to backend.
- **Sensitive Operations:** None; no secrets in source (public/ has only static assets).
- **Historical Vulnerabilities:** None recorded.

