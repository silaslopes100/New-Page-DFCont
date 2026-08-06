from pydantic import BaseModel, Field, EmailStr
from typing import Literal, Optional
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base


class LeadDB(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    city = Column(String(100), nullable=True)
    activity = Column(String(100), nullable=True)
    origin = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class LeadRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    city: Optional[str] = None
    activity: Optional[str] = None
    origin: Literal["calculator", "contact", "hero", "cta"]


class LeadResponse(BaseModel):
    id: int
    message: str
