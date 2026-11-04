from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from app.api.models.plan import PlanDB, PlanResponse
from app.core.database import get_db

router = APIRouter(prefix="/api/plans", tags=["plans"])

BASE_PLANS = [
    {"id": "start", "name": "Start", "category": "servico", "price": 197, "monthly_price": 197,
     "description": "O essencial para começar.", "badge": None,
     "features": ["Abertura grátis", "Atendimento via chat e e-mail",
                  "Plataforma de gestão de impostos"],
     "highlight": False},
    {"id": "smart", "name": "Smart", "category": "servico", "price": 263, "monthly_price": 263,
     "description": "Mais recursos para simplificar sua rotina.", "badge": "Melhor custo-benefício",
     "features": ["Abertura grátis", "Atendimento via chat e e-mail",
                  "Plataforma de gestão de impostos", "Plataforma de emissão de notas"],
     "highlight": True},
    {"id": "smart_plus", "name": "Smart Plus", "category": "servico", "price": 353, "monthly_price": 353,
     "description": "Mais praticidade e acompanhamento especializado.", "badge": None,
     "features": ["Abertura grátis", "Atendimento via chat e e-mail",
                  "Plataforma de gestão de impostos", "Plataforma de emissão de notas",
                  "Conta PJ gratuita", "1 reunião mensal com especialista"],
     "highlight": False},
    {"id": "ouro", "name": "Ouro", "category": "servico", "price": None, "monthly_price": None,
     "description": "Atendimento completo e acompanhamento dedicado.", "badge": None,
     "features": ["Abertura grátis", "Atendimento via chat e e-mail",
                  "Plataforma de gestão de impostos", "Plataforma de emissão de notas",
                  "Conta PJ gratuita", "1 reunião mensal com especialista",
                  "Assessor dedicado", "Atendimento via telefone",
                  "Conciliação de extrato bancário"],
     "highlight": True},
]

BASE_PLANS.extend(
    {**plan, "category": "comercio"}
    for plan in BASE_PLANS.copy()
)


@router.get("/", response_model=List[PlanResponse])
async def get_plans(category: Optional[str] = Query(None, description="Filter by category: servico or comercio")):
    if category:
        return [p for p in BASE_PLANS if p["category"] == category]
    return BASE_PLANS
