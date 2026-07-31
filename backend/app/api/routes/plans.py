from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from app.api.models.plan import PlanDB, PlanResponse
from app.core.database import get_db

router = APIRouter(prefix="/api/plans", tags=["plans"])

BASE_PLANS = [
    {"id": "basico", "name": "Básico", "category": "servico", "price": 139, "monthly_price": 139,
     "description": "Plano essencial para quem está começando.", "badge": None,
     "features": ["Contabilidade completa", "Certificado digital", "Abertura grátis",
                  "Atendimento via chat e e-mail", "Plataforma de notas fiscais"],
     "highlight": False},
    {"id": "padrao", "name": "Padrão", "category": "servico", "price": 195, "monthly_price": 195,
     "description": "Mais benefícios para seu negócio.", "badge": "Mais Popular",
     "features": ["Tudo do Básico", "Atendimento via WhatsApp", "Conta PJ gratuita",
                  "Relatórios mensais", "Suporte prioritário"],
     "highlight": False},
    {"id": "multibeneficios", "name": "Multibenefícios", "category": "servico", "price": 225, "monthly_price": 225,
     "description": "Melhor custo-benefício.", "badge": "Melhor Custo-Benefício",
     "features": ["Tudo do Padrão", "2 benefícios grátis (academia, psicologia, nutrição, seguro, odontológico)",
                  "Descontos exclusivos", "Programa de fidelidade"],
     "highlight": True},
    {"id": "essencial", "name": "Experts Essencial", "category": "servico", "price": 395, "monthly_price": 395,
     "description": "Atendimento personalizado.", "badge": None,
     "features": ["Tudo do Padrão", "Assessor dedicado", "Atendimento via telefone",
                  "Emissão de notas pela equipe", "Conciliação de extrato"],
     "highlight": False},
    {"id": "comercio_basico", "name": "Comércio Básico", "category": "comercio", "price": 245, "monthly_price": 245,
     "description": "Solução completa para comércio.", "badge": None,
     "features": ["Contabilidade completa", "Certificado digital", "Abertura grátis",
                  "Atendimento via chat e e-mail", "Plataforma de notas fiscais", "Escrituração fiscal"],
     "highlight": False},
    {"id": "comercio_avancado", "name": "Comércio Avançado", "category": "comercio", "price": 479, "monthly_price": 479,
     "description": "Gestão fiscal avançada.", "badge": "Recomendado",
     "features": ["Tudo do Comércio Básico", "Atendimento via WhatsApp e telefone", "Assessor dedicado",
                  "Conciliação bancária", "Relatórios gerenciais", "Suporte fiscal completo"],
     "highlight": True},
]


@router.get("/", response_model=List[PlanResponse])
async def get_plans(category: Optional[str] = Query(None, description="Filter by category: servico or comercio")):
    if category:
        return [p for p in BASE_PLANS if p["category"] == category]
    return BASE_PLANS

