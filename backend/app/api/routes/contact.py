from fastapi import APIRouter, HTTPException
from app.api.models.plan import ContactRequest, ContactResponse

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("/send", response_model=ContactResponse)
async def send_contact(request: ContactRequest):
    try:
        return ContactResponse(message="Mensagem enviada com sucesso! Entraremos em contato em breve.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
