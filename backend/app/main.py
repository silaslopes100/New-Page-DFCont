import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import calculator, plans, lead, contact
from app.core.config import settings
from app.core.database import init_db as init_database

logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

app.include_router(calculator.router)
app.include_router(plans.router)
app.include_router(lead.router)
app.include_router(contact.router)


@app.on_event("startup")
async def startup():
    init_database()


@app.get("/health")
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.VERSION}
