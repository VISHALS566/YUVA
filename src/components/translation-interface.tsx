import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Mic, MicOff, Volume2, Send, Languages } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  text: string;
  translation: string;
  sender: 'patient' | 'doctor';
  timestamp: Date;
  language: string;
}

export function TranslationInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello, I have been experiencing chest pain for the past two days.',
      translation: 'Hola, he estado experimentando dolor en el pecho durante los últimos dos días.',
      sender: 'patient',
      timestamp: new Date(Date.now() - 300000),
      language: 'en-es'
    },
    {
      id: '2',
      text: 'Can you describe the pain? Is it sharp or dull?',
      translation: '¿Puedes describir el dolor? ¿Es agudo o sordo?',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 240000),
      language: 'en-es'
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [userRole, setUserRole] = useState<'patient' | 'doctor'>('patient');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' }
  ];

  const medicalTranslations = {
    'en-es': {
      'chest pain': 'dolor en el pecho',
      'headache': 'dolor de cabeza',
      'fever': 'fiebre',
      'nausea': 'náuseas',
      'dizzy': 'mareo',
      'sharp pain': 'dolor agudo',
      'dull pain': 'dolor sordo'
    }
  };

  const translateText = (text: string): string => {
    // Mock translation - in a real app, this would use a translation API
    const langPair = `${sourceLanguage}-${targetLanguage}`;
    let translated = text;
    
    // Simple medical term translation
    if (medicalTranslations[langPair as keyof typeof medicalTranslations]) {
      const translations = medicalTranslations[langPair as keyof typeof medicalTranslations];
      Object.entries(translations).forEach(([english, translated_term]) => {
        translated = translated.replace(new RegExp(english, 'gi'), translated_term);
      });
    }
    
    return translated;
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      translation: translateText(currentMessage),
      sender: userRole,
      timestamp: new Date(),
      language: `${sourceLanguage}-${targetLanguage}`
    };

    setMessages([...messages, newMessage]);
    setCurrentMessage('');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Mock voice recording - in a real app, this would use Web Speech API
    if (!isRecording) {
      setTimeout(() => {
        setCurrentMessage('I have been feeling tired and have a headache.');
        setIsRecording(false);
      }, 2000);
    }
  };

  const speakText = (text: string) => {
    // Mock text-to-speech - in a real app, this would use Web Speech API
    console.log('Speaking:', text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-blue-600" />
            Real-Time Medical Translation
          </CardTitle>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span>I am:</span>
              <Select value={userRole} onValueChange={(value: 'patient' | 'doctor') => setUserRole(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span>From:</span>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span>To:</span>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-96 w-full border rounded-lg p-4 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col space-y-2 ${
                    message.sender === userRole ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={message.sender === 'doctor' ? 'default' : 'secondary'}>
                      {message.sender === 'doctor' ? 'Doctor' : 'Patient'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg space-y-2 ${
                      message.sender === userRole
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted'
                    }`}
                  >
                    <p>{message.text}</p>
                    <div className="border-t border-opacity-20 pt-2">
                      <p className="text-sm opacity-90 italic">{message.translation}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => speakText(message.translation)}
                      className="h-6 w-6 p-0 hover:bg-black/20"
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message or use voice input..."
              />
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                size="icon"
                onClick={toggleRecording}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {isRecording && (
            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Recording... Speak clearly about your symptoms
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}