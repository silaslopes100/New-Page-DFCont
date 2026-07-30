from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base
from datetime import datetime


class ContactDB(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    message = Column(String(2000), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
