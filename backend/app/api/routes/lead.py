import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.models.lead import LeadRequest, LeadResponse
from app.services.lead_service import (
    create_lead as create_lead_service,
    lead_to_notification_dict,
)
from app.services.email_service import send_lead_notification
from app.core.database import get_db
from app.core.ratelimit import rate_limit

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/leads", tags=["leads"])


@router.post("/create", response_model=LeadResponse)
async def create_lead(request: LeadRequest, db: Session = Depends(get_db), _rl: None = Depends(rate_limit)):
    try:
        lead = create_lead_service(db, request)
    except Exception:
        logger.exception("Failed to create lead")
        raise HTTPException(status_code=400, detail="Invalid request. Please check the submitted data.")

    # E-mail notification is best-effort: persistence above must not roll back
    # when the mail service is temporarily unavailable. Failures are logged
    # internally by the service without exposing sensitive details here.
    if not send_lead_notification(lead_to_notification_dict(request)):
        logger.error(
            "Lead %s persisted but notification e-mail could not be sent.", lead.id
        )

    return LeadResponse(id=lead.id, message="Lead cadastrado com sucesso!")