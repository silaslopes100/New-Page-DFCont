# Calculator

- **Core Components:** `Calculator.jsx` (208 lines) interactive plan-quote form (toggle abertura/migracao, activity, employees, routine, contact, benefits), `Calculator.css` (228 lines).
- **API Endpoints & Exports:** `Calculator` named export; uses `calculatorAPI.calculate` (POST /api/calculator/calculate) and `leadAPI.create` to save quotes as leads.
- **Trust Boundaries & External Inputs:** Heavy user input surface; numeric fields may be client-validated only; API error text (`detail`) rendered to user. Price displayed comes from backend response.
- **Sensitive Operations:** None (no arithmetic of security interest client-side; authoritative pricing lives in backend/services/calculator_service.py).
- **Historical Vulnerabilities:** None recorded.

