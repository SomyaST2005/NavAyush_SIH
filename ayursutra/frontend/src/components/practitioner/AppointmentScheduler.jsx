import React, { useState, useEffect } from 'react';
import { Clock, User, Calendar, MapPin, Phone, Video, CheckCircle, AlertCircle, Edit } from 'lucide-react';

const AppointmentScheduler = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock today's appointments
  const mockTodayAppointments = [
    {
      id: 1,
      time: '09:00',
      duration: 60,
      patient: {
        name: 'Rajesh Kumar',
        phone: '+91-9876543210',
        age: 45
      },
      treatment: 'Abhyanga',
      status: 'completed',
      notes: 'Full body massage completed successfully',
      location: 'Room 101',
      isVirtual: false
    },
    {
      id: 2,
      time: '10:30',
      duration: 45,
      patient: {
        name: 'Priya Sharma',
        phone: '+91-9876543211',
        age: 38
      },
      treatment: 'Consultation',
      status: 'completed',
      notes: 'Progress review and treatment adjustment',
      location: 'Virtual',
      isVirtual: true
    },
    {
      id: 3,
      time: '11:30',
      duration: 90,
      patient: {
        name: 'Amit Patel',
        phone: '+91-9876543212',
        age: 52
      },
      treatment: 'Shirodhara',
      status: 'in-progress',
      notes: 'Stress relief session',
      location: 'Room 203',
      isVirtual: false
    },
    {
      id: 4,
      time: '14:00',
      duration: 60,
      patient: {
        name: 'Sunita Gupta',
        phone: '+91-9876543213',
        age: 42
      },
      treatment: 'Initial Consultation',
      status: 'upcoming',
      notes: 'New patient assessment',
      location: 'Room 101',
      isVirtual: false
    },
    {
      id: 5,
      time: '15:30',
      duration: 75,
      patient: {
        name: 'Vikram Singh',
        phone: '+91-9876543214',
        age: 48
      },
      treatment: 'Panchakarma Session',
      status: 'upcoming',
      notes: 'Day 5 of treatment plan',
      location: 'Room 102',
      isVirtual: false
    },
    {
      id: 6,
      time: '17:00',
      duration: 30,
      patient: {
        name: 'Meera Reddy',
        phone: '+91-9876543215',
        age: 35
      },
      treatment: 'Follow-up',
      status: 'upcoming',
      notes: 'Post-treatment assessment',
      location: 'Virtual',
      isVirtual: true
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setTodayAppointments(mockTodayAppointments);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTreatmentIcon = (treatment) => {
    const icons = {
      'Abhyanga': '🫴',
      'Shirodhara': '💧',
      'Swedana': '♨️',
      'Consultation': '🩺',
      'Initial Consultation': '📋',
      'Panchakarma Session': '🌿',
      'Follow-up': '📊'
    };
    return icons[treatment] || '🏥';
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const isCurrentAppointment = (appointment) => {
    const currentTime = getCurrentTime();
    const appointmentStart = appointment.time;
    const [startHour, startMinute] = appointmentStart.split(':').map(Number);
    const appointmentEnd = `${Math.floor((startHour * 60 + startMinute + appointment.duration) / 60).toString().padStart(2, '0')}:${((startHour * 60 + startMinute + appointment.duration) % 60).toString().padStart(2, '0')}`;
    
    return currentTime >= appointmentStart && currentTime <= appointmentEnd;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {todayAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments today</h3>
            <p className="text-gray-600">Enjoy your free day or schedule new appointments</p>
          </div>
        ) : (
          todayAppointments.map((appointment) => {
            const isCurrent = isCurrentAppointment(appointment);
            
            return (
              <div
                key={appointment.id}
                className={`rounded-lg border p-4 transition-all duration-200 ${
                  isCurrent 
                    ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-300' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-2xl">
                      {getTreatmentIcon(appointment.treatment)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {appointment.patient.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                          {appointment.status.replace('-', ' ')}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full animate-pulse">
                            Current
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(appointment.time)} ({appointment.duration} min)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {appointment.isVirtual ? (
                              <>
                                <Video className="h-4 w-4" />
                                <span>Virtual Session</span>
                              </>
                            ) : (
                              <>
                                <MapPin className="h-4 w-4" />
                                <span>{appointment.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Age: {appointment.patient.age}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{appointment.patient.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <h4 className="font-medium text-gray-800 mb-1">Treatment: {appointment.treatment}</h4>
                        <p className="text-sm text-gray-600">{appointment.notes}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {getStatusIcon(appointment.status)}
                    
                    {appointment.status === 'upcoming' && (
                      <div className="flex flex-col space-y-1">
                        {appointment.isVirtual ? (
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Video className="h-4 w-4" />
                          </button>
                        ) : (
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {appointment.status === 'in-progress' && (
                      <div className="flex flex-col space-y-1">
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {appointment.status === 'completed' && (
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Actions for Current/Upcoming Appointments */}
                {(appointment.status === 'upcoming' || appointment.status === 'in-progress') && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      {appointment.status === 'upcoming' && (
                        <>
                          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                            Start Session
                          </button>
                          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                            Call Patient
                          </button>
                        </>
                      )}
                      
                      {appointment.status === 'in-progress' && (
                        <>
                          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                            Complete Session
                          </button>
                          <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                            Add Notes
                          </button>
                        </>
                      )}
                      
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                        Reschedule
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Today's Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-gray-800 mb-2">Today's Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {todayAppointments.filter(apt => apt.status === 'completed').length}
            </p>
            <p className="text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {todayAppointments.filter(apt => apt.status === 'in-progress').length}
            </p>
            <p className="text-gray-600">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {todayAppointments.filter(apt => apt.status === 'upcoming').length}
            </p>
            <p className="text-gray-600">Upcoming</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
