import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Activity, Brain, AlertTriangle, CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';

interface PredictionResult {
  predicted_disease: string;
  confidence: number;
  matched_symptoms: string[];
  unmatched_symptoms: string[];
}

interface ModelInfo {
  total_symptoms: number;
  available_symptoms: string[];
  model_accuracy: number;
  is_trained: boolean;
}

export function MLDiseasePrediction() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [availableSymptoms, setAvailableSymptoms] = useState<string[]>([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);

  const API_BASE_URL = 'http://localhost:8001';

  // Check API connection and load model info
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/model-info`);
        if (response.ok) {
          const info = await response.json();
          setModelInfo(info);
          setApiConnected(info.is_trained);
          
          // Load available symptoms
          const symptomsResponse = await fetch(`${API_BASE_URL}/symptoms`);
          if (symptomsResponse.ok) {
            const symptomsData = await symptomsResponse.json();
            setAvailableSymptoms(symptomsData.symptoms);
            setFilteredSymptoms(symptomsData.symptoms.slice(0, 50)); // Show first 50
          }
        }
      } catch (err) {
        console.error('Failed to connect to ML API:', err);
        setApiConnected(false);
        setError('Unable to connect to ML prediction service. Please ensure the API is running on port 8001.');
      }
    };

    checkConnection();
  }, []);

  // Filter symptoms based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSymptoms(availableSymptoms.slice(0, 50));
    } else {
      const filtered = availableSymptoms.filter(symptom =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 50);
      setFilteredSymptoms(filtered);
    }
  }, [searchTerm, availableSymptoms]);

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const predictDisease = async () => {
    if (symptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError(`Prediction failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSymptoms([]);
    setPrediction(null);
    setError(null);
  };

  const formatSymptomName = (symptom: string) => {
    return symptom.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (!apiConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-red-600" />
              ML Disease Prediction - Service Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error || 'The ML prediction service is not available. Please start the API server by running: python ml_disease_api.py'}
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">To start the ML API:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Install required packages: <code className="bg-gray-200 px-1 rounded">pip install fastapi uvicorn scikit-learn pandas</code></li>
                <li>Run the API: <code className="bg-gray-200 px-1 rounded">python ml_disease_api.py</code></li>
                <li>The API will be available at <code className="bg-gray-200 px-1 rounded">http://localhost:8001</code></li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            ML Disease Prediction System
          </CardTitle>
          <p className="text-muted-foreground">
            Advanced machine learning model trained on medical data to predict diseases based on symptoms
          </p>
          
          {modelInfo && (
            <div className="flex gap-4 mt-4">
              <Badge variant="outline" className="text-green-600 bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                Model Trained
              </Badge>
              <Badge variant="outline">
                {modelInfo.total_symptoms} Symptoms Available
              </Badge>
              <Badge variant="outline">
                {(modelInfo.model_accuracy * 100).toFixed(1)}% Accuracy
              </Badge>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Symptom Selection */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Select Your Symptoms</h3>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search symptoms..."
                    className="pl-10"
                  />
                </div>
                
                <ScrollArea className="h-96 border rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-2">
                    {filteredSymptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={symptoms.includes(symptom)}
                          onCheckedChange={() => toggleSymptom(symptom)}
                        />
                        <label
                          htmlFor={symptom}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {formatSymptomName(symptom)}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={predictDisease}
                  disabled={symptoms.length === 0 || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Activity className="h-4 w-4 mr-2" />
                      Predict Disease
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={clearSelection}>
                  Clear All
                </Button>
              </div>
              
              {symptoms.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Selected Symptoms ({symptoms.length}):</h4>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom) => (
                      <Badge 
                        key={symptom} 
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => toggleSymptom(symptom)}
                      >
                        {formatSymptomName(symptom)}
                        <XCircle className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Prediction Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Prediction Results</h3>
              
              {error && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {prediction && (
                <div className="space-y-4">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xl font-semibold text-blue-700">
                            {prediction.predicted_disease.replace(/_/g, ' ').toUpperCase()}
                          </h4>
                          <Badge className={getConfidenceColor(prediction.confidence)}>
                            {(prediction.confidence * 100).toFixed(1)}% Confidence
                          </Badge>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${prediction.confidence * 100}%` }}
                          ></div>
                        </div>
                        
                        {prediction.matched_symptoms.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-green-700 mb-2">
                              Matched Symptoms ({prediction.matched_symptoms.length}):
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {prediction.matched_symptoms.map((symptom) => (
                                <Badge key={symptom} className="text-green-700 bg-green-100">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {formatSymptomName(symptom)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {prediction.unmatched_symptoms.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-orange-700 mb-2">
                              Unmatched Symptoms ({prediction.unmatched_symptoms.length}):
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {prediction.unmatched_symptoms.map((symptom) => (
                                <Badge key={symptom} className="text-orange-700 bg-orange-100">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {!prediction && !error && !isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                  <Brain className="h-16 w-16 mb-4 opacity-50" />
                  <p>Select symptoms and click "Predict Disease" to get ML-powered diagnosis</p>
                  <p className="text-sm mt-2">Our model analyzes {modelInfo?.total_symptoms} different symptoms</p>
                </div>
              )}
            </div>
          </div>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Medical Disclaimer:</strong> This ML prediction system is for educational and informational purposes only. 
              It should not replace professional medical diagnosis or treatment. Always consult with qualified healthcare 
              professionals for proper medical evaluation and care.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}