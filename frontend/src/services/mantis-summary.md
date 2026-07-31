# services

- **Core Components:** `api.js` (35 lines) - single axios instance for the whole frontend.
- **API Endpoints & Exports:** `calculatorAPI.calculate` (POST /api/calculator/calculate), `plansAPI.getAll` (GET /api/plans/), `leadAPI.create` (POST /api/leads/create), `contactAPI.send` (POST /api/contact/send).
- **Trust Boundaries & External Inputs:** Every backend call passes through here. Response interceptor surfaces `error.response.data.detail` verbatim into thrown Error messages -> raw backend exception text may reach the DOM.
- **Sensitive Operations:** None; no auth headers, no tokens, no CSRF handling. Relative base URL '/api' (proxied in dev to localhost:8000 by vite).
- **Historical Vulnerabilities:** None recorded; downstream: check backend error-handling behavior in routes (detail=str(e)).

