# Knowledge Base Index

## Entities

- [app_entry](entities/app_entry.md) — FastAPI app factory, CORS middleware, router mounting, /health.
- [core_config](entities/core_config.md) — Settings (env, DEBUG, DATABASE_URL, CORS_ORIGINS), SQLAlchemy engine/session.
- [api_models](entities/api_models.md) — Pydantic request/response models + ORM tables (lead, plan, contact, calculator).
- [api_routes](entities/api_routes.md) — Unauthenticated endpoints: /api/plans, /api/leads/create, /api/contact/send, /api/calculator/calculate.
- [services](entities/services.md) — Pricing logic (determine_plan) + lead persistence (create_lead).
- [frontend_api_client](entities/frontend_api_client.md) — axios client, 4 API wrappers, error interceptor surfacing raw `detail`.
- [frontend_forms](entities/frontend_forms.md) — Input/Hero/CTA/Contact/Calculator components: all user-input surfaces.

## Vulnerability classes

- [CWE-209](vulnerabilities/CWE-209.md) — Information disclosure via raw exception text (`detail=str(e)`).
- [CWE-287](vulnerabilities/CWE-287.md) — Missing authentication/authorization on all endpoints.
- [CWE-942](vulnerabilities/CWE-942.md) — Permissive CORS with credentials.
- [Import-Regression](vulnerabilities/Import-Regression.md) — Broken imports / startup failures (historical: feb5207d).

## Notes

- History: 2 commits only; no security fix ever applied; the one "fix" commit broke startup.
- Learnings inbox: empty (first pass; nothing archived yet).

