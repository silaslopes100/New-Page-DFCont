# backend

- **Core Components:** FastAPI + SQLAlchemy/SQLite app under app/ (see app/mantis-summary.md), requirements.txt (8 deps: fastapi, uvicorn, sqlalchemy, pydantic, pydantic[email], python-dotenv, etc.).
- **API Endpoints & Exports:** /api/* endpoints listed in app summary; /health.
- **Trust Boundaries & External Inputs:** Internet-facing API without authentication; SQLite file db default.
- **Sensitive Operations:** PII persistence (leads), pricing logic. No encryption at rest.
- **Historical Vulnerabilities:** feb5207d regression (plan.py self-import) breaks startup; contact route references undefined models. Nothing was ever patched; initial import was the baseline.

