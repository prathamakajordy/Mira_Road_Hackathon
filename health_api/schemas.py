# schemas.py
from pydantic import BaseModel, Field

class HealthPredictionRequest(BaseModel):
    # Field(..., ge=X, le=Y) enforces 'greater than or equal' and 'less than or equal'
    age_years: int = Field(..., ge=18, le=120, description="Age in years")
    gender: int = Field(..., ge=1, le=2, description="1: Female, 2: Male")
    height: float = Field(..., gt=50, le=250, description="Height in cm")
    weight: float = Field(..., gt=10, le=300, description="Weight in kg")
    ap_hi: int = Field(..., ge=80, le=220, description="Systolic Blood Pressure (SBP)")
    ap_lo: int = Field(..., ge=50, le=130, description="Diastolic Blood Pressure (DBP)")
    gluc: int = Field(..., ge=1, le=3, description="1: Normal, 2: Prediabetic, 3: Diabetic")
    smoke: int = Field(..., ge=0, le=1, description="0: No, 1: Yes")
    alco: int = Field(..., ge=0, le=1, description="0: No, 1: Yes")