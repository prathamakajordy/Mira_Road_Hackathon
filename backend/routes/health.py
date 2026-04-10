from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from typing import List

from services import ml_service
from services.assessment_service import create_assessment, get_user_assessments
from utils.security import SECRET_KEY, ALGORITHM
from config.db import get_db

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

# ── Input schema ──────────────────────────────────────────────────────────────
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

# ── Response schema for history ───────────────────────────────────────────────
class AssessmentHistoryItem(BaseModel):
    prediction: str
    risk_score: float
    created_at: str

# ── POST /assess/quick ────────────────────────────────────────────────────────
@router.post("/assess/quick", status_code=status.HTTP_200_OK)
def quick_assessment(
    request: QuickAssessmentRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
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

    # ── Persist to DB with user isolation ─────────────────────────────────────
    health_score: int = result.get("health_score", 0)
    risk_score = round(1.0 - (health_score / 100), 2)
    prediction = (
        "Low Risk"      if health_score > 70 else
        "Moderate Risk" if health_score > 40 else
        "High Risk"
    )

    create_assessment(
        db=db,
        user_id=user_id,
        input_data=request.model_dump(),
        prediction=prediction,
        risk_score=risk_score,
    )

    return result

# ── GET /history ──────────────────────────────────────────────────────────────
@router.get("/history", status_code=status.HTTP_200_OK, response_model=List[AssessmentHistoryItem])
def get_history(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Return the authenticated user's past assessments only (newest first)."""
    records = get_user_assessments(db, user_id)
    return [
        AssessmentHistoryItem(
            prediction=r.prediction,
            risk_score=r.risk_score,
            created_at=r.created_at.strftime("%Y-%m-%d"),
        )
        for r in records
    ]
