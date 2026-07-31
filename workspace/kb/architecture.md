# Architecture: DFCont (New Page DFCont)

Marketing/lead-generation web app for a Brazilian accounting firm (DFCont). React SPA + FastAPI backend + SQLite.

## Zones

- **ZONE BROWSER (untrusted):** Vite/React SPA in `frontend/` (src). Collects lead/contact PII via forms; renders plan data and pricing. No client-side sanitization; error `detail` strings from the API are rendered to the DOM.
- **ZONE API (semi-trusted):** FastAPI app in `backend/app`. Four unauthenticated routers under `/api`. No auth, no rate limiting, no CSRF protection.
- **ZONE DB (trusted):** SQLite file (`dfcont.db`, default) via SQLAlchemy. Tables: `leads`, `contacts`, `plans` (created on startup). PII at rest, unencrypted.

## Data flows

1. **Lead flow:** Hero/CTA/Calculator forms -> `leadAPI.create` -> POST `/api/leads/create` -> Pydantic `LeadRequest` -> `lead_service.create_lead` -> SQLAlchemy insert into `leads`. Errors return `400 detail=str(e)` (raw exception text).
2. **Calculator flow:** Calculator form -> POST `/api/calculator/calculate` -> `CalculatorRequest` -> `calculator_service.determine_plan` -> pricing dicts -> response. Errors return `400 detail=str(e)`.
3. **Plans flow:** Plans page -> GET `/api/plans/?category=` -> hardcoded `BASE_PLANS` list (DB never queried). Import currently BROKEN (see below).
4. **Contact flow:** Contact form -> POST `/api/contact/send` -> STUB (no persistence; imports undefined `ContactRequest/ContactResponse`). Import currently BROKEN.

## Trust boundaries

- B->A: all JSON bodies user-controlled, validated only by Pydantic models.
- B->A: CORS `allow_credentials=True` + methods/headers `*` for 3 hardcoded origins (localhost:3000, localhost:5173, dfcont.com.br).
- A->DB: parameterized SQLAlchemy ORM (no raw SQL anywhere).

## Availability

- **App currently FAILS TO BOOT:** `app.api.routes.plans` import raises `ImportError` (self-import at `backend/app/api/models/plan.py:6`, committed in feb5207d). `app.api.routes.contact` additionally imports undefined `ContactRequest/ContactResponse` from `models.plan`. Any deployment that imports these routers (main.py does) crashes at startup.
- No deployment config (no systemd/k8s/Docker) in repo; dev proxy: vite port 3000 -> localhost:8000.
- `DEBUG` defaults to `True` in production unless env var set -> `/docs` (Swagger UI) exposed.

