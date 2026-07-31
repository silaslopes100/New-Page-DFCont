# routes

- **Core Components:** Four unauthenticated FastAPI routers: `plans.py` (GET /api/plans/ with optional category filter, returns hardcoded BASE_PLANS - DB unused), `lead.py` (POST /api/leads/create - persists LeadDB, error -> HTTPException 400 with detail=str(e): raw exception text leaked), `contact.py` (POST /api/contact/send - STUB: imports nonexistent ContactRequest/ContactResponse from models.plan, no persistence, app import breaks), `calculator.py` (POST /api/calculator/calculate - delegates to services, error -> 400 detail=str(e)).
- **API Endpoints & Exports:** GET /api/plans/ (category: servico|comercio), POST /api/leads/create, POST /api/contact/send, POST /api/calculator/calculate.
- **Trust Boundaries & External Inputs:** All endpoints accept unauthenticated user input. No auth, no rate limiting, no input sanitization beyond Pydantic model constraints. Raw exception strings returned to clients (information disclosure). Category param filtered in Python (no injection risk).
- **Sensitive Operations:** lead persistence (SQLAlchemy ORM, parameterized - no SQLi); no write-path hardening (no CSRF on state-changing endpoints).
- **Historical Vulnerabilities:** plan.py self-import (history feb5207d) breaks plans router; contact.py imports undefined classes -> /api/contact broken at import.

