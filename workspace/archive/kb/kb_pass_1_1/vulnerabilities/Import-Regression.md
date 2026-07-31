# Bug Class: Import Regression / Broken Startup

- **Historical case (commit feb5207d, the only "fix" in repo history):** added `from app.api.models.plan import PlanDB` inside plan.py itself (before the class definition) -> `ImportError: cannot import name 'PlanDB' from partially initialized module`; whole backend fails to boot. Second defect: routes/contact.py imports `ContactRequest, ContactResponse` from models.plan — those classes are defined nowhere.
- **Pattern to watch:** self-imports, imports of names defined later in the same module, imports of classes that were renamed/moved, and "fix" commits that only add import lines without testing startup.
- **Verification habit:** `python -c "import app.api.routes.plans"` / `uvicorn app.main:app` smoke test before trusting a commit. Verified broken today.
- **Impact:** availability (total service loss at deploy time).

