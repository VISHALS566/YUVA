import pandas as pd
import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.metrics import classification_report
from sklearn.preprocessing import StandardScaler
# --------------------
# Load the dataset
# --------------------
df = pd.read_excel("Dataset.csv.xlsx")

# --------------------
# Clean Symptoms column
# --------------------
def clean_symptoms(text):
    if isinstance(text, str):
        text = text.lower()
        text = re.sub(r"[;]", ",", text)  # Replace semicolons with commas
        text = re.sub(r"\s+", " ", text)  # Replace multiple spaces with one
        return text.strip()
    return ""

df['Symptoms'] = df['Symptoms'].apply(clean_symptoms)

# --------------------
# Define features
# --------------------
X = df[['Age', 'Symptoms']]
y = df['Disease']

# --------------------
# Preprocessing
# --------------------
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['Age']),
        ('text', TfidfVectorizer(), 'Symptoms')
    ]
)

# --------------------
# Build pipeline
# --------------------
model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])

# --------------------
# Train/test split
# --------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model_pipeline.fit(X_train, y_train)

# --------------------
# Evaluation
# --------------------
y_pred = model_pipeline.predict(X_test)
print("\nModel Evaluation:")
print(classification_report(y_test, y_pred))

# --------------------
# Function to use the model for prediction
# --------------------
def predict_disease_with_input():
    try:
        age = int(input("\nEnter Age: "))
        symptoms = input("Enter Symptoms (comma-separated): ")
        cleaned_symptoms = clean_symptoms(symptoms.strip())

        input_df = pd.DataFrame([{
            'Age': age,
            'Symptoms': cleaned_symptoms
        }])

        prediction = model_pipeline.predict(input_df)
        print(f"\n✅ Predicted Disease: {prediction[0]}")

    except Exception as e:
        print(f"\n❌ Error during prediction: {e}")

# --------------------
# Run Prediction
# --------------------
if __name__ == "_main_":
    predict_disease_with_input()