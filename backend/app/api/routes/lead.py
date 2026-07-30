from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.models.lead import LeadRequest, LeadResponse
from app.services.lead_service import create_lead as create_lead_service
from app.core.database import get_db

router = APIRouter(prefix="/api/leads", tags=["leads"])


@router.post("/create", response_model=LeadResponse)
async def create_lead(request: LeadRequest, db: Session = Depends(get_db)):
    try:
        lead = create_lead_service(db, request)
        return LeadResponse(id=lead.id, message="Lead cadastrado com sucesso!")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
