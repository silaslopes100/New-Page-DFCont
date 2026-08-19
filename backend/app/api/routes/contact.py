import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.ratelimit import rate_limit
from app.api.models.contact import ContactDB, ContactRequest, ContactResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("/send", response_model=ContactResponse)
async def send_contact(request: ContactRequest, db: Session = Depends(get_db), _rl: None = Depends(rate_limit)):
    try:
        contact = ContactDB(
            name=request.name,
            email=request.email,
            phone=request.phone or "",
            message=request.message,
        )
        db.add(contact)
        db.commit()
        return ContactResponse(message="Mensagem enviada com sucesso! Entraremos em contato em breve.")
    except Exception:
        logger.exception("Failed to persist contact submission")
        raise HTTPException(status_code=400, detail="Invalid request. Please check the submitted data.")
