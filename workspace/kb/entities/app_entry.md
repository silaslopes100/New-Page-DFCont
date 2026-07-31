# Entity: app_entry (backend/app/main.py)

- FastAPI app `app`; `docs_url="/docs" if settings.DEBUG else None` (DEBUG defaults True).
- CORS middleware: `allow_credentials=True`, `allow_methods=["*"]`, `allow_headers=["*"]`, `allow_origins=settings.CORS_ORIGINS` (3 hardcoded origins).
- Mounts 4 routers (calculator, plans, lead, contact); `@app.get("/health")`.
- Startup: `init_db()` creates tables.
- **Broken:** importing the plans or contact routers raises ImportError (see Import-Regression); the whole app fails to start.
- **Criticality:** CRITICAL (single entry point; its failure kills the product).
- **Links:** [CWE-942](vulnerabilities/CWE-942.md), [Import-Regression](vulnerabilities/Import-Regression.md)

