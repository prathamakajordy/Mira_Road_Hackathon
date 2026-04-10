# predict.py
import pandas as pd
import numpy as np
import joblib

# The EXACT same feature order used in train.py
FEATURES = ['gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'gluc', 'smoke', 'alco', 'age_years', 'BMI', 'Pulse_Pressure']

# Load the model directly from the current folder
try:
    model_pipeline = joblib.load('models/health_model.pkl')
except FileNotFoundError:
    print("Error: 'health_model.pkl' not found. Please run train.py first.")
    exit(1)

def predict_health(patient_data):
    """
    Takes raw patient data dictionary, computes engineered features,
    and returns a formatted health report using the trained model.
    """
    patient_data['BMI'] = patient_data['weight'] / ((patient_data['height'] / 100) ** 2)
    patient_data['Pulse_Pressure'] = patient_data['ap_hi'] - patient_data['ap_lo']
    
    df_patient = pd.DataFrame([patient_data])[FEATURES]
    
    raw_score = model_pipeline.predict(df_patient)[0]
    final_score = int(np.clip(raw_score, 1, 100))
    
    print("="*40)
    print(f"🩺 PREDICTED HEALTH SCORE: {final_score} / 100")
    print("="*40)
    
    bmi = patient_data['BMI']
    if bmi < 18.5: cat = "Underweight"
    elif bmi < 25: cat = "Normal"
    elif bmi < 30: cat = "Overweight"
    else: cat = "Obese"
    print(f"📍 BMI Category: {cat} (BMI: {bmi:.1f})")
    
    sys, dia = patient_data['ap_hi'], patient_data['ap_lo']
    if sys < 120 and dia < 80: bp_cat = "Normal"
    elif sys < 130 and dia < 80: bp_cat = "Elevated"
    elif sys < 140 or dia < 90: bp_cat = "Stage 1 Hypertension"
    else: bp_cat = "Stage 2 Hypertension"
    print(f"📍 Blood Pressure: {bp_cat} ({sys}/{dia})")
    
    gluc_map = {1: "Normal", 2: "Prediabetic", 3: "Diabetic"}
    print(f"📍 Glucose Level: {gluc_map.get(patient_data['gluc'], 'Unknown')}")

if __name__ == "__main__":
    # Test the prediction script
    test_patient = {
        'gender': 1, 
        'height': 165, 
        'weight': 60, 
        'ap_hi': 119, 
        'ap_lo': 78, 
        'gluc': 1, 
        'smoke': 0, 
        'alco': 0, 
        'age_years': 25
    }
    
    print("Running inference test...")
    predict_health(test_patient)