import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Heart, Brain, Thermometer, Activity, AlertTriangle } from 'lucide-react';
import { Progress } from './ui/progress';

interface Symptom {
  id: string;
  name: string;
  selected: boolean;
}

interface PredictionResult {
  condition: string;
  confidence: number;
  description: string;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
  icon: React.ReactNode;
}

export function DiseasePrediction() {
  const [age, setAge] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { id: '1', name: 'Chest pain', selected: false },
    { id: '2', name: 'Shortness of breath', selected: false },
    { id: '3', name: 'Headache', selected: false },
    { id: '4', name: 'Fever', selected: false },
    { id: '5', name: 'Nausea', selected: false },
    { id: '6', name: 'Dizziness', selected: false },
    { id: '7', name: 'Fatigue', selected: false },
    { id: '8', name: 'Cough', selected: false },
    { id: '9', name: 'Joint pain', selected: false },
    { id: '10', name: 'Abdominal pain', selected: false },
    { id: '11', name: 'Skin rash', selected: false },
    { id: '12', name: 'Confusion', selected: false }
  ]);
  
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleSymptom = (symptomId: string) => {
    setSymptoms(symptoms.map(symptom => 
      symptom.id === symptomId 
        ? { ...symptom, selected: !symptom.selected }
        : symptom
    ));
  };

  const generatePredictions = () => {
    setIsAnalyzing(true);
    
    // Mock AI analysis based on selected symptoms
    setTimeout(() => {
      const selectedSymptoms = symptoms.filter(s => s.selected);
      const mockPredictions: PredictionResult[] = [];
      
      // Simple rule-based prediction system (mock)
      if (selectedSymptoms.some(s => s.name === 'Chest pain')) {
        mockPredictions.push({
          condition: 'Angina Pectoris',
          confidence: 78,
          description: 'Chest pain caused by reduced blood flow to the heart muscles.',
          recommendations: [
            'Immediate medical attention required',
            'Avoid physical exertion',
            'Take prescribed nitrates if available'
          ],
          urgency: 'high',
          icon: <Heart className="h-5 w-5 text-red-500" />
        });
      }
      
      if (selectedSymptoms.some(s => s.name === 'Headache') && selectedSymptoms.some(s => s.name === 'Fever')) {
        mockPredictions.push({
          condition: 'Viral Infection',
          confidence: 65,
          description: 'Common viral infection causing systemic symptoms.',
          recommendations: [
            'Rest and hydration',
            'Over-the-counter pain relievers',
            'Monitor temperature'
          ],
          urgency: 'medium',
          icon: <Thermometer className="h-5 w-5 text-orange-500" />
        });
      }
      
      if (selectedSymptoms.some(s => s.name === 'Dizziness') && selectedSymptoms.some(s => s.name === 'Confusion')) {
        mockPredictions.push({
          condition: 'Neurological Concern',
          confidence: 82,
          description: 'Potential neurological issue requiring evaluation.',
          recommendations: [
            'Seek immediate medical evaluation',
            'Avoid driving or operating machinery',
            'Have someone accompany you'
          ],
          urgency: 'high',
          icon: <Brain className="h-5 w-5 text-red-500" />
        });
      }
      
      if (mockPredictions.length === 0) {
        mockPredictions.push({
          condition: 'General Malaise',
          confidence: 45,
          description: 'Non-specific symptoms that may indicate minor illness.',
          recommendations: [
            'Monitor symptoms',
            'Rest and proper nutrition',
            'Consult healthcare provider if symptoms persist'
          ],
          urgency: 'low',
          icon: <Activity className="h-5 w-5 text-green-500" />
        });
      }
      
      setPredictions(mockPredictions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-orange-500 bg-orange-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            AI Disease Prediction
          </CardTitle>
          <p className="text-muted-foreground">
            Select your symptoms and age for AI-powered health analysis. This is for informational purposes only and should not replace professional medical advice.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="w-32"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Select Your Symptoms</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {symptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom.id}
                    checked={symptom.selected}
                    onCheckedChange={() => toggleSymptom(symptom.id)}
                  />
                  <Label
                    htmlFor={symptom.id}
                    className="text-sm cursor-pointer"
                  >
                    {symptom.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={generatePredictions}
              disabled={symptoms.filter(s => s.selected).length === 0 || !age || isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4" />
                  Analyze Symptoms
                </>
              )}
            </Button>
            
            {symptoms.filter(s => s.selected).length > 0 && (
              <span className="text-sm text-muted-foreground">
                {symptoms.filter(s => s.selected).length} symptoms selected
              </span>
            )}
          </div>
          
          {predictions.length > 0 && (
            <div className="space-y-4">
              <h3>Analysis Results</h3>
              {predictions.map((prediction, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {prediction.icon}
                          <h4>{prediction.condition}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getUrgencyColor(prediction.urgency)}>
                            {prediction.urgency.toUpperCase()} PRIORITY
                          </Badge>
                          <Badge variant="outline">
                            {prediction.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                      
                      <Progress value={prediction.confidence} className="w-full" />
                      
                      <p className="text-sm text-muted-foreground">
                        {prediction.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm">Recommendations:</h5>
                        <ul className="text-sm space-y-1">
                          {prediction.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical diagnosis. Always consult with a qualified healthcare provider for proper medical evaluation and treatment.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}