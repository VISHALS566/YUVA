import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export function DiseasePredictorPage() {
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age: Number(age), symptoms }),
      });
      const data = await res.json();
      setResult(data.disease);
    } catch (e) {
      setResult("Prediction failed.");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Disease Predictor (ML Model)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Age"
            value={age}
            onChange={e => setAge(e.target.value)}
          />
          <Input
            placeholder="Symptoms (comma separated)"
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
          />
          <Button onClick={handlePredict} disabled={loading || !age || !symptoms}>
            {loading ? "Predicting..." : "Predict"}
          </Button>
          {result && (
            <div className="mt-4 text-lg font-semibold">
              Prediction: <span className="text-blue-600">{result}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
