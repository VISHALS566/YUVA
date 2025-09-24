
  # Multilingual Medical Translation App

  This is a comprehensive multilingual medical translation and AI diagnosis platform that combines real-time translation, machine learning disease prediction, and healthcare communication tools.

  ## Running the code

  ### Frontend (React App)
  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ### ML Disease Prediction API
  1. Install Python dependencies: `pip install -r requirements.txt`
  2. Start the ML API server: `python ml_disease_api.py`
  3. The API will be available at `http://localhost:8001`

  ## Features

  - **Real-time Medical Translation**: Translate medical conversations between 8+ languages
  - **ML Disease Prediction**: Advanced machine learning model for disease prediction based on symptoms
  - **Doctor Recommendations**: Find qualified specialists based on symptoms and location
  - **Sign Language Support**: Convert text/speech to sign language animations
  - **Patient Records**: Secure digital storage of patient history and medical records
  - **Emergency Ready**: Quick access to critical information for urgent situations

  ## ML Disease Prediction

  The ML component uses a Random Forest classifier trained on medical symptom data to predict diseases with high accuracy. The model:
  - Supports 130+ different symptoms
  - Trained on comprehensive medical datasets
  - Provides confidence scores for predictions
  - Handles partial symptom matching
  