import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = "DFCont API"
    VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./dfcont.db"
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


settings = Settings()
