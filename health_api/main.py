# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from schemas import HealthPredictionRequest
import ml_service

# Load model on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    ml_service.load_model()
    yield
    # Optional cleanup on shutdown can go here

app = FastAPI(title="Health Risk Prediction API", lifespan=lifespan)

# Allow Frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
@app.post("/predict/quick")
async def get_prediction(request: HealthPredictionRequest):
    # Custom Validation: Diastolic cannot be higher than Systolic
    if request.ap_lo >= request.ap_hi:
        raise HTTPException(status_code=400, detail="Diastolic BP must be lower than Systolic BP")
    
    # request.model_dump() converts the Pydantic object into a Python dictionary
    prediction_result = ml_service.predict_health(request.model_dump())
    
    return prediction_result