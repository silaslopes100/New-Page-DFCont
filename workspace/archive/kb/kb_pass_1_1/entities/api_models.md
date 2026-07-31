# Entity: api_models (backend/app/api/models)

- `lead.py`: `LeadDB` (leads table) + `LeadRequest` (name 2-100, EmailStr, phone 10-20, origin required) + `LeadResponse`.
- `plan.py`: `PlanDB` (plans table, JSON features) + `PlanResponse`. **Line 6 self-imports `PlanDB` from its own module -> ImportError on load (committed feb5207d).**
- `contact.py`: `ContactDB` (contacts table). **Unused by any route.**
- `calculator.py`: `CalculatorRequest` (toggle/activity/employees ge=0 le=1000000/routine/contact/benefits) + `CalculatorResponse`.
- **Missing:** `ContactRequest`/`ContactResponse` are imported by routes/contact.py but defined NOWHERE.
- **Criticality:** CRITICAL (validation layer; broken imports block startup).
- **Links:** [Import-Regression](vulnerabilities/Import-Regression.md), [CWE-209](vulnerabilities/CWE-209.md)

