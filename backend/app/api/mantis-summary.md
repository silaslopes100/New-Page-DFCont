# api

- **Core Components:** Package root for models/ (Pydantic + ORM) and routes/ (4 FastAPI routers: calculator, plans, lead, contact). See subdirectory summaries.
- **API Endpoints & Exports:** All app endpoints: /api/plans/, /api/leads/create, /api/contact/send, /api/calculator/calculate (all unauthenticated).
- **Trust Boundaries & External Inputs:** Entire API surface is the primary trust boundary: user-supplied JSON -> Pydantic validation -> services/DB.
- **Sensitive Operations:** Lead/contact PII persistence; calculator pricing logic.
- **Historical Vulnerabilities:** Two broken imports currently prevent app startup: plan.py:6 self-import; contact.py:2 undefined ContactRequest/ContactResponse. Both introduced/verified in current tree (see workspace/historical_learnings.jsonl feb5207d entry and routes summary).

