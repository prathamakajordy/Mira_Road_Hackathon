from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from jose import jwt, JWTError
from services import ml_service
from utils.security import SECRET_KEY, ALGORITHM

router = APIRouter()
security = HTTPBearer()

# ── JWT dependency ────────────────────────────────────────────────────────────
def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail={"error": True, "message": "Invalid token", "code": "INVALID_TOKEN"})
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail={"error": True, "message": "Invalid token", "code": "INVALID_TOKEN"})

# ── Input schema ─────────────────────────────────────────────────────────────
class QuickAssessmentRequest(BaseModel):
    age_years: int   = Field(..., ge=18, le=120)
    gender:    int   = Field(..., ge=1,  le=2)
    height:    float = Field(..., gt=50, le=250)
    weight:    float = Field(..., gt=10, le=300)
    ap_hi:     int   = Field(..., ge=80, le=220, description="Systolic BP")
    ap_lo:     int   = Field(..., ge=50, le=130, description="Diastolic BP")
    gluc:      int   = Field(..., ge=1,  le=3)
    smoke:     int   = Field(..., ge=0,  le=1)
    alco:      int   = Field(..., ge=0,  le=1)

# ── Route ─────────────────────────────────────────────────────────────────────
@router.post("/assess/quick", status_code=status.HTTP_200_OK)
def quick_assessment(
    request: QuickAssessmentRequest,
    user_id: str = Depends(get_current_user_id)
):
    if request.ap_lo >= request.ap_hi:
        raise HTTPException(
            status_code=400,
            detail={"error": True, "message": "Diastolic BP must be lower than Systolic BP", "code": "INVALID_BP"}
        )

    result = ml_service.get_quick_assessment(request.model_dump())

    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": True, "message": result.get("message", "Prediction failed"), "code": "PREDICTION_ERROR"}
        )

    return result
