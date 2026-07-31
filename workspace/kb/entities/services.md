# Entity: services (backend/app/services)

- `calculator_service.py`: `determine_plan(request)` — pure pricing: activity/employees/benefits/routine/contact -> plan dicts `PLANS_SERVICO`/`PLANS_COMERCIO`, per-employee surcharge (10/15), assessor +50, completo +30; safe `.get` defaults. No untrusted parsing; employees bounded by model.
- `lead_service.py`: `create_lead(db, request)` — ORM insert + commit + refresh (parameterized; no SQLi surface).
- **Criticality:** STANDARD.
- **Links:** none historical.

