import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, Download, Filter, Search, ChevronDown, Star } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';

const TreatmentHistory = () => {
  const { appointments, loading } = useAppointments();
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock historical data
  const mockHistoricalAppointments = [
    {
      id: 101,
      scheduledDate: '2025-01-10',
      scheduledTime: '10:00:00',
      duration: 60,
      treatmentType: 'abhyanga',
      status: 'completed',
      practitioner: { id: 1, fullName: 'Dr. Priya Sharma' },
      notes: 'Full body oil massage completed successfully',
      feedback: {
        rating: 5,
        comment: 'Excellent session, felt very relaxed',
        practitionerNotes: 'Patient responded well to treatment. Recommend continuing with warm sesame oil.'
      },
      treatmentDetails: {
        oilUsed: 'Sesame Oil with Ashwagandha',
        temperature: 'Warm',
        pressure: 'Medium',
        duration: '60 minutes'
      }
    },
    {
      id: 102,
      scheduledDate: '2025-01-08',
      scheduledTime: '14:30:00',
      duration: 45,
      treatmentType: 'swedana',
      status: 'completed',
      practitioner: { id: 2, fullName: 'Dr. Rajesh Kumar' },
      notes: 'Steam therapy session',
      feedback: {
        rating: 4,
        comment: 'Good session, helped with joint stiffness',
        practitionerNotes: 'Good sweating response. Patient tolerated heat well.'
      },
      treatmentDetails: {
        herbs: 'Eucalyptus, Neem',
        temperature: '45°C',
        duration: '45 minutes',
        humidity: '85%'
      }
    },
    {
      id: 103,
      scheduledDate: '2025-01-05',
      scheduledTime: '09:00:00',
      duration: 30,
      treatmentType: 'consultation',
      status: 'completed',
      practitioner: { id: 1, fullName: 'Dr. Priya Sharma' },
      notes: 'Initial consultation and treatment planning',
      feedback: {
        rating: 5,
        comment: 'Very thorough consultation, felt heard and understood',
        practitionerNotes: 'Comprehensive assessment completed. Vata-Pitta constitution confirmed.'
      },
      treatmentDetails: {
        assessment: 'Constitution Analysis',
        recommendations: 'Panchakarma treatment plan',
        duration: '30 minutes'
      }
    },
    {
      id: 104,
      scheduledDate: '2025-01-03',
      scheduledTime: '11:00:00',
      duration: 90,
      treatmentType: 'shirodhara',
      status: 'completed',
      practitioner: { id: 3, fullName: 'Dr. Meera Patel' },
      notes: 'Stress relief and mental clarity session',
      feedback: {
        rating: 5,
        comment: 'Incredibly relaxing, best sleep in months afterward',
        practitionerNotes: 'Excellent response to treatment. Stress levels visibly reduced.'
      },
      treatmentDetails: {
        oil: 'Brahmi Oil',
        temperature: 'Body temperature',
        duration: '90 minutes',
        flow: 'Continuous'
      }
    }
  ];

  useEffect(() => {
    // Combine current appointments with historical data
    const allAppointments = [...(appointments || []), ...mockHistoricalAppointments];
    
    // Filter completed appointments for history
    const completedAppointments = allAppointments.filter(apt => apt.status === 'completed');
    
    let filtered = completedAppointments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.treatmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.practitioner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply treatment type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(apt => apt.treatmentType === selectedFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, selectedFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTreatmentIcon = (treatmentType) => {
    const icons = {
      abhyanga: '🫴',
      shirodhara: '💧',
      swedana: '♨️',
      consultation: '🩺',
      nasya: '👃',
      basti: '💊'
    };
    return icons[treatmentType] || '🏥';
  };

  const getTreatmentName = (treatmentType) => {
    const names = {
      abhyanga: 'Abhyanga',
      shirodhara: 'Shirodhara',
      swedana: 'Swedana',
      consultation: 'Consultation',
      nasya: 'Nasya',
      basti: 'Basti'
    };
    return names[treatmentType] || treatmentType;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const exportHistory = () => {
    // Mock export functionality
    const csvContent = filteredAppointments.map(apt => 
      `${apt.scheduledDate},${getTreatmentName(apt.treatmentType)},${apt.practitioner.fullName},${apt.feedback?.rating || 'N/A'}`
    ).join('\n');
    
    const blob = new Blob([`Date,Treatment,Practitioner,Rating\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'treatment-history.csv';
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Treatment History</h1>
            <p className="text-gray-600 mt-1">Review your completed Panchakarma sessions</p>
          </div>
          <button
            onClick={exportHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search treatments, practitioners, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
                      {['all', 'abhyanga', 'shirodhara', 'swedana', 'consultation', 'nasya', 'basti'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setSelectedFilter(filter);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedFilter === filter
                              ? 'bg-blue-100 text-blue-700'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {filter === 'all' ? 'All Treatments' : getTreatmentName(filter)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredAppointments.length} sessions
              </div>
            </div>
          </div>
        </div>

        {/* Treatment History List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No treatment history found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Your completed treatments will appear here'
                }
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">
                      {getTreatmentIcon(appointment.treatmentType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {getTreatmentName(appointment.treatmentType)}
                        </h3>
                        {appointment.feedback?.rating && (
                          <div className="flex items-center space-x-1">
                            {renderStars(appointment.feedback.rating)}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(appointment.scheduledDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(appointment.scheduledTime)} ({appointment.duration} min)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{appointment.practitioner.fullName}</span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <p className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                          {appointment.notes}
                        </p>
                      )}

                      {appointment.feedback?.comment && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-sm text-blue-800">
                            <strong>Your feedback:</strong> "{appointment.feedback.comment}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Completed
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Treatment Details Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {getTreatmentName(selectedAppointment.treatmentType)} Session
                  </h2>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Session Overview */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Session Overview</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedAppointment.scheduledDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <span className="ml-2 font-medium">{formatTime(selectedAppointment.scheduledTime)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{selectedAppointment.duration} minutes</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Practitioner:</span>
                      <span className="ml-2 font-medium">{selectedAppointment.practitioner.fullName}</span>
                    </div>
                  </div>
                </div>

                {/* Treatment Details */}
                {selectedAppointment.treatmentDetails && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Treatment Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {Object.entries(selectedAppointment.treatmentDetails).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 text-sm">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {selectedAppointment.feedback && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Session Feedback</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Your Rating:</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(selectedAppointment.feedback.rating)}
                        </div>
                      </div>
                      
                      {selectedAppointment.feedback.comment && (
                        <div>
                          <span className="text-sm text-gray-600">Your Comment:</span>
                          <p className="mt-1 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                            "{selectedAppointment.feedback.comment}"
                          </p>
                        </div>
                      )}
                      
                      {selectedAppointment.feedback.practitionerNotes && (
                        <div>
                          <span className="text-sm text-gray-600">Practitioner Notes:</span>
                          <p className="mt-1 p-3 bg-green-50 rounded-lg text-sm text-green-800">
                            {selectedAppointment.feedback.practitionerNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Book Similar Session
                  </button>
                  <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                    Download Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentHistory;
