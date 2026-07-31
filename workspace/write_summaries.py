#!/usr/bin/env python3
"""Mantis summarize: writes security-focused mantis-summary.md files (bottom-up)."""
import os

ROOT = r"D:\New Page DFCont"
SKIP = {".git", "node_modules", "__pycache__", "dist", "workspace", "Midias", "public", "assets", ".venv"}

SUMMARIES = {}

# ---------------- common components ----------------
SUMMARIES[r"frontend\src\components\common\Button"] = """# Button

- **Core Components:** `Button.jsx` (32 lines) - reusable button with variants (primary/outline), `Button.css` (122 lines) styling.
- **API Endpoints & Exports:** `Button` named export; props: children, variant, type, disabled, onClick.
- **Trust Boundaries & External Inputs:** Renders arbitrary React children; standard event handler delegation (no unsafe sinks).
- **Sensitive Operations:** None. Pure presentational component.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\common\Card"] = """# Card

- **Core Components:** `Card.jsx` (34 lines) generic content card, `Card.css` (50 lines).
- **API Endpoints & Exports:** `Card` named export; props children, className.
- **Trust Boundaries & External Inputs:** Renders children as-is (React-escaped; no dangerouslySetInnerHTML).
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\common\Footer"] = """# Footer

- **Core Components:** `Footer.jsx` (99 lines) site footer with links (social networks, pages), `Footer.css` (116 lines).
- **API Endpoints & Exports:** `Footer` named export.
- **Trust Boundaries & External Inputs:** Hardcoded hrefs only; no user data rendered.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\common\Input"] = """# Input

- **Core Components:** `Input.jsx` (160 lines) controlled input components (text input, select, textarea variants with labels/errors), `Input.css` (160 lines).
- **API Endpoints & Exports:** `Input`, `SelectInput`, `TextAreaInput` named exports; props: label, value, onChange, error, required, options.
- **Trust Boundaries & External Inputs:** Primary client-side trust boundary - collects user-supplied form data and passes it upward via onChange to parent state, eventually POSTed to backend API (lead/contact/calculator).
- **Sensitive Operations:** None; no sanitization/validation beyond HTML constraints - validation is backend's job.
- **Historical Vulnerabilities:** None recorded; watch for unsanitized error text rendering (see services/api.js interceptor which surfaces `detail` strings).
"""

SUMMARIES[r"frontend\src\components\common\Modal"] = """# Modal

- **Core Components:** `Modal.jsx` (52 lines) overlay modal, `Modal.css` (80 lines).
- **API Endpoints & Exports:** `Modal` named export; props: open, onClose, title, children.
- **Trust Boundaries & External Inputs:** Renders children (React-escaped).
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\common\Navbar"] = """# Navbar

- **Core Components:** `Navbar.jsx` (101 lines) responsive top navigation with mobile menu, `Navbar.css` (222 lines).
- **API Endpoints & Exports:** `Navbar` named export.
- **Trust Boundaries & External Inputs:** Hardcoded internal route links only.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

# ---------------- pages ----------------
SUMMARIES[r"frontend\src\components\pages\About"] = """# About

- **Core Components:** `About.jsx` (88 lines) static company/about page, `About.css` (130 lines).
- **API Endpoints & Exports:** `About` named export. No API calls.
- **Trust Boundaries & External Inputs:** None - fully static content.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\pages\Blog"] = """# Blog

- **Core Components:** `Blog.jsx` (109 lines) static blog listing page, `Blog.css` (74 lines).
- **API Endpoints & Exports:** `Blog` named export. No API calls.
- **Trust Boundaries & External Inputs:** None - static content.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\pages\ComoFunciona"] = """# ComoFunciona

- **Core Components:** `ComoFunciona.jsx` (78 lines) static "how it works" page, `ComoFunciona.css` (111 lines).
- **API Endpoints & Exports:** `ComoFunciona` named export. No API calls.
- **Trust Boundaries & External Inputs:** None - static content.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\pages\Contact"] = """# Contact

- **Core Components:** `Contact.jsx` (164 lines) contact form page, `Contact.css` (145 lines).
- **API Endpoints & Exports:** `Contact` named export; uses `contactAPI.send` from services/api.js.
- **Trust Boundaries & External Inputs:** User-entered name/email/phone/message collected client-side, POSTed to `/api/contact/send`. No client-side sanitization (backend responsibility). Renders API error text (`detail`) into the UI.
- **Sensitive Operations:** None; note backend /api/contact/send currently fails at import time (see backend api summary).
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\pages\Home"] = """# Home

- **Core Components:** `Home.jsx` (23 lines) composition page: Hero, Calculator, Plans, FAQ, Testimonials, CTA sections.
- **API Endpoints & Exports:** `Home` named export; delegates to section components (which call calculator/plans/lead APIs).
- **Trust Boundaries & External Inputs:** Indirect - renders sections that collect user input (calculator form, lead form in Hero/CTA).
- **Sensitive Operations:** None directly.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\pages\PlansPage"] = """# PlansPage

- **Core Components:** `PlansPage.jsx` (27 lines) dedicated plans listing page, `PlansPage.css` (7 lines).
- **API Endpoints & Exports:** `PlansPage` named export; uses `plansAPI.getAll` from services/api.js.
- **Trust Boundaries & External Inputs:** Reads plan data from backend /api/plans and renders it (React-escaped).
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

# ---------------- sections ----------------
SUMMARIES[r"frontend\src\components\sections\CTA"] = """# CTA

- **Core Components:** `CTA.jsx` (76 lines) call-to-action banner with lead capture form, `CTA.css` (174 lines).
- **API Endpoints & Exports:** `CTA` named export; uses `leadAPI.create` (POST /api/leads/create).
- **Trust Boundaries & External Inputs:** User name/email/phone/activity collected and sent to backend; renders API `detail` error text.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\sections\Calculator"] = """# Calculator

- **Core Components:** `Calculator.jsx` (208 lines) interactive plan-quote form (toggle abertura/migracao, activity, employees, routine, contact, benefits), `Calculator.css` (228 lines).
- **API Endpoints & Exports:** `Calculator` named export; uses `calculatorAPI.calculate` (POST /api/calculator/calculate) and `leadAPI.create` to save quotes as leads.
- **Trust Boundaries & External Inputs:** Heavy user input surface; numeric fields may be client-validated only; API error text (`detail`) rendered to user. Price displayed comes from backend response.
- **Sensitive Operations:** None (no arithmetic of security interest client-side; authoritative pricing lives in backend/services/calculator_service.py).
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\sections\FAQ"] = """# FAQ

- **Core Components:** `FAQ.jsx` (77 lines) static accordion FAQ, `FAQ.css` (113 lines).
- **API Endpoints & Exports:** `FAQ` named export. No API calls.
- **Trust Boundaries & External Inputs:** None - static content.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\sections\Hero"] = """# Hero

- **Core Components:** `Hero.jsx` (355 lines) landing hero with lead form (name/email/phone/city/activity/origin), video background, `Hero.css` (239 lines).
- **API Endpoints & Exports:** `Hero` named export; uses `leadAPI.create` (POST /api/leads/create).
- **Trust Boundaries & External Inputs:** Lead capture form - user-supplied PII (name, email, phone, city) sent to backend; renders API `detail` error text.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\sections\Plans"] = """# Plans

- **Core Components:** `Plans.jsx` (168 lines) plans showcase grid with category toggle, `Plans.css` (210 lines).
- **API Endpoints & Exports:** `Plans` named export; uses `plansAPI.getAll` (GET /api/plans/?category=...).
- **Trust Boundaries & External Inputs:** Renders backend plan data (React-escaped); category query param built from fixed UI values.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\components\sections\Testimonials"] = """# Testimonials

- **Core Components:** `Testimonials.jsx` (123 lines) static testimonial carousel, `Testimonials.css` (190 lines).
- **API Endpoints & Exports:** `Testimonials` named export. No API calls.
- **Trust Boundaries & External Inputs:** None - static content.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

# ---------------- hooks / services / styles ----------------
SUMMARIES[r"frontend\src\hooks"] = """# hooks

- **Core Components:** `useScrollAnimation.js` (32 lines) IntersectionObserver-based scroll reveal hook.
- **API Endpoints & Exports:** `useScrollAnimation` default export.
- **Trust Boundaries & External Inputs:** None (DOM observer only).
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

SUMMARIES[r"frontend\src\services"] = """# services

- **Core Components:** `api.js` (35 lines) - single axios instance for the whole frontend.
- **API Endpoints & Exports:** `calculatorAPI.calculate` (POST /api/calculator/calculate), `plansAPI.getAll` (GET /api/plans/), `leadAPI.create` (POST /api/leads/create), `contactAPI.send` (POST /api/contact/send).
- **Trust Boundaries & External Inputs:** Every backend call passes through here. Response interceptor surfaces `error.response.data.detail` verbatim into thrown Error messages -> raw backend exception text may reach the DOM.
- **Sensitive Operations:** None; no auth headers, no tokens, no CSRF handling. Relative base URL '/api' (proxied in dev to localhost:8000 by vite).
- **Historical Vulnerabilities:** None recorded; downstream: check backend error-handling behavior in routes (detail=str(e)).
"""

SUMMARIES[r"frontend\src\styles"] = """# styles

- **Core Components:** tokens.css (53), globals.css (116), animations.css (119) - design tokens, global resets, keyframe animations.
- **API Endpoints & Exports:** None.
- **Trust Boundaries & External Inputs:** None.
- **Sensitive Operations:** None.
- **Historical Vulnerabilities:** None recorded.
"""

# ---------------- frontend/src rollup ----------------
SUMMARIES[r"frontend\src"] = """# src (frontend)

- **Core Components:** `main.jsx` (React entry, StrictMode), `App.jsx` (react-router routes: /, /planos, /como-funciona, /sobre, /blog, /contato), `App.css` (184), `index.css` (111). Subdirs: components/ (common UI + pages + sections), services/ (axios API client), hooks/, styles/.
- **API Endpoints & Exports:** SPA entry; all backend communication via services/api.js (calculator/plans/lead/contact endpoints).
- **Trust Boundaries & External Inputs:** Trust boundary = any component collecting user input: Hero/CTA/Contact forms (PII -> leads/contact), Calculator (quote -> leads). No client-side input sanitization; error `detail` text rendered to DOM. No XSS sinks found (no dangerouslySetInnerHTML/innerHTML/eval).
- **Sensitive Operations:** None client-side.
- **Historical Vulnerabilities:** None recorded. Backend /api/contact/send and /api/plans are currently broken at import (see backend summaries), so contact and plans features fail at runtime.
"""

# ---------------- frontend rollup ----------------
SUMMARIES[r"frontend"] = """# frontend

- **Core Components:** Vite + React SPA. Config: `vite.config.js` (dev server port 3000, /api proxy -> http://localhost:8000), `package.json` (deps: react, react-dom, react-router-dom, axios, vite, @vitejs/plugin-react), `index.html`, `public/` (static media/svg). Source in src/ (see src/mantis-summary.md).
- **API Endpoints & Exports:** None server-side; SPA consumes /api/* endpoints via src/services/api.js.
- **Trust Boundaries & External Inputs:** Browser-side only; dev proxy forwards /api to backend.
- **Sensitive Operations:** None; no secrets in source (public/ has only static assets).
- **Historical Vulnerabilities:** None recorded.
"""

# ---------------- backend ----------------
SUMMARIES[r"backend\app\core"] = """# core

- **Core Components:** `config.py` (24) - Settings class reading env (DEBUG defaults True, DATABASE_URL defaults sqlite:///./dfcont.db, hardcoded CORS_ORIGINS list with allow_credentials later), `database.py` (24) - SQLAlchemy engine/session/Base, `init_db` creates tables on startup.
- **API Endpoints & Exports:** `settings` singleton; `get_db` dependency; `init_db`.
- **Trust Boundaries & External Inputs:** Config boundaries: CORS origins hardcoded (localhost:3000/5173, dfcont.com.br) while main.py sets allow_credentials=True + allow_methods/headers "*" -> wide CORS posture; DB file lives next to app (sqlite).
- **Sensitive Operations:** None (no auth material here; no secrets file handling).
- **Historical Vulnerabilities:** None recorded; downstream: verify CORS + DEBUG defaults in production.
"""

SUMMARIES[r"backend\app\api\models"] = """# models

- **Core Components:** Pydantic request/response models + SQLAlchemy ORM tables: `lead.py` (LeadDB table + LeadRequest w/ EmailStr validation, min/max lengths, LeadResponse), `plan.py` (PlanDB table + PlanResponse; CONTAINS BROKEN SELF-IMPORT: `from app.api.models.plan import PlanDB` at plan.py:6 -> ImportError, see history), `contact.py` (ContactDB table, unused by any route), `calculator.py` (CalculatorRequest/CalculatorResponse with bounded employees 0..1000000).
- **API Endpoints & Exports:** LeadRequest/LeadResponse, PlanDB/PlanResponse, ContactDB, CalculatorRequest/CalculatorResponse. Note: routes/contact.py imports `ContactRequest/ContactResponse` which are defined NOWHERE -> second broken import.
- **Trust Boundaries & External Inputs:** Pydantic is the first validation layer for /api/leads and /api/calculator. LeadRequest validates email (EmailStr) and length bounds; calculator request bounds employees. Plan/contact models lack request models (route broken anyway).
- **Sensitive Operations:** None. EmailStr requires email-validator package (in requirements.txt).
- **Historical Vulnerabilities:** plan.py:6 self-import regression from commit feb5207d (see workspace/historical_learnings.jsonl).
"""

SUMMARIES[r"backend\app\api\routes"] = """# routes

- **Core Components:** Four unauthenticated FastAPI routers: `plans.py` (GET /api/plans/ with optional category filter, returns hardcoded BASE_PLANS - DB unused), `lead.py` (POST /api/leads/create - persists LeadDB, error -> HTTPException 400 with detail=str(e): raw exception text leaked), `contact.py` (POST /api/contact/send - STUB: imports nonexistent ContactRequest/ContactResponse from models.plan, no persistence, app import breaks), `calculator.py` (POST /api/calculator/calculate - delegates to services, error -> 400 detail=str(e)).
- **API Endpoints & Exports:** GET /api/plans/ (category: servico|comercio), POST /api/leads/create, POST /api/contact/send, POST /api/calculator/calculate.
- **Trust Boundaries & External Inputs:** All endpoints accept unauthenticated user input. No auth, no rate limiting, no input sanitization beyond Pydantic model constraints. Raw exception strings returned to clients (information disclosure). Category param filtered in Python (no injection risk).
- **Sensitive Operations:** lead persistence (SQLAlchemy ORM, parameterized - no SQLi); no write-path hardening (no CSRF on state-changing endpoints).
- **Historical Vulnerabilities:** plan.py self-import (history feb5207d) breaks plans router; contact.py imports undefined classes -> /api/contact broken at import.
"""

SUMMARIES[r"backend\app\api"] = """# api

- **Core Components:** Package root for models/ (Pydantic + ORM) and routes/ (4 FastAPI routers: calculator, plans, lead, contact). See subdirectory summaries.
- **API Endpoints & Exports:** All app endpoints: /api/plans/, /api/leads/create, /api/contact/send, /api/calculator/calculate (all unauthenticated).
- **Trust Boundaries & External Inputs:** Entire API surface is the primary trust boundary: user-supplied JSON -> Pydantic validation -> services/DB.
- **Sensitive Operations:** Lead/contact PII persistence; calculator pricing logic.
- **Historical Vulnerabilities:** Two broken imports currently prevent app startup: plan.py:6 self-import; contact.py:2 undefined ContactRequest/ContactResponse. Both introduced/verified in current tree (see workspace/historical_learnings.jsonl feb5207d entry and routes summary).
"""

SUMMARIES[r"backend\app\services"] = """# services

- **Core Components:** `calculator_service.py` (95) - pure pricing logic (PLANS_SERVICO/PLANS_COMERCIO dicts, determine_plan: activity/employees/benefits/routine/contact -> plan + price, extra per-employee fees 10/15, assessor +50, completo +30); `lead_service.py` (17) - create_lead persists LeadDB via ORM.
- **API Endpoints & Exports:** `determine_plan(request) -> CalculatorResponse`, `create_lead(db, request) -> LeadDB`.
- **Trust Boundaries & External Inputs:** Receives already-validated Pydantic models; employees bounded by model (le<=1000000) but NOT capped here -> large integer pricing math only (no overflow concern in Python; denial-of-service by huge but bounded computation is negligible).
- **Sensitive Operations:** No crypto, no auth, no parsing of untrusted strings beyond dict lookups with safe defaults.
- **Historical Vulnerabilities:** None recorded; no history of fixes in this directory.
"""

SUMMARIES[r"backend\app"] = """# app (backend root)

- **Core Components:** `main.py` (34) - FastAPI app: CORS middleware (allow_credentials=True, origins from settings, methods/headers *), 4 routers mounted, /health endpoint, startup creates DB tables. Subdirs: core/, api/, services/ (see their summaries).
- **API Endpoints & Exports:** app factory + /health. Routers: /api/plans, /api/leads/create, /api/contact/send, /api/calculator/calculate. docs_url enabled when DEBUG=True (default True!).
- **Trust Boundaries & External Inputs:** Whole app is exposed unauthenticated; CORS allows 3 hardcoded origins with credentials.
- **Sensitive Operations:** None (no auth, no sessions, no secrets handling).
- **Historical Vulnerabilities:** App currently fails to boot: importing app.api.routes.plans raises ImportError (plan.py:6 self-import from commit feb5207d); additionally contact.py imports undefined ContactRequest/ContactResponse. See workspace/historical_learnings.jsonl.
"""

SUMMARIES[r"backend"] = """# backend

- **Core Components:** FastAPI + SQLAlchemy/SQLite app under app/ (see app/mantis-summary.md), requirements.txt (8 deps: fastapi, uvicorn, sqlalchemy, pydantic, pydantic[email], python-dotenv, etc.).
- **API Endpoints & Exports:** /api/* endpoints listed in app summary; /health.
- **Trust Boundaries & External Inputs:** Internet-facing API without authentication; SQLite file db default.
- **Sensitive Operations:** PII persistence (leads), pricing logic. No encryption at rest.
- **Historical Vulnerabilities:** feb5207d regression (plan.py self-import) breaks startup; contact route references undefined models. Nothing was ever patched; initial import was the baseline.
"""

def main():
    written = 0
    for rel, content in SUMMARIES.items():
        d = os.path.join(ROOT, rel)
        if not os.path.isdir(d):
            print(f"MISSING DIR: {d}")
            continue
        p = os.path.join(d, "mantis-summary.md")
        with open(p, "w", encoding="utf-8") as f:
            f.write(content.lstrip() + "\n")
        written += 1
    print(f"wrote {written} summaries")

if __name__ == "__main__":
    main()
