# Entity: frontend_api_client (frontend/src/services/api.js)

- Single axios instance, `baseURL: '/api'`, 10s timeout, JSON content-type.
- Wrappers: `calculatorAPI.calculate`, `plansAPI.getAll`, `leadAPI.create`, `contactAPI.send`.
- Response interceptor: rejects with `error.response.data.detail` verbatim -> backend exception text reaches the DOM (info disclosure amplification of CWE-209).
- No auth headers/tokens/CSRF handling; dev proxy /api -> localhost:8000 (vite.config.js).
- **Criticality:** STANDARD.
- **Links:** [CWE-209](vulnerabilities/CWE-209.md)

