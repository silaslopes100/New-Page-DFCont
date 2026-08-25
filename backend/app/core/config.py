import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = "DFCont API"
    VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    _database_url = os.getenv("DATABASE_URL", "sqlite:///./dfcont.db")
    _running_on_vercel = bool(os.getenv("VERCEL") or os.getenv("NOW_REGION"))
    DATABASE_URL: str = (
        "sqlite:////tmp/dfcont.db"
        if _running_on_vercel and _database_url.startswith("sqlite:///")
        else _database_url
    )

    _default_cors_origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://dfcont.com.br",
    ]
    _cors_env = os.getenv("CORS_ORIGINS")
    CORS_ORIGINS: list = (
        [origin.strip() for origin in _cors_env.split(",") if origin.strip()]
        if _cors_env
        else _default_cors_origins
    )

    # E-mail notifications for leads.
    # EMAIL_MODE=console logs the message instead of sending (safe for dev).
    # EMAIL_MODE=smtp sends via SMTP using the credentials below.
    EMAIL_MODE: str = os.getenv("EMAIL_MODE", "console").lower()
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM: str = os.getenv("SMTP_FROM", "")
    LEAD_NOTIFICATION_EMAIL: str = os.getenv(
        "LEAD_NOTIFICATION_EMAIL", "silaslopesdesouza@gmail.com"
    )


settings = Settings()
