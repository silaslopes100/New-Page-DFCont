# Entity: api_routes (backend/app/api/routes)

- `plans.py`: GET `/api/plans/` (optional `category` query, filters hardcoded `BASE_PLANS`; DB unused). Import broken via models.plan.
- `lead.py`: POST `/api/leads/create` -> persists lead; `except Exception -> HTTPException(400, detail=str(e))`.
- `contact.py`: POST `/api/contact/send` -> stub; imports `ContactRequest/ContactResponse` from models.plan (undefined) -> ImportError; also `except Exception -> detail=str(e)`.
- `calculator.py`: POST `/api/calculator/calculate` -> delegates to service; `except Exception -> detail=str(e)`.
- **Surface:** 4 unauthenticated endpoints, no rate limiting, no auth, raw exception text to clients.
- **Criticality:** CRITICAL (entire API surface).
- **Links:** [CWE-209](vulnerabilities/CWE-209.md), [CWE-287](vulnerabilities/CWE-287.md), [Import-Regression](vulnerabilities/Import-Regression.md)

