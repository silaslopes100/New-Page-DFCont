# core

- **Core Components:** `config.py` (24) - Settings class reading env (DEBUG defaults True, DATABASE_URL defaults sqlite:///./dfcont.db, hardcoded CORS_ORIGINS list with allow_credentials later), `database.py` (24) - SQLAlchemy engine/session/Base, `init_db` creates tables on startup.
- **API Endpoints & Exports:** `settings` singleton; `get_db` dependency; `init_db`.
- **Trust Boundaries & External Inputs:** Config boundaries: CORS origins hardcoded (localhost:3000/5173, dfcont.com.br) while main.py sets allow_credentials=True + allow_methods/headers "*" -> wide CORS posture; DB file lives next to app (sqlite).
- **Sensitive Operations:** None (no auth material here; no secrets file handling).
- **Historical Vulnerabilities:** None recorded; downstream: verify CORS + DEBUG defaults in production.

