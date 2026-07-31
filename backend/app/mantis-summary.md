# app (backend root)

- **Core Components:** `main.py` (34) - FastAPI app: CORS middleware (allow_credentials=True, origins from settings, methods/headers *), 4 routers mounted, /health endpoint, startup creates DB tables. Subdirs: core/, api/, services/ (see their summaries).
- **API Endpoints & Exports:** app factory + /health. Routers: /api/plans, /api/leads/create, /api/contact/send, /api/calculator/calculate. docs_url enabled when DEBUG=True (default True!).
- **Trust Boundaries & External Inputs:** Whole app is exposed unauthenticated; CORS allows 3 hardcoded origins with credentials.
- **Sensitive Operations:** None (no auth, no sessions, no secrets handling).
- **Historical Vulnerabilities:** App currently fails to boot: importing app.api.routes.plans raises ImportError (plan.py:6 self-import from commit feb5207d); additionally contact.py imports undefined ContactRequest/ContactResponse. See workspace/historical_learnings.jsonl.

