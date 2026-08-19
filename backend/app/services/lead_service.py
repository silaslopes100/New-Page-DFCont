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


def lead_to_notification_dict(request: LeadRequest) -> dict:
    """Plain dict with display-ready values for the notification e-mail."""
    return {
        "name": request.name,
        "email": request.email,
        "phone": request.phone,
        "city": request.city,
        "activity": request.activity,
        "origin": request.origin,
        "toggle": request.toggle,
        "employees": request.employees,
        "routine": request.routine,
        "contact": request.contact,
        "benefits": ("Sim" if request.benefits else "Não")
        if request.benefits is not None
        else None,
        "recommended_plan": request.recommended_plan,
        "monthly_price": f"R$ {request.monthly_price:.2f}"
        if request.monthly_price is not None
        else None,
    }