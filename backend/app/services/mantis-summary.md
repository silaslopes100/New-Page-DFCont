# services

- **Core Components:** `calculator_service.py` (95) - pure pricing logic (PLANS_SERVICO/PLANS_COMERCIO dicts, determine_plan: activity/employees/benefits/routine/contact -> plan + price, extra per-employee fees 10/15, assessor +50, completo +30); `lead_service.py` (17) - create_lead persists LeadDB via ORM.
- **API Endpoints & Exports:** `determine_plan(request) -> CalculatorResponse`, `create_lead(db, request) -> LeadDB`.
- **Trust Boundaries & External Inputs:** Receives already-validated Pydantic models; employees bounded by model (le<=1000000) but NOT capped here -> large integer pricing math only (no overflow concern in Python; denial-of-service by huge but bounded computation is negligible).
- **Sensitive Operations:** No crypto, no auth, no parsing of untrusted strings beyond dict lookups with safe defaults.
- **Historical Vulnerabilities:** None recorded; no history of fixes in this directory.

