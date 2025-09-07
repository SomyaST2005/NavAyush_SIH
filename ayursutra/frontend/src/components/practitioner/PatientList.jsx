import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, Phone, Mail, Calendar, Clock, ChevronDown, User, Activity } from 'lucide-react';
import { usePatientManagement } from '../../hooks/usePatientManagement';

const PatientList = ({ isCompact = false }) => {
  const { patients, loading, error, addPatient, updatePatient } = usePatientManagement();
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock patient data
  const mockPatients = [
    {
      id: 1,
      fullName: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91-9876543210',
      age: 45,
      constitution: 'Vata-Pitta',
      currentTreatment: 'Panchakarma',
      status: 'active',
      lastVisit: '2024-01-14',
      nextAppointment: '2024-01-16',
      treatmentProgress: 65,
      totalSessions: 21,
      completedSessions: 14,
      primaryConcerns: ['Stress', 'Digestive Issues'],
      joinDate: '2024-01-01'
    },
    {
      id: 2,
      fullName: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91-9876543211',
      age: 38,
      constitution: 'Pitta-Kapha',
      currentTreatment: 'Abhyanga',
      status: 'active',
      lastVisit: '2024-01-13',
      nextAppointment: '2024-01-17',
      treatmentProgress: 80,
      totalSessions: 15,
      completedSessions: 12,
      primaryConcerns: ['Joint Pain', 'Insomnia'],
      joinDate: '2023-12-15'
    },
    {
      id: 3,
      fullName: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91-9876543212',
      age: 52,
      constitution: 'Kapha-Vata',
      currentTreatment: 'Shirodhara',
      status: 'completed',
      lastVisit: '2024-01-10',
      nextAppointment: null,
      treatmentProgress: 100,
      totalSessions: 10,
      completedSessions: 10,
      primaryConcerns: ['Anxiety', 'Hypertension'],
      joinDate: '2023-11-20'
    },
    {
      id: 4,
      fullName: 'Sunita Gupta',
      email: 'sunita.gupta@email.com',
      phone: '+91-9876543213',
      age: 42,
      constitution: 'Vata-Kapha',
      currentTreatment: 'Consultation',
      status: 'new',
      lastVisit: null,
      nextAppointment: '2024-01-18',
      treatmentProgress: 0,
      totalSessions: 0,
      completedSessions: 0,
      primaryConcerns: ['Fatigue', 'Weight Management'],
      joinDate: '2024-01-15'
    }
  ];

  useEffect(() => {
    let filtered = mockPatients;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.currentTreatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.primaryConcerns.some(concern => 
          concern.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status === selectedFilter);
    }

    // Sort by last visit date (most recent first)
    filtered.sort((a, b) => {
      if (!a.lastVisit && !b.lastVisit) return 0;
      if (!a.lastVisit) return 1;
      if (!b.lastVisit) return -1;
      return new Date(b.lastVisit) - new Date(a.lastVisit);
    });

    setFilteredPatients(isCompact ? filtered.slice(0, 5) : filtered);
  }, [searchTerm, selectedFilter, isCompact]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'new':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {!isCompact && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="p-2">
                      {['all', 'active', 'new', 'completed', 'inactive'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setSelectedFilter(filter);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors capitalize ${
                            selectedFilter === filter
                              ? 'bg-blue-100 text-blue-700'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {filter === 'all' ? 'All Patients' : filter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Patient</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Patient List */}
      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Add your first patient to get started'
              }
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {patient.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{patient.fullName}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>Age:</strong> {patient.age} years</p>
                        <p><strong>Constitution:</strong> {patient.constitution}</p>
                      </div>
                      <div>
                        <p><strong>Treatment:</strong> {patient.currentTreatment}</p>
                        <p><strong>Last Visit:</strong> {formatDate(patient.lastVisit)}</p>
                      </div>
                      <div>
                        <p><strong>Next Appointment:</strong> {formatDate(patient.nextAppointment)}</p>
                        <p><strong>Sessions:</strong> {patient.completedSessions}/{patient.totalSessions}</p>
                      </div>
                    </div>

                    {patient.status === 'active' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Treatment Progress</span>
                          <span className="font-medium">{patient.treatmentProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(patient.treatmentProgress)}`}
                            style={{ width: `${patient.treatmentProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {patient.primaryConcerns.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {patient.primaryConcerns.map((concern, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                            >
                              {concern}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    <Calendar className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isCompact && filteredPatients.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All Patients ({mockPatients.length})
          </button>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">{selectedPatient.fullName}</h2>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Patient Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Contact Information</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Email:</strong> {selectedPatient.email}</p>
                    <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                    <p><strong>Age:</strong> {selectedPatient.age} years</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Treatment Information</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Constitution:</strong> {selectedPatient.constitution}</p>
                    <p><strong>Current Treatment:</strong> {selectedPatient.currentTreatment}</p>
                    <p><strong>Status:</strong> <span className="capitalize">{selectedPatient.status}</span></p>
                  </div>
                </div>
              </div>

              {/* Treatment Progress */}
              {selectedPatient.status === 'active' && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Treatment Progress</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress: {selectedPatient.treatmentProgress}%</span>
                      <span>Sessions: {selectedPatient.completedSessions}/{selectedPatient.totalSessions}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(selectedPatient.treatmentProgress)}`}
                        style={{ width: `${selectedPatient.treatmentProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Concerns */}
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Primary Concerns</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.primaryConcerns.map((concern, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Schedule Appointment
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Update Treatment Plan
                </button>
                <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                  View Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
