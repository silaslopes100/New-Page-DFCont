from sqlalchemy.orm import Session
from app.api.models.lead import LeadDB, LeadRequest


def create_lead(db: Session, request: LeadRequest) -> LeadDB:
    lead = LeadDB(
        name=request.name,
        email=request.email,
        phone=request.phone,
        city=request.city,
        activity=request.activity,
        origin=request.origin,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead
