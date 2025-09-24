import pandas as pd
import re
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
# Load and train model (same as MLMODEL.py)
df = pd.read_excel("Dataset.xlsx")

def clean_symptoms(text):
    if isinstance(text, str):
        text = text.lower()
        text = re.sub(r"[;]", ",", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip()
    return ""

df['Symptoms'] = df['Symptoms'].apply(clean_symptoms)
X = df[['Age', 'Symptoms']]
y = df['Disease']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['Age']),
        ('text', TfidfVectorizer(), 'Symptoms')
    ]
)

model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])

model_pipeline.fit(X, y)

# FastAPI app
app = FastAPI()

class PredictRequest(BaseModel):
    age: int
    symptoms: str

class PredictResponse(BaseModel):
    disease: str

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    cleaned_symptoms = clean_symptoms(req.symptoms)
    input_df = pd.DataFrame([{
        'Age': req.age,
        'Symptoms': cleaned_symptoms
    }])
    prediction = model_pipeline.predict(input_df)
    return PredictResponse(disease=prediction[0])
