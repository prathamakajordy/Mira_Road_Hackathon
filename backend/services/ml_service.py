import os
import joblib
import pandas as pd
import numpy as np

# ── Feature order the model was trained on ──────────────────────────────────
FEATURES = ['gender', 'height', 'weight', 'ap_hi', 'ap_lo',
            'gluc', 'smoke', 'alco', 'age_years', 'BMI', 'Pulse_Pressure']

# ── Load model ONCE at import time (not per request) ────────────────────────
_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "health_model.pkl")
_model = joblib.load(os.path.abspath(_MODEL_PATH))

# ── Helpers ──────────────────────────────────────────────────────────────────
def _bmi_category(bmi: float) -> str:
    if bmi < 18.5: return "Underweight"
    if bmi < 25:   return "Normal"
    if bmi < 30:   return "Overweight"
    return "Obese"

def _bp_category(sys: int, dia: int) -> str:
    if sys < 120 and dia < 80:  return "Normal"
    if sys < 130 and dia < 80:  return "Elevated"
    if sys < 140 or dia < 90:   return "Stage 1 Hypertension"
    return "Stage 2 Hypertension"

def _explanation(score: int) -> str:
    if score > 85: return "Excellent health condition. Maintain your current lifestyle!"
    if score > 70: return "Good health, but managing your lifestyle and monitoring metrics could improve it."
    return "Your score indicates multiple elevated risk factors. Consider consulting a healthcare provider."

# ── Public API ───────────────────────────────────────────────────────────────
def get_quick_assessment(data: dict) -> dict:
    """Run prediction directly using the in-process model. No HTTP calls."""
    try:
        bmi = data['weight'] / ((data['height'] / 100) ** 2)
        pulse_pressure = data['ap_hi'] - data['ap_lo']

        row = {**data, 'BMI': bmi, 'Pulse_Pressure': pulse_pressure}
        df = pd.DataFrame([row])[FEATURES]

        raw_score = _model.predict(df)[0]
        score = int(np.clip(raw_score, 1, 100))

        return {
            "health_score": score,
            "bmi": {"value": round(bmi, 1), "category": _bmi_category(bmi)},
            "blood_pressure_category": _bp_category(data['ap_hi'], data['ap_lo']),
            "glucose_category": {1: "Normal", 2: "Prediabetic", 3: "Diabetic"}.get(data['gluc'], "Unknown"),
            "explanation": _explanation(score)
        }
    except Exception as e:
        return {"error": True, "message": f"Prediction failed: {str(e)}"}
