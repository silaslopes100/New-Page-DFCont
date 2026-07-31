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

    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://dfcont.com.br",
    ]


settings = Settings()
