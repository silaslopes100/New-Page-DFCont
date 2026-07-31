from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base
from datetime import datetime
from pydantic import BaseModel, Field



class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=3, max_length=100)
    phone: str = Field(..., min_length=8, max_length=20)
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
    created_at = Column(DateTime, default=datetime.utcnow)
