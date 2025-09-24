import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, MapPin, Phone, Calendar, Clock, Search, Stethoscope } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  phone: string;
  availability: string;
  languages: string[];
  education: string;
  experience: number;
  image?: string;
}

export function DoctorRecommendations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const specialties = [
    'Cardiology', 'Neurology', 'Pulmonology', 'Gastroenterology', 
    'Orthopedics', 'Dermatology', 'Ophthalmology', 'Psychiatry',
    'Pediatrics', 'Emergency Medicine', 'Internal Medicine', 'Family Medicine'
  ];

  const locations = [
    'Downtown Medical Center', 'Westside Hospital', 'North Valley Clinic',
    'Southside Medical Plaza', 'East End Healthcare', 'Central Hospital'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'Chinese', 'Arabic', 'Hindi', 'Portuguese', 'Russian'
  ];

  const mockDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Maria Rodriguez',
      specialty: 'Cardiology',
      rating: 4.8,
      reviews: 124,
      location: 'Downtown Medical Center',
      distance: '2.3 km',
      phone: '+1 (555) 123-4567',
      availability: 'Available today',
      languages: ['English', 'Spanish'],
      education: 'Harvard Medical School',
      experience: 15,
      image: 'https://images.unsplash.com/photo-1758691462858-f1286e5daf40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMGRvY3RvciUyMHBhdGllbnR8ZW58MXx8fHwxNzU4NzA5OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '2',
      name: 'Dr. Ahmed Hassan',
      specialty: 'Neurology',
      rating: 4.9,
      reviews: 89,
      location: 'Westside Hospital',
      distance: '4.1 km',
      phone: '+1 (555) 234-5678',
      availability: 'Next available: Tomorrow 2 PM',
      languages: ['English', 'Arabic'],
      education: 'Johns Hopkins University',
      experience: 12,
    },
    {
      id: '3',
      name: 'Dr. Li Wei Chen',
      specialty: 'Internal Medicine',
      rating: 4.7,
      reviews: 156,
      location: 'North Valley Clinic',
      distance: '3.8 km',
      phone: '+1 (555) 345-6789',
      availability: 'Available today',
      languages: ['English', 'Chinese'],
      education: 'Stanford University',
      experience: 18,
    },
    {
      id: '4',
      name: 'Dr. Sarah Johnson',
      specialty: 'Emergency Medicine',
      rating: 4.6,
      reviews: 203,
      location: 'Central Hospital',
      distance: '1.9 km',
      phone: '+1 (555) 456-7890',
      availability: 'Available now',
      languages: ['English', 'French'],
      education: 'Yale Medical School',
      experience: 10,
    },
    {
      id: '5',
      name: 'Dr. Priya Patel',
      specialty: 'Pediatrics',
      rating: 4.9,
      reviews: 98,
      location: 'Southside Medical Plaza',
      distance: '5.2 km',
      phone: '+1 (555) 567-8901',
      availability: 'Next available: Today 4 PM',
      languages: ['English', 'Hindi'],
      education: 'UCLA Medical School',
      experience: 8,
    }
  ];

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    const matchesLocation = !selectedLocation || selectedLocation === 'all' || doctor.location === selectedLocation;
    const matchesLanguage = !selectedLanguage || selectedLanguage === 'all' || doctor.languages.includes(selectedLanguage);
    
    return matchesSearch && matchesSpecialty && matchesLocation && matchesLanguage;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Find Specialist Doctors
          </CardTitle>
          <p className="text-muted-foreground">
            Search for qualified healthcare providers based on your needs and preferred language
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Doctor name or specialty"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Specialty</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="All languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All languages</SelectItem>
                  {languages.map(language => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found {filteredDoctors.length} doctors matching your criteria
            </p>
            <Button variant="outline" size="sm">
              Sort by rating
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      {doctor.image ? (
                        <ImageWithFallback
                          src={doctor.image}
                          alt={doctor.name}
                          className="h-16 w-16 object-cover"
                        />
                      ) : (
                        <AvatarFallback>
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-medium">{doctor.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {doctor.specialty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {renderStars(doctor.rating)}
                        </div>
                        <span className="text-sm">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({doctor.reviews} reviews)
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{doctor.location} • {doctor.distance}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className={doctor.availability.includes('Available') ? 'text-green-600' : ''}>
                            {doctor.availability}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{doctor.phone}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {doctor.languages.map((language) => (
                            <Badge key={language} variant="outline" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {doctor.education} • {doctor.experience} years experience
                        </p>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg mb-2">No doctors found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria to find more doctors
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}