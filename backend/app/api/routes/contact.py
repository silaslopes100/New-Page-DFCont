from fastapi import APIRouter, Depends, HTTPException
from app.core.ratelimit import rate_limit
from app.api.models.contact import ContactRequest, ContactResponse

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("/send", response_model=ContactResponse)
async def send_contact(request: ContactRequest, _rl: None = Depends(rate_limit)):
    try:
        return ContactResponse(message="Mensagem enviada com sucesso! Entraremos em contato em breve.")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid request. Please check the submitted data.")
