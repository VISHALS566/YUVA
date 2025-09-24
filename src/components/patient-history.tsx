import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar, FileText, Pill, TestTube, UserCheck, Plus, Download, Filter } from 'lucide-react';

interface PatientRecord {
  id: string;
  patientName: string;
  patientId: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  languages: string[];
  lastVisit: string;
}

interface MedicalVisit {
  id: string;
  date: string;
  doctor: string;
  specialty: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  status: 'completed' | 'ongoing' | 'followup';
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  date: string;
  status: 'active' | 'completed' | 'discontinued';
}

interface LabResult {
  id: string;
  test: string;
  result: string;
  normalRange: string;
  date: string;
  orderedBy: string;
  status: 'normal' | 'abnormal' | 'pending';
}

export function PatientHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  // Mock patient data
  const patients: PatientRecord[] = [
    {
      id: '1',
      patientName: 'Maria Gonzalez',
      patientId: 'P001234',
      dateOfBirth: '1985-03-15',
      gender: 'Female',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Shellfish'],
      languages: ['Spanish', 'English'],
      lastVisit: '2024-09-20'
    },
    {
      id: '2',
      patientName: 'Ahmed Hassan',
      patientId: 'P001235',
      dateOfBirth: '1972-11-08',
      gender: 'Male',
      bloodType: 'A+',
      allergies: ['None known'],
      languages: ['Arabic', 'English'],
      lastVisit: '2024-09-18'
    },
    {
      id: '3',
      patientName: 'Li Wei Chen',
      patientId: 'P001236',
      dateOfBirth: '1990-07-22',
      gender: 'Male',
      bloodType: 'B+',
      allergies: ['Latex'],
      languages: ['Chinese', 'English'],
      lastVisit: '2024-09-22'
    }
  ];

  const medicalVisits: MedicalVisit[] = [
    {
      id: '1',
      date: '2024-09-20',
      doctor: 'Dr. Maria Rodriguez',
      specialty: 'Cardiology',
      diagnosis: 'Hypertension',
      symptoms: ['Chest pain', 'Shortness of breath'],
      treatment: 'Prescribed ACE inhibitors, lifestyle modifications',
      status: 'ongoing'
    },
    {
      id: '2',
      date: '2024-08-15',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Family Medicine',
      diagnosis: 'Upper respiratory infection',
      symptoms: ['Cough', 'Fever', 'Sore throat'],
      treatment: 'Antibiotics, rest, fluids',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-07-10',
      doctor: 'Dr. Ahmed Hassan',
      specialty: 'Neurology',
      diagnosis: 'Migraine',
      symptoms: ['Severe headache', 'Nausea', 'Light sensitivity'],
      treatment: 'Sumatriptan, preventive therapy',
      status: 'followup'
    }
  ];

  const prescriptions: Prescription[] = [
    {
      id: '1',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: 'Ongoing',
      prescribedBy: 'Dr. Maria Rodriguez',
      date: '2024-09-20',
      status: 'active'
    },
    {
      id: '2',
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      duration: '7 days',
      prescribedBy: 'Dr. Sarah Johnson',
      date: '2024-08-15',
      status: 'completed'
    }
  ];

  const labResults: LabResult[] = [
    {
      id: '1',
      test: 'Complete Blood Count',
      result: 'Normal',
      normalRange: 'Within normal limits',
      date: '2024-09-18',
      orderedBy: 'Dr. Maria Rodriguez',
      status: 'normal'
    },
    {
      id: '2',
      test: 'Blood Pressure',
      result: '145/92 mmHg',
      normalRange: '<120/80 mmHg',
      date: '2024-09-20',
      orderedBy: 'Dr. Maria Rodriguez',
      status: 'abnormal'
    },
    {
      id: '3',
      test: 'Cholesterol Panel',
      result: 'Pending',
      normalRange: '<200 mg/dL',
      date: '2024-09-22',
      orderedBy: 'Dr. Maria Rodriguez',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'ongoing':
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'followup':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'abnormal':
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Patient Medical History
          </CardTitle>
          <p className="text-muted-foreground">
            Secure patient records and medical history management
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by patient name or ID..."
                className="max-w-md"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient List */}
            <div className="space-y-4">
              <h3>Patients</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <Card
                    key={patient.id}
                    className={`cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {patient.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{patient.patientName}</p>
                          <p className="text-sm text-muted-foreground">{patient.patientId}</p>
                          <p className="text-xs text-muted-foreground">
                            Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Patient Details */}
            <div className="lg:col-span-2">
              {selectedPatient ? (
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="visits">Visits</TabsTrigger>
                    <TabsTrigger value="prescriptions">Medications</TabsTrigger>
                    <TabsTrigger value="labs">Lab Results</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{selectedPatient.patientName}</span>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Record
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-muted-foreground">Patient ID</label>
                            <p>{selectedPatient.patientId}</p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Date of Birth</label>
                            <p>{new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Gender</label>
                            <p>{selectedPatient.gender}</p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Blood Type</label>
                            <p>{selectedPatient.bloodType}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm text-muted-foreground">Languages</label>
                          <div className="flex gap-2 mt-1">
                            {selectedPatient.languages.map((language) => (
                              <Badge key={language} variant="outline">{language}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm text-muted-foreground">Allergies</label>
                          <div className="flex gap-2 mt-1">
                            {selectedPatient.allergies.map((allergy) => (
                              <Badge key={allergy} variant="destructive">{allergy}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="visits">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Medical Visits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {medicalVisits.map((visit) => (
                            <Card key={visit.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4>{visit.diagnosis}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {visit.doctor} • {visit.specialty}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <Badge className={getStatusColor(visit.status)}>
                                      {visit.status}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(visit.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Symptoms: </span>
                                    {visit.symptoms.join(', ')}
                                  </div>
                                  <div>
                                    <span className="font-medium">Treatment: </span>
                                    {visit.treatment}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="prescriptions">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Pill className="h-5 w-5" />
                          Prescriptions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Medication</TableHead>
                              <TableHead>Dosage</TableHead>
                              <TableHead>Frequency</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {prescriptions.map((prescription) => (
                              <TableRow key={prescription.id}>
                                <TableCell>
                                  <div>
                                    <p>{prescription.medication}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Prescribed by {prescription.prescribedBy}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{prescription.dosage}</TableCell>
                                <TableCell>{prescription.frequency}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(prescription.status)}>
                                    {prescription.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {new Date(prescription.date).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="labs">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TestTube className="h-5 w-5" />
                          Laboratory Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Test</TableHead>
                              <TableHead>Result</TableHead>
                              <TableHead>Normal Range</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {labResults.map((result) => (
                              <TableRow key={result.id}>
                                <TableCell>
                                  <div>
                                    <p>{result.test}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Ordered by {result.orderedBy}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{result.result}</TableCell>
                                <TableCell>{result.normalRange}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(result.status)}>
                                    {result.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {new Date(result.date).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <UserCheck className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select a patient to view their medical history</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}