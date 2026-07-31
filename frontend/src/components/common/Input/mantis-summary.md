# Input

- **Core Components:** `Input.jsx` (160 lines) controlled input components (text input, select, textarea variants with labels/errors), `Input.css` (160 lines).
- **API Endpoints & Exports:** `Input`, `SelectInput`, `TextAreaInput` named exports; props: label, value, onChange, error, required, options.
- **Trust Boundaries & External Inputs:** Primary client-side trust boundary - collects user-supplied form data and passes it upward via onChange to parent state, eventually POSTed to backend API (lead/contact/calculator).
- **Sensitive Operations:** None; no sanitization/validation beyond HTML constraints - validation is backend's job.
- **Historical Vulnerabilities:** None recorded; watch for unsanitized error text rendering (see services/api.js interceptor which surfaces `detail` strings).

