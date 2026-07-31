# models

- **Core Components:** Pydantic request/response models + SQLAlchemy ORM tables: `lead.py` (LeadDB table + LeadRequest w/ EmailStr validation, min/max lengths, LeadResponse), `plan.py` (PlanDB table + PlanResponse; CONTAINS BROKEN SELF-IMPORT: `from app.api.models.plan import PlanDB` at plan.py:6 -> ImportError, see history), `contact.py` (ContactDB table, unused by any route), `calculator.py` (CalculatorRequest/CalculatorResponse with bounded employees 0..1000000).
- **API Endpoints & Exports:** LeadRequest/LeadResponse, PlanDB/PlanResponse, ContactDB, CalculatorRequest/CalculatorResponse. Note: routes/contact.py imports `ContactRequest/ContactResponse` which are defined NOWHERE -> second broken import.
- **Trust Boundaries & External Inputs:** Pydantic is the first validation layer for /api/leads and /api/calculator. LeadRequest validates email (EmailStr) and length bounds; calculator request bounds employees. Plan/contact models lack request models (route broken anyway).
- **Sensitive Operations:** None. EmailStr requires email-validator package (in requirements.txt).
- **Historical Vulnerabilities:** plan.py:6 self-import regression from commit feb5207d (see workspace/historical_learnings.jsonl).

