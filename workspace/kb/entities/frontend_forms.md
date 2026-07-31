# Entity: frontend_forms (Input, Hero, CTA, Contact, Calculator)

- `common/Input`: text/select/textarea with labels+errors; controlled; no sanitization.
- `sections/Hero` + `sections/CTA`: lead forms (name/email/phone/city/activity/origin) -> `leadAPI.create`.
- `pages/Contact`: contact form -> `contactAPI.send` (backend broken).
- `sections/Calculator`: quote form -> `calculatorAPI.calculate` + lead save.
- **Trust boundary:** all PII enters here; validation deferred to backend; error text rendered to DOM.
- No XSS sinks repo-wide (no dangerouslySetInnerHTML/innerHTML/eval found).
- **Criticality:** STANDARD (input surface).
- **Links:** [CWE-209](vulnerabilities/CWE-209.md)

