import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Video } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';

const UpcomingAppointments = () => {
  const { appointments, loading, error, rescheduleAppointment, cancelAppointment } = useAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTreatmentIcon = (treatmentType) => {
    switch (treatmentType) {
      case 'abhyanga':
        return '🫴';
      case 'shirodhara':
        return '💧';
      case 'swedana':
        return '♨️';
      case 'panchakarma':
        return '🌿';
      default:
        return '🏥';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-2">Error loading appointments</div>
        <p className="text-gray-600 text-sm">{error}</p>
      </div>
    );
  }

  const upcomingAppointments = appointments?.filter(apt => 
    new Date(apt.scheduledDate) >= new Date() && apt.status !== 'cancelled'
  ) || [];

  if (upcomingAppointments.length === 0) {
    return (
      <div className="p-6 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
        <p className="text-gray-600 mb-4">Schedule your next session to continue your treatment.</p>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
          Book Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {upcomingAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">
                  {getTreatmentIcon(appointment.treatmentType)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {appointment.treatmentType?.replace('_', ' ')}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
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
                      <span>Dr. {appointment.practitioner?.fullName}</span>
                    </div>
                    {appointment.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.location}</span>
                      </div>
                    )}
                  </div>

                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                {appointment.isVirtual && (
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                    <Video className="h-4 w-4" />
                    <span>Join Call</span>
                  </button>
                )}
                <button 
                  className="text-green-600 hover:text-green-700 text-sm"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  Reschedule
                </button>
                <button 
                  className="text-red-600 hover:text-red-700 text-sm"
                  onClick={() => cancelAppointment(appointment.id)}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Preparation Instructions */}
            {appointment.preparationInstructions && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Preparation Instructions:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {appointment.preparationInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-yellow-600">•</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show more button if there are many appointments */}
      {upcomingAppointments.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-green-600 hover:text-green-700 font-medium">
            View All Appointments
          </button>
        </div>
      )}

      {/* Reschedule Modal would go here */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
            <p className="text-gray-600 mb-4">
              Would you like to reschedule your {selectedAppointment.treatmentType} appointment?
            </p>
            <div className="flex space-x-3">
              <button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                onClick={() => {
                  rescheduleAppointment(selectedAppointment.id);
                  setSelectedAppointment(null);
                }}
              >
                Reschedule
              </button>
              <button 
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                onClick={() => setSelectedAppointment(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;
