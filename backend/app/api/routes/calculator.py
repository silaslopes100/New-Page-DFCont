from fastapi import APIRouter, HTTPException
from app.api.models.calculator import CalculatorRequest, CalculatorResponse
from app.services.calculator_service import determine_plan

router = APIRouter(prefix="/api/calculator", tags=["calculator"])


@router.post("/calculate", response_model=CalculatorResponse)
async def calculate_plan(request: CalculatorRequest):
    try:
        plan = determine_plan(request)
        return plan
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
