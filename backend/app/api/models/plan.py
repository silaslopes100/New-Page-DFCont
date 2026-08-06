from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, DateTime
from app.core.database import Base


class PlanDB(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    category = Column(String(20), nullable=False)
    price = Column(Float, nullable=False)
    monthly_price = Column(Float, nullable=False)
    description = Column(String(255), nullable=True)
    badge = Column(String(50), nullable=True)
    features = Column(JSON, default=[])
    highlight = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class PlanResponse(BaseModel):
    id: str
    name: str
    category: str
    price: float
    monthly_price: float
    description: Optional[str] = None
    badge: Optional[str] = None
    features: List[str] = []
    highlight: bool = False
