import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Hand, Volume2, Mic, Camera, Play, Pause, RotateCcw, Video } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SignLanguageModel, signGestures } from '../signLanguageModel';

interface SignAnimation {
  id: string;
  text: string;
  description: string;
  duration: number;
}

export function SignLanguageInterface() {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('asl');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<SignAnimation | null>(null);
  const [activeTab, setActiveTab] = useState('text-to-sign');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const modelRef = useRef<SignLanguageModel | null>(null);

  const signLanguages = [
    { code: 'asl', name: 'American Sign Language (ASL)' },
    { code: 'bsl', name: 'British Sign Language (BSL)' },
    { code: 'csl', name: 'Chinese Sign Language (CSL)' },
    { code: 'fsl', name: 'French Sign Language (LSF)' }
  ];
  
  // Initialize the sign language model
  useEffect(() => {
    const initModel = async () => {
      try {
        modelRef.current = new SignLanguageModel();
        await modelRef.current.loadModel();
        setModelLoaded(true);
      } catch (error) {
        console.error('Error loading sign language model:', error);
      }
    };
    
    initModel();
    
    return () => {
      // Clean up resources when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Start webcam for real-time sign language detection
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsWebcamActive(true);
        startSignDetection();
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Unable to access webcam. Please ensure you have granted camera permissions.');
    }
  };
  
  // Stop webcam and detection
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setIsWebcamActive(false);
    setDetectedSign(null);
    setConfidenceScore(0);
  };
  
  // Process video frames for sign detection
  const processVideoFrame = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessingFrame || !modelRef.current) {
      animationFrameRef.current = requestAnimationFrame(processVideoFrame);
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data for processing
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Process the frame with the model
      setIsProcessingFrame(true);
      try {
        const result = await modelRef.current.detectSign(imageData);
        setDetectedSign(result.sign);
        setConfidenceScore(Math.floor(result.confidence * 100));
      } catch (error) {
        console.error('Error detecting sign:', error);
      } finally {
        setIsProcessingFrame(false);
      }
    }
    
    // Continue processing frames
    animationFrameRef.current = requestAnimationFrame(processVideoFrame);
  };
  
  // Start the sign detection process
  const startSignDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(processVideoFrame);
  };

  const medicalPhrases = [
    "How are you feeling today?",
    "Where does it hurt?",
    "Can you describe the pain?",
    "When did the symptoms start?",
    "Do you have any allergies?",
    "Are you taking any medications?",
    "Please sit down",
    "Take a deep breath",
    "I need to examine you",
    "This might feel uncomfortable"
  ];

  const generateSignAnimation = (text: string) => {
    // Mock sign language animation generation
    const animation: SignAnimation = {
      id: Date.now().toString(),
      text: text,
      description: `Generating ${selectedLanguage.toUpperCase()} signs for: "${text}"`,
      duration: text.split(' ').length * 2 // 2 seconds per word
    };
    
    setCurrentAnimation(animation);
    return animation;
  };

  const handleTextToSign = () => {
    if (inputText.trim()) {
      generateSignAnimation(inputText.trim());
    }
  };

  const handleVoiceToSign = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Mock voice recognition
      setTimeout(() => {
        const mockRecognizedText = "I have been experiencing chest pain";
        setInputText(mockRecognizedText);
        generateSignAnimation(mockRecognizedText);
        setIsRecording(false);
      }, 3000);
    }
  };

  const playSignAnimation = () => {
    if (currentAnimation && !isPlaying) {
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, currentAnimation.duration * 1000);
    }
  };

  const pauseSignAnimation = () => {
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentAnimation(null);
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5 text-blue-600" />
            Sign Language Interpreter
          </CardTitle>
          <p className="text-muted-foreground">
            Convert text and speech to sign language animations for deaf and hard-of-hearing patients
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Sign Language:</span>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {signLanguages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="text-to-sign">Text to Sign</TabsTrigger>
              <TabsTrigger value="sign-to-text">Sign to Text (Camera)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text-to-sign" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm mb-2 block">Text Input</label>
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type the message you want to convert to sign language..."
                      className="min-h-32"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleTextToSign}
                      disabled={!inputText.trim()}
                      className="flex-1"
                    >
                      <Hand className="h-4 w-4 mr-2" />
                      Convert to Signs
                    </Button>
                    
                    <Button
                      variant={isRecording ? 'destructive' : 'outline'}
                      onClick={handleVoiceToSign}
                    >
                      {isRecording ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Voice
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isRecording && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-red-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">Recording... Speak clearly</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm mb-2 block">Common Medical Phrases</label>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {medicalPhrases.map((phrase, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="justify-start text-left h-auto p-2 text-sm"
                          onClick={() => {
                            setInputText(phrase);
                            generateSignAnimation(phrase);
                          }}
                        >
                          {phrase}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Sign Animation Display */}
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center min-h-64">
                    {currentAnimation ? (
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <ImageWithFallback
                            src="https://images.unsplash.com/photo-1733370446176-cf060c668a28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduJTIwbGFuZ3VhZ2UlMjBpbnRlcnByZXRlciUyMGhhbmRzfGVufDF8fHx8MTc1ODcwOTk4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                            alt="Sign language interpreter"
                            className="w-48 h-48 object-cover rounded-lg mx-auto"
                          />
                          {isPlaying && (
                            <div className="absolute inset-0 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center">
                              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Badge variant="outline" className="mb-2">
                            {selectedLanguage.toUpperCase()}
                          </Badge>
                          <p className="text-sm">{currentAnimation.description}</p>
                          {isPlaying && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                                style={{ 
                                  width: isPlaying ? '100%' : '0%',
                                  transition: `width ${currentAnimation.duration}s linear`
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Hand className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Sign animation will appear here</p>
                        <p className="text-sm">Enter text or use voice input to generate signs</p>
                      </div>
                    )}
                  </div>
                  
                  {currentAnimation && (
                    <div className="flex gap-2">
                      <Button
                        onClick={isPlaying ? pauseSignAnimation : playSignAnimation}
                        className="flex-1"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Play Signs
                          </>
                        )}
                      </Button>
                      
                      <Button variant="outline" onClick={resetAnimation}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sign-to-text" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Webcam Section */}
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center min-h-64 relative">
                    {isWebcamActive ? (
                      <>
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <canvas 
                          ref={canvasRef} 
                          className="absolute top-0 left-0 w-full h-full opacity-0"
                        />
                        {isProcessingFrame && (
                          <div className="absolute top-2 right-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Camera feed will appear here</p>
                        <p className="text-sm">Click "Start Camera" to begin sign detection</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={isWebcamActive ? stopWebcam : startWebcam}
                      variant={isWebcamActive ? "destructive" : "default"}
                      className="flex-1"
                    >
                      {isWebcamActive ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Stop Camera
                        </>
                      ) : (
                        <>
                          <Video className="h-4 w-4 mr-2" />
                          Start Camera
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="debug-mode" 
                      checked={showDebugInfo}
                      onCheckedChange={setShowDebugInfo}
                    />
                    <Label htmlFor="debug-mode">Show debug information</Label>
                  </div>
                </div>
                
                {/* Detection Results */}
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-64">
                    <h3 className="text-lg font-medium mb-4">Detected Signs</h3>
                    
                    {detectedSign ? (
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                              Detected
                            </Badge>
                            <span className="text-sm text-gray-500">Confidence: {confidenceScore}%</span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-lg font-medium">{signGestures[detectedSign as keyof typeof signGestures]}</p>
                            <p className="text-sm text-gray-600">Sign: {detectedSign.replace('_', ' ')}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p>Recent detections will appear here. The system is continuously analyzing your signs.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500">
                        <Hand className="h-12 w-12 mb-4 opacity-40" />
                        <p>No signs detected yet</p>
                        <p className="text-sm mt-2">Start the camera and perform sign language gestures</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Camera className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Real-time Sign Detection</p>
                        <p>This feature uses machine learning to recognize common medical sign language gestures. Position your hands clearly in the camera view for best results.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Camera className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Live Video Call Support</p>
                <p>For real-time sign language interpretation, connect with a certified interpreter via video call during your medical appointment.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}