# Entity: core_config (backend/app/core)

- `config.py`: `Settings` reads env; `DEBUG` default "True"; `DATABASE_URL` default `sqlite:///./dfcont.db`; `CORS_ORIGINS` hardcoded list (localhost:3000, localhost:5173, https://dfcont.com.br).
- `database.py`: SQLAlchemy `create_engine` (check_same_thread only for sqlite), `SessionLocal`, `Base`, `get_db` dependency, `init_db`.
- **Constraint:** No secrets management, no config validation; production CORS list lacks the real deployed origin if it differs from dfcont.com.br; DEBUG True by default exposes /docs.
- **Criticality:** STANDARD (config decides exposure).
- **Links:** [CWE-942](vulnerabilities/CWE-942.md)

