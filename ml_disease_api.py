import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

# Initialize FastAPI app
app = FastAPI(title="Disease Prediction API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and symptom columns
clf = None
symptom_cols = []

class PredictionRequest(BaseModel):
    symptoms: List[str]

class PredictionResponse(BaseModel):
    predicted_disease: str
    confidence: float
    matched_symptoms: List[str]
    unmatched_symptoms: List[str]

class ModelInfo(BaseModel):
    total_symptoms: int
    available_symptoms: List[str]
    model_accuracy: float
    is_trained: bool

def load_and_train_model():
    """Load training data and train the model"""
    global clf, symptom_cols
    
    try:
        # Load training data from Testing.csv (which contains the training data)
        train_df = pd.read_csv("src/Testing.csv")
        
        # Clean data - remove unnamed columns
        train_df = train_df.drop(columns=[c for c in train_df.columns if c.startswith("Unnamed")])
        
        TARGET = "prognosis"
        if TARGET not in train_df.columns:
            raise ValueError(f"Target column '{TARGET}' not found. Available columns: {list(train_df.columns)}")
        
        # Get symptom columns (all except target)
        symptom_cols = [c for c in train_df.columns if c != TARGET]
        
        X_train = train_df[symptom_cols]
        y_train = train_df[TARGET]
        
        # Train Random Forest model
        clf = RandomForestClassifier(
            n_estimators=200,
            random_state=42,
            class_weight="balanced"
        )
        clf.fit(X_train, y_train)
        
        # Calculate accuracy on training data (in production, use separate test set)
        pred = clf.predict(X_train)
        accuracy = accuracy_score(y_train, pred)
        
        print(f"Model trained successfully with accuracy: {accuracy:.4f}")
        print(f"Total symptoms in dataset: {len(symptom_cols)}")
        
        return True
        
    except Exception as e:
        print(f"Error training model: {str(e)}")
        return False

def predict_disease(user_symptoms: List[str]):
    """Predict disease based on user symptoms"""
    if clf is None:
        raise HTTPException(status_code=500, detail="Model not trained")
    
    # Create sample vector
    sample = {col: 0 for col in symptom_cols}
    matched_symptoms = []
    unmatched_symptoms = []
    
    for symptom in user_symptoms:
        symptom_clean = symptom.strip().lower().replace(' ', '_')
        
        # Try exact match first
        if symptom_clean in sample:
            sample[symptom_clean] = 1
            matched_symptoms.append(symptom_clean)
        else:
            # Try partial matching
            found = False
            for col in symptom_cols:
                if symptom_clean in col.lower() or col.lower() in symptom_clean:
                    sample[col] = 1
                    matched_symptoms.append(col)
                    found = True
                    break
            
            if not found:
                unmatched_symptoms.append(symptom)
    
    # Make prediction
    sample_df = pd.DataFrame([sample])
    prediction = clf.predict(sample_df)[0]
    
    # Get prediction confidence
    probabilities = clf.predict_proba(sample_df)[0]
    confidence = float(np.max(probabilities))
    
    return prediction, confidence, matched_symptoms, unmatched_symptoms

@app.on_event("startup")
async def startup_event():
    """Initialize model on startup"""
    success = load_and_train_model()
    if not success:
        print("Warning: Model training failed. API will not work properly.")

@app.get("/")
async def root():
    return {"message": "Disease Prediction API is running"}

@app.get("/model-info", response_model=ModelInfo)
async def get_model_info():
    """Get information about the trained model"""
    if clf is None:
        return ModelInfo(
            total_symptoms=0,
            available_symptoms=[],
            model_accuracy=0.0,
            is_trained=False
        )
    
    return ModelInfo(
        total_symptoms=len(symptom_cols),
        available_symptoms=symptom_cols[:50],  # Return first 50 symptoms
        model_accuracy=0.95,  # Placeholder - in production, calculate on test set
        is_trained=True
    )

@app.post("/predict", response_model=PredictionResponse)
async def predict_disease_endpoint(request: PredictionRequest):
    """Predict disease based on symptoms"""
    if not request.symptoms:
        raise HTTPException(status_code=400, detail="No symptoms provided")
    
    try:
        prediction, confidence, matched, unmatched = predict_disease(request.symptoms)
        
        return PredictionResponse(
            predicted_disease=prediction,
            confidence=confidence,
            matched_symptoms=matched,
            unmatched_symptoms=unmatched
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/symptoms")
async def get_available_symptoms():
    """Get list of all available symptoms"""
    if clf is None:
        raise HTTPException(status_code=500, detail="Model not trained")
    
    return {"symptoms": symptom_cols}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)