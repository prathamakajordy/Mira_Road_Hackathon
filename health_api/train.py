# train.py
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score

def generate_health_score(row):
    score = 100
    bmi = row['BMI']
    if bmi >= 30: score -= 10
    elif bmi >= 25: score -= 5
    elif bmi < 18.5: score -= 5
        
    sys, dia = row['ap_hi'], row['ap_lo']
    if sys >= 140 or dia >= 90: score -= 15
    elif sys >= 130 or dia >= 80: score -= 10
    elif sys >= 120 and dia < 80: score -= 5
        
    if row['gluc'] == 3: score -= 15
    elif row['gluc'] == 2: score -= 8
        
    if row['smoke'] == 1: score -= 10
    if row['alco'] == 1: score -= 5
        
    if row['age_years'] > 40:
        score -= int((row['age_years'] - 40) / 4)
        
    return max(1, min(100, score))

def main():
    print("Loading data...")
    df = pd.read_csv('quick assessment dataset.csv')

    # Smart Age Handling
    if 'age (in years)' in df.columns:
        df = df.drop('age', axis=1)
        df.rename(columns={'age (in years)': 'age_years'}, inplace=True)
    elif 'age' in df.columns:
        df['age_years'] = (df['age'] / 365.25).astype(int)
        df = df.drop('age', axis=1)

    print("Cleaning data...")
    df = df[(df['ap_hi'] >= 80) & (df['ap_hi'] <= 220)]
    df = df[(df['ap_lo'] >= 50) & (df['ap_lo'] <= 130)]
    df = df[df['ap_hi'] > df['ap_lo']]

    df['BMI'] = df['weight'] / ((df['height'] / 100) ** 2)
    df['Pulse_Pressure'] = df['ap_hi'] - df['ap_lo']

    df['target_score'] = df.apply(generate_health_score, axis=1)

    features = ['gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'gluc', 'smoke', 'alco', 'age_years', 'BMI', 'Pulse_Pressure']
    X = df[features]
    y = df['target_score']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Building and Training the Pipeline...")
    # THIS is the crucial part that glues the scaler and model together
    health_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('rf_model', RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42))
    ])

    # Train the pipeline
    health_pipeline.fit(X_train, y_train)

    y_pred = health_pipeline.predict(X_test)
    y_pred = np.clip(y_pred, 1, 100)
    print(f"MAE: {mean_absolute_error(y_test, y_pred):.2f} | R-squared: {r2_score(y_test, y_pred):.4f}")

    # Save the PIPELINE object, not a dictionary
    model_path = 'models/health_model.pkl'
    joblib.dump(health_pipeline, model_path)
    print(f"✅ Training complete. PIPELINE saved locally as '{model_path}'")

if __name__ == "__main__":
    main()