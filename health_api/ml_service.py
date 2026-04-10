# ml_service.py
import joblib
import pandas as pd
import numpy as np

# Global variable to hold the model in memory
model_pipeline = None

# The exact feature order the model was trained on
FEATURES = ['gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'gluc', 'smoke', 'alco', 'age_years', 'BMI', 'Pulse_Pressure']

def load_model(model_path: str = "models/health_model.pkl"):
    """Loads the model into memory."""
    global model_pipeline
    model_pipeline = joblib.load(model_path)
    print("Model loaded successfully!")

def generate_insights(score, bmi, sys, dia, gluc):
    """Generates human-readable categories and explanations."""
    # BMI Logic
    if bmi < 18.5: bmi_cat = "Underweight"
    elif bmi < 25: bmi_cat = "Normal"
    elif bmi < 30: bmi_cat = "Overweight"
    else: bmi_cat = "Obese"

    # BP Logic
    if sys < 120 and dia < 80: bp_cat = "Normal"
    elif sys < 130 and dia < 80: bp_cat = "Elevated"
    elif sys < 140 or dia < 90: bp_cat = "Stage 1 Hypertension"
    else: bp_cat = "Stage 2 Hypertension"

    # Glucose Logic
    gluc_map = {1: "Normal", 2: "Prediabetic", 3: "Diabetic"}
    gluc_cat = gluc_map.get(gluc, "Unknown")

    # Explanation Logic
    if score > 85: expl = "Excellent health condition. Maintain your current lifestyle!"
    elif score > 70: expl = "Good health, but managing your lifestyle and monitoring metrics could improve it."
    else: expl = "Your score indicates multiple elevated risk factors. Consider consulting a healthcare provider."

    return bmi_cat, bp_cat, gluc_cat, expl

def predict_health(data: dict) -> dict:
    """Takes validated dict, runs feature engineering, and predicts."""
    # 1. Feature Engineering
    bmi = data['weight'] / ((data['height'] / 100) ** 2)
    pulse_pressure = data['ap_hi'] - data['ap_lo']
    
    data['BMI'] = bmi
    data['Pulse_Pressure'] = pulse_pressure
    
    # 2. DataFrame formatting (enforces correct column order)
    df = pd.DataFrame([data])[FEATURES]
    
    # 3. Inference
    raw_score = model_pipeline.predict(df)[0]
    final_score = int(np.clip(raw_score, 1, 100))
    
    # 4. Generate Interpretations
    bmi_cat, bp_cat, gluc_cat, expl = generate_insights(final_score, bmi, data['ap_hi'], data['ap_lo'], data['gluc'])
    
    # 5. Return Output Schema
    return {
        "health_score": final_score,
        "bmi": {
            "value": round(bmi, 1),
            "category": bmi_cat
        },
        "blood_pressure_category": bp_cat,
        "glucose_category": gluc_cat,
        "explanation": expl
    }