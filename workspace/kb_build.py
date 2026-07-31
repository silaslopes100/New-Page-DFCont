#!/usr/bin/env python3
"""Mantis architecture: builds workspace/kb (index, architecture, entities, vulnerabilities, dependencies)."""
import json
import os
import re

ROOT = r"D:\New Page DFCont"
WORKSPACE = os.path.join(ROOT, "workspace")
KB = os.path.join(WORKSPACE, "kb")

# ---------------- dependencies extraction ----------------
def resolve_py_import(modpath, mod):
    parts = mod.split(".")
    # module -> file: package a.b.c -> a/b/c.py or a/b/c/__init__.py
    cands = []
    for cut in range(len(parts), 0, -1):
        sub = parts[:cut]
        p = os.path.join(*sub)
        cands.append(p + ".py")
        cands.append(os.path.join(p, "__init__.py"))
    for c in cands:
        fp = os.path.join(ROOT, "backend", c)
        if os.path.isfile(fp):
            return os.path.relpath(fp, ROOT).replace("\\", "/")
    return None

def parse_py_imports(path):
    deps = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            m = re.match(r"^\s*(?:from\s+(\S+)\s+import|\s*import\s+(\S+))", line)
            if m:
                mod = m.group(1) or m.group(2)
                mod = mod.split(".")[0] if m.group(2) else mod
                deps.append(mod)
    return deps

def parse_js_imports(path):
    deps = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            m = re.match(r"^\s*import\s+(?:[\w*{}, ]+?\s+from\s+)?['\"]([^'\"]+)['\"]", line)
            if m:
                deps.append(m.group(1))
    return deps

def resolve_js_import(path, spec, root_dir):
    if spec.startswith("."):
        base = os.path.dirname(path)
        cand = os.path.normpath(os.path.join(base, spec))
        for ext in ("", ".js", ".jsx", ".css"):
            if os.path.isfile(cand + ext):
                return os.path.relpath(cand + ext, ROOT).replace("\\", "/")
        if os.path.isdir(cand):
            idx = os.path.join(cand, "index.js")
            if os.path.isfile(idx):
                return os.path.relpath(idx, ROOT).replace("\\", "/")
    return None

deps = {}
for dirpath, dirnames, filenames in os.walk(os.path.join(ROOT, "backend", "app")):
    dirnames[:] = [d for d in dirnames if d not in ("__pycache__",)]
    for fn in filenames:
        if not fn.endswith(".py"):
            continue
        fp = os.path.join(dirpath, fn)
        rel = os.path.relpath(fp, ROOT).replace("\\", "/")
        for mod in parse_py_imports(fp):
            tgt = resolve_py_import(mod, mod)
            if tgt and tgt != rel:
                deps.setdefault(tgt, []).append(rel)

for dirpath, dirnames, filenames in os.walk(os.path.join(ROOT, "frontend", "src")):
    for fn in filenames:
        if not (fn.endswith(".js") or fn.endswith(".jsx")):
            continue
        fp = os.path.join(dirpath, fn)
        rel = os.path.relpath(fp, ROOT).replace("\\", "/")
        for spec in parse_js_imports(fp):
            tgt = resolve_js_import(fp, spec, os.path.join(ROOT, "frontend"))
            if tgt and tgt != rel:
                deps.setdefault(tgt, []).append(rel)

for k in deps:
    deps[k] = sorted(set(deps[k]))

with open(os.path.join(WORKSPACE, "kb_dependencies.json"), "w", encoding="utf-8") as f:
    json.dump(deps, f, indent=2, sort_keys=True)
print("dependency edges:", sum(len(v) for v in deps.values()))

# ---------------- KB markdown ----------------
FILES = {}

FILES["architecture.md"] = """# Architecture: DFCont (New Page DFCont)

Marketing/lead-generation web app for a Brazilian accounting firm (DFCont). React SPA + FastAPI backend + SQLite.

## Zones

- **ZONE BROWSER (untrusted):** Vite/React SPA in `frontend/` (src). Collects lead/contact PII via forms; renders plan data and pricing. No client-side sanitization; error `detail` strings from the API are rendered to the DOM.
- **ZONE API (semi-trusted):** FastAPI app in `backend/app`. Four unauthenticated routers under `/api`. No auth, no rate limiting, no CSRF protection.
- **ZONE DB (trusted):** SQLite file (`dfcont.db`, default) via SQLAlchemy. Tables: `leads`, `contacts`, `plans` (created on startup). PII at rest, unencrypted.

## Data flows

1. **Lead flow:** Hero/CTA/Calculator forms -> `leadAPI.create` -> POST `/api/leads/create` -> Pydantic `LeadRequest` -> `lead_service.create_lead` -> SQLAlchemy insert into `leads`. Errors return `400 detail=str(e)` (raw exception text).
2. **Calculator flow:** Calculator form -> POST `/api/calculator/calculate` -> `CalculatorRequest` -> `calculator_service.determine_plan` -> pricing dicts -> response. Errors return `400 detail=str(e)`.
3. **Plans flow:** Plans page -> GET `/api/plans/?category=` -> hardcoded `BASE_PLANS` list (DB never queried). Import currently BROKEN (see below).
4. **Contact flow:** Contact form -> POST `/api/contact/send` -> STUB (no persistence; imports undefined `ContactRequest/ContactResponse`). Import currently BROKEN.

## Trust boundaries

- B->A: all JSON bodies user-controlled, validated only by Pydantic models.
- B->A: CORS `allow_credentials=True` + methods/headers `*` for 3 hardcoded origins (localhost:3000, localhost:5173, dfcont.com.br).
- A->DB: parameterized SQLAlchemy ORM (no raw SQL anywhere).

## Availability

- **App currently FAILS TO BOOT:** `app.api.routes.plans` import raises `ImportError` (self-import at `backend/app/api/models/plan.py:6`, committed in feb5207d). `app.api.routes.contact` additionally imports undefined `ContactRequest/ContactResponse` from `models.plan`. Any deployment that imports these routers (main.py does) crashes at startup.
- No deployment config (no systemd/k8s/Docker) in repo; dev proxy: vite port 3000 -> localhost:8000.
- `DEBUG` defaults to `True` in production unless env var set -> `/docs` (Swagger UI) exposed.
"""

FILES["index.md"] = """# Knowledge Base Index

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
"""

FILES["entities/app_entry.md"] = """# Entity: app_entry (backend/app/main.py)

- FastAPI app `app`; `docs_url="/docs" if settings.DEBUG else None` (DEBUG defaults True).
- CORS middleware: `allow_credentials=True`, `allow_methods=["*"]`, `allow_headers=["*"]`, `allow_origins=settings.CORS_ORIGINS` (3 hardcoded origins).
- Mounts 4 routers (calculator, plans, lead, contact); `@app.get("/health")`.
- Startup: `init_db()` creates tables.
- **Broken:** importing the plans or contact routers raises ImportError (see Import-Regression); the whole app fails to start.
- **Criticality:** CRITICAL (single entry point; its failure kills the product).
- **Links:** [CWE-942](vulnerabilities/CWE-942.md), [Import-Regression](vulnerabilities/Import-Regression.md)
"""

FILES["entities/core_config.md"] = """# Entity: core_config (backend/app/core)

- `config.py`: `Settings` reads env; `DEBUG` default "True"; `DATABASE_URL` default `sqlite:///./dfcont.db`; `CORS_ORIGINS` hardcoded list (localhost:3000, localhost:5173, https://dfcont.com.br).
- `database.py`: SQLAlchemy `create_engine` (check_same_thread only for sqlite), `SessionLocal`, `Base`, `get_db` dependency, `init_db`.
- **Constraint:** No secrets management, no config validation; production CORS list lacks the real deployed origin if it differs from dfcont.com.br; DEBUG True by default exposes /docs.
- **Criticality:** STANDARD (config decides exposure).
- **Links:** [CWE-942](vulnerabilities/CWE-942.md)
"""

FILES["entities/api_models.md"] = """# Entity: api_models (backend/app/api/models)

- `lead.py`: `LeadDB` (leads table) + `LeadRequest` (name 2-100, EmailStr, phone 10-20, origin required) + `LeadResponse`.
- `plan.py`: `PlanDB` (plans table, JSON features) + `PlanResponse`. **Line 6 self-imports `PlanDB` from its own module -> ImportError on load (committed feb5207d).**
- `contact.py`: `ContactDB` (contacts table). **Unused by any route.**
- `calculator.py`: `CalculatorRequest` (toggle/activity/employees ge=0 le=1000000/routine/contact/benefits) + `CalculatorResponse`.
- **Missing:** `ContactRequest`/`ContactResponse` are imported by routes/contact.py but defined NOWHERE.
- **Criticality:** CRITICAL (validation layer; broken imports block startup).
- **Links:** [Import-Regression](vulnerabilities/Import-Regression.md), [CWE-209](vulnerabilities/CWE-209.md)
"""

FILES["entities/api_routes.md"] = """# Entity: api_routes (backend/app/api/routes)

- `plans.py`: GET `/api/plans/` (optional `category` query, filters hardcoded `BASE_PLANS`; DB unused). Import broken via models.plan.
- `lead.py`: POST `/api/leads/create` -> persists lead; `except Exception -> HTTPException(400, detail=str(e))`.
- `contact.py`: POST `/api/contact/send` -> stub; imports `ContactRequest/ContactResponse` from models.plan (undefined) -> ImportError; also `except Exception -> detail=str(e)`.
- `calculator.py`: POST `/api/calculator/calculate` -> delegates to service; `except Exception -> detail=str(e)`.
- **Surface:** 4 unauthenticated endpoints, no rate limiting, no auth, raw exception text to clients.
- **Criticality:** CRITICAL (entire API surface).
- **Links:** [CWE-209](vulnerabilities/CWE-209.md), [CWE-287](vulnerabilities/CWE-287.md), [Import-Regression](vulnerabilities/Import-Regression.md)
"""

FILES["entities/services.md"] = """# Entity: services (backend/app/services)

- `calculator_service.py`: `determine_plan(request)` — pure pricing: activity/employees/benefits/routine/contact -> plan dicts `PLANS_SERVICO`/`PLANS_COMERCIO`, per-employee surcharge (10/15), assessor +50, completo +30; safe `.get` defaults. No untrusted parsing; employees bounded by model.
- `lead_service.py`: `create_lead(db, request)` — ORM insert + commit + refresh (parameterized; no SQLi surface).
- **Criticality:** STANDARD.
- **Links:** none historical.
"""

FILES["entities/frontend_api_client.md"] = """# Entity: frontend_api_client (frontend/src/services/api.js)

- Single axios instance, `baseURL: '/api'`, 10s timeout, JSON content-type.
- Wrappers: `calculatorAPI.calculate`, `plansAPI.getAll`, `leadAPI.create`, `contactAPI.send`.
- Response interceptor: rejects with `error.response.data.detail` verbatim -> backend exception text reaches the DOM (info disclosure amplification of CWE-209).
- No auth headers/tokens/CSRF handling; dev proxy /api -> localhost:8000 (vite.config.js).
- **Criticality:** STANDARD.
- **Links:** [CWE-209](vulnerabilities/CWE-209.md)
"""

FILES["entities/frontend_forms.md"] = """# Entity: frontend_forms (Input, Hero, CTA, Contact, Calculator)

- `common/Input`: text/select/textarea with labels+errors; controlled; no sanitization.
- `sections/Hero` + `sections/CTA`: lead forms (name/email/phone/city/activity/origin) -> `leadAPI.create`.
- `pages/Contact`: contact form -> `contactAPI.send` (backend broken).
- `sections/Calculator`: quote form -> `calculatorAPI.calculate` + lead save.
- **Trust boundary:** all PII enters here; validation deferred to backend; error text rendered to DOM.
- No XSS sinks repo-wide (no dangerouslySetInnerHTML/innerHTML/eval found).
- **Criticality:** STANDARD (input surface).
- **Links:** [CWE-209](vulnerabilities/CWE-209.md)
"""

FILES["vulnerabilities/CWE-209.md"] = """# CWE-209: Generation of Error Message Containing Sensitive Information

- **Pattern in codebase:** `except Exception as e: raise HTTPException(status_code=400, detail=str(e))` in routes/lead.py:16, routes/calculator.py:14, routes/contact.py:12. Combined with frontend api.js interceptor that renders `detail` into the DOM, internal exception strings (file paths, DB errors, env details) can leak to clients.
- **Why it matters:** Unhandled/unvalidated input (e.g., DB constraint errors, unexpected payloads) echoes server internals; aids further exploitation (recon).
- **What not to do (historical lesson):** copying the route pattern to new endpoints without a centralized error handler; returning `str(e)` instead of a mapped message.
- **Related:** [CWE-287](CWE-287.md) (no auth means anyone can trigger these paths).
"""

FILES["vulnerabilities/CWE-287.md"] = """# CWE-287: Improper Authentication

- **Pattern in codebase:** no auth dependencies, no middleware, no session/keys anywhere in backend; all 4 routers open. Leads/contacts DB writes are unauthenticated; mass PII injection/spam possible.
- **Why it matters:** any client can create unlimited leads (DB fill), enumerate pricing logic, and probe endpoints; combined with CWE-209, error-driven recon is unauthenticated.
- **What not to do:** adding new routers without an auth review; relying on CORS to gate access (CORS is browser-side only and does not stop curl).
- **Related:** [CWE-942](CWE-942.md), [CWE-209](CWE-209.md).
"""

FILES["vulnerabilities/CWE-942.md"] = """# CWE-942: Permissive Cross-domain Policy with Untrusted Domains

- **Pattern in codebase:** main.py CORS: `allow_credentials=True` + `allow_methods=["*"]` + `allow_headers=["*"]` with 3 hardcoded origins. Methods/headers `*` with credentials is broad; any future origin addition widens the browser-side attack surface (e.g., an attacker origin reading credentialed responses if added to the allowlist).
- **Why it matters:** with credentials allowed, a malicious page granted origin access could read lead/plan responses. Currently the allowlist is small, but the *-credentials combination is fragile.
- **What not to do:** enabling credentials with wildcard-ish method/header policies; hardcoding localhost origins into production CORS.
"""

FILES["vulnerabilities/Import-Regression.md"] = """# Bug Class: Import Regression / Broken Startup

- **Historical case (commit feb5207d, the only "fix" in repo history):** added `from app.api.models.plan import PlanDB` inside plan.py itself (before the class definition) -> `ImportError: cannot import name 'PlanDB' from partially initialized module`; whole backend fails to boot. Second defect: routes/contact.py imports `ContactRequest, ContactResponse` from models.plan — those classes are defined nowhere.
- **Pattern to watch:** self-imports, imports of names defined later in the same module, imports of classes that were renamed/moved, and "fix" commits that only add import lines without testing startup.
- **Verification habit:** `python -c "import app.api.routes.plans"` / `uvicorn app.main:app` smoke test before trusting a commit. Verified broken today.
- **Impact:** availability (total service loss at deploy time).
"""

def main():
    os.makedirs(os.path.join(KB, "entities"), exist_ok=True)
    os.makedirs(os.path.join(KB, "vulnerabilities"), exist_ok=True)
    for rel, content in FILES.items():
        p = os.path.join(KB, rel)
        with open(p, "w", encoding="utf-8") as f:
            f.write(content.lstrip() + "\n")
        print("wrote", rel)
    # archive per-pass KB copy
    import shutil
    arch = os.path.join(WORKSPACE, "archive", "kb", "kb_pass_1_1")
    shutil.copytree(KB, arch, dirs_exist_ok=True)
    print("archived KB ->", arch)

if __name__ == "__main__":
    main()
