import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Calendar, User, Phone, Mail, MapPin, Edit, Eye, Plus, Download } from 'lucide-react';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConstitution, setFilterConstitution] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock patient records data
  const mockPatients = [
    {
      id: 'P001',
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@email.com',
      address: '123 MG Road, Bangalore, Karnataka',
      constitution: 'Vata-Pitta',
      registrationDate: '2023-08-15',
      lastVisit: '2024-01-15',
      totalSessions: 24,
      currentCondition: 'Chronic joint pain, insomnia',
      medicalHistory: [
        { date: '2023-08-15', condition: 'Arthritis', severity: 'Moderate' },
        { date: '2023-09-20', condition: 'Insomnia', severity: 'Mild' },
        { date: '2023-11-10', condition: 'Digestive issues', severity: 'Mild' }
      ],
      treatmentHistory: [
        {
          id: 1,
          type: 'Panchakarma',
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          status: 'Active',
          sessions: 21,
          progress: 60,
          notes: 'Patient responding well to treatment. Vata dosha imbalance being addressed.'
        },
        {
          id: 2,
          type: 'Abhyanga',
          startDate: '2023-11-01',
          endDate: '2023-11-30',
          status: 'Completed',
          sessions: 15,
          progress: 100,
          notes: 'Full course completed. Significant improvement in joint mobility.'
        }
      ],
      vitals: {
        height: '175 cm',
        weight: '72 kg',
        bloodPressure: '130/85',
        pulse: '78 bpm',
        temperature: '98.6°F',
        lastUpdated: '2024-01-15'
      },
      allergies: ['Peanuts', 'Shellfish'],
      medications: [
        { name: 'Ashwagandha', dosage: '500mg', frequency: 'Twice daily', prescribed: '2024-01-15' },
        { name: 'Triphala', dosage: '1 tsp', frequency: 'Before bed', prescribed: '2024-01-10' }
      ],
      notes: 'Patient is very cooperative and follows treatment protocols well. Regular follow-ups recommended.'
    },
    {
      id: 'P002',
      name: 'Priya Sharma',
      age: 32,
      gender: 'Female',
      phone: '+91 87654 32109',
      email: 'priya.sharma@email.com',
      address: '456 Brigade Road, Bangalore, Karnataka',
      constitution: 'Pitta-Kapha',
      registrationDate: '2023-10-20',
      lastVisit: '2024-01-18',
      totalSessions: 18,
      currentCondition: 'Stress, anxiety, muscle tension',
      medicalHistory: [
        { date: '2023-10-20', condition: 'Chronic stress', severity: 'Moderate' },
        { date: '2023-12-05', condition: 'Muscle tension', severity: 'Mild' }
      ],
      treatmentHistory: [
        {
          id: 1,
          type: 'Abhyanga Therapy',
          startDate: '2024-01-10',
          endDate: '2024-01-31',
          status: 'Active',
          sessions: 12,
          progress: 75,
          notes: 'Excellent progress in stress management. Patient reports better sleep.'
        }
      ],
      vitals: {
        height: '162 cm',
        weight: '58 kg',
        bloodPressure: '120/80',
        pulse: '72 bpm',
        temperature: '98.4°F',
        lastUpdated: '2024-01-18'
      },
      allergies: ['Dairy'],
      medications: [
        { name: 'Brahmi', dosage: '300mg', frequency: 'Once daily', prescribed: '2024-01-10' }
      ],
      notes: 'Young professional dealing with work stress. Responds well to relaxation therapies.'
    },
    {
      id: 'P003',
      name: 'Amit Patel',
      age: 38,
      gender: 'Male',
      phone: '+91 76543 21098',
      email: 'amit.patel@email.com',
      address: '789 Koramangala, Bangalore, Karnataka',
      constitution: 'Vata',
      registrationDate: '2024-01-05',
      lastVisit: '2024-01-20',
      totalSessions: 3,
      currentCondition: 'Chronic headaches, mental fatigue',
      medicalHistory: [
        { date: '2024-01-05', condition: 'Migraine', severity: 'Severe' },
        { date: '2024-01-05', condition: 'Mental fatigue', severity: 'Moderate' }
      ],
      treatmentHistory: [
        {
          id: 1,
          type: 'Shirodhara',
          startDate: '2024-01-20',
          endDate: '2024-02-10',
          status: 'Planned',
          sessions: 8,
          progress: 0,
          notes: 'New patient with chronic headaches and mental fatigue. Treatment plan being developed.'
        }
      ],
      vitals: {
        height: '178 cm',
        weight: '75 kg',
        bloodPressure: '125/82',
        pulse: '80 bpm',
        temperature: '98.7°F',
        lastUpdated: '2024-01-20'
      },
      allergies: ['None reported'],
      medications: [],
      notes: 'New patient. Detailed assessment completed. Starting with Shirodhara therapy.'
    }
  ];

  useEffect(() => {
    setPatients(mockPatients);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterConstitution === 'all' || patient.constitution.includes(filterConstitution);
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'severe': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'mild': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Patient Records</h2>
          <p className="text-gray-600">Comprehensive patient information and medical history</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Patient</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterConstitution}
          onChange={(e) => setFilterConstitution(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Constitutions</option>
          <option value="Vata">Vata</option>
          <option value="Pitta">Pitta</option>
          <option value="Kapha">Kapha</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Patients ({filteredPatients.length})</h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{patient.name}</h4>
                    <span className="text-xs text-gray-500">{patient.id}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>{patient.age}y, {patient.gender}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>Last visit: {patient.lastVisit}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      {patient.constitution}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Patient Info Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{selectedPatient.name}</h3>
                    <p className="text-gray-600">Patient ID: {selectedPatient.id}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg">
                      <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{selectedPatient.age} years, {selectedPatient.gender}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <p className="font-medium">{selectedPatient.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-600">Constitution:</span>
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {selectedPatient.constitution}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Registration:</span>
                      <span className="ml-2 font-medium">{selectedPatient.registrationDate}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Total Sessions:</span>
                      <span className="ml-2 font-medium">{selectedPatient.totalSessions}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Current Condition:</span>
                      <p className="font-medium mt-1">{selectedPatient.currentCondition}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vitals */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Latest Vitals</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Height</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedPatient.vitals.height}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedPatient.vitals.weight}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">BP</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedPatient.vitals.bloodPressure}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pulse</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedPatient.vitals.pulse}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedPatient.vitals.temperature}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPatient.vitals.lastUpdated}</p>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Medical History</h4>
                <div className="space-y-3">
                  {selectedPatient.medicalHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{record.condition}</p>
                        <p className="text-sm text-gray-600">{record.date}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(record.severity)}`}>
                        {record.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment History */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Treatment History</h4>
                <div className="space-y-4">
                  {selectedPatient.treatmentHistory.map((treatment) => (
                    <div key={treatment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800">{treatment.type}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(treatment.status)}`}>
                          {treatment.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-600">Start:</span>
                          <p className="font-medium">{treatment.startDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">End:</span>
                          <p className="font-medium">{treatment.endDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Sessions:</span>
                          <p className="font-medium">{treatment.sessions}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Progress:</span>
                          <p className="font-medium">{treatment.progress}%</p>
                        </div>
                      </div>
                      {treatment.notes && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">{treatment.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies & Medications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Allergies</h4>
                  <div className="space-y-2">
                    {selectedPatient.allergies.map((allergy, index) => (
                      <span key={index} className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full mr-2 mb-2">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Current Medications</h4>
                  <div className="space-y-3">
                    {selectedPatient.medications.map((med, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-800">{med.name}</p>
                        <p className="text-sm text-green-700">{med.dosage} - {med.frequency}</p>
                        <p className="text-xs text-green-600">Prescribed: {med.prescribed}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedPatient.notes && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Clinical Notes</h4>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-800">{selectedPatient.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Select a Patient</h3>
              <p className="text-gray-600">Choose a patient from the list to view their detailed records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
