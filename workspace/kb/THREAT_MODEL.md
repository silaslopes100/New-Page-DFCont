KB_SNAPSHOT: UNPINNED
# Threat Model: DFCont (New Page DFCont)

## System Overview Summary

Marketing/lead-gen web app for a Brazilian accounting firm. React SPA (frontend/) + FastAPI backend (backend/) + SQLite. Four unauthenticated endpoints: GET /api/plans/, POST /api/leads/create, POST /api/contact/send, POST /api/calculator/calculate. CORS with credentials enabled for 3 hardcoded origins. PII (leads/contacts) persisted in plain SQLite. **The backend currently fails to boot** (ImportError in plans router via plan.py self-import; contact router imports undefined classes).

## Deployment Intent

`Intent: PRODUCTION` — the KB classifies multiple entities CRITICAL/STANDARD availability (app_entry, api_models, api_routes), and architecture.md describes an externally-reachable API (dfcont.com.br CORS origin, /api/* endpoints, /health). Not a sample/test tree.

## Trust Boundaries

| # | Boundary | Description | Entities |
|---|----------|-------------|----------|
| B1 | Browser -> API | All HTTP JSON bodies are untrusted user input; validated only by Pydantic models (leads: EmailStr+length; calculator: numeric bounds). No auth, no rate limiting. | [api_routes](entities/api_routes.md), [api_models](entities/api_models.md) |
| B2 | Browser -> API (CORS) | allow_credentials=True with allow_methods/headers "*" for 3 hardcoded origins; credentials-bearing requests from any allowlisted malicious page would be forwarded with cookies. | [app_entry](entities/app_entry.md), [core_config](entities/core_config.md) |
| B3 | API -> DB | Parameterized SQLAlchemy ORM inserts; no raw SQL anywhere. Trusted once input passes B1. | [api_models](entities/api_models.md) |
| B4 | API -> Client (error path) | `detail=str(e)` raw exception text flows to the browser DOM via the axios interceptor. | [api_routes](entities/api_routes.md), [frontend_api_client](entities/frontend_api_client.md) |

## Threat Actors & Vectors

1. **Unauthenticated Network Attacker (primary)** — anyone on the internet reaching the API.
   - Vectors: B1 (arbitrary JSON to 4 endpoints; spam lead/contact writes, probe validation logic), B4 (trigger exceptions to harvest internal info), B2 (abuse any credentialed allowlisted origin if attacker-controlled content appears there).
2. **Malicious Browser User** — a visitor using devtools; equivalent to actor 1 (no client-side trust).
3. **DFCont Insider / Operator** — DB file access (plaintext PII), env misconfiguration (DEBUG=true exposes /docs; DATABASE_URL misconfig).
4. **Supply-chain / deployer** — repo contains no deploy config; whoever ships it inherits the ImportError outage (availability).

## High-Risk Assets

- **Leads/Contacts PII** (name, email, phone, city, activity) in SQLite — integrity (spam/fill) and confidentiality (at-rest plaintext) risk. Criticality: STANDARD.
- **API availability / startup** — currently broken by import regressions (commit feb5207d). Availability Tier: `CRITICAL` (service cannot boot; immediate operational impact).
- **Pricing logic** (calculator_service) — informational; tampering has no direct financial impact (prices are client-side display), but incorrect quotes erode trust. Availability Tier: LOW_CRITICALITY.
- **Internal error details** (CWE-209 surface) — recon asset for further attacks.

## Key Residual Risks (from KB)

- [CWE-209](vulnerabilities/CWE-209.md): raw exception text to unauthenticated clients.
- [CWE-287](vulnerabilities/CWE-287.md): no authentication on any endpoint; unlimited DB writes.
- [CWE-942](vulnerabilities/CWE-942.md): credentials+wildcard methods/headers CORS.
- [Import-Regression](vulnerabilities/Import-Regression.md): backend cannot boot; the only "fix" commit in history caused it.
