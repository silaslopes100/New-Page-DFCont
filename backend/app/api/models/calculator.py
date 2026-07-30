from pydantic import BaseModel, Field
from typing import List, Optional


class CalculatorRequest(BaseModel):
    toggle: str = Field(..., description="'abertura' or 'migracao'")
    activity: str = Field(..., description="Activity type code")
    employees: int = Field(0, ge=0, le=1000000, description="Number of employees")
    routine: str = Field(..., description="'sozinho' or 'assessor'")
    contact: str = Field(..., description="Contact preference")
    benefits: bool = Field(False, description="Wants benefits")


class CalculatorResponse(BaseModel):
    recommended_plan: str
    price: float
    monthly_price: float
    benefits: List[str]
    description: str
