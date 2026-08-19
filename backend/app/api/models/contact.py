from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    message: str = Field(..., min_length=1, max_length=2000)


class ContactResponse(BaseModel):
    message: str


class ContactDB(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    message = Column(String(2000), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
