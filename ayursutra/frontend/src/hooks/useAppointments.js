import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Mock data for development
  const mockAppointments = [
    {
      id: 1,
      scheduledDate: '2025-01-15',
      scheduledTime: '10:00:00',
      duration: 60,
      treatmentType: 'abhyanga',
      status: 'confirmed',
      practitioner: {
        id: 1,
        fullName: 'Priya Sharma'
      },
      location: 'Room 101',
      notes: 'Please arrive 15 minutes early for preparation',
      isVirtual: false,
      preparationInstructions: [
        'Avoid heavy meals 2 hours before treatment',
        'Wear comfortable, loose clothing',
        'Bring a change of clothes'
      ]
    },
    {
      id: 2,
      scheduledDate: '2025-01-17',
      scheduledTime: '14:30:00',
      duration: 90,
      treatmentType: 'shirodhara',
      status: 'confirmed',
      practitioner: {
        id: 2,
        fullName: 'Rajesh Kumar'
      },
      location: 'Room 203',
      notes: 'Stress relief session',
      isVirtual: false,
      preparationInstructions: [
        'Avoid caffeine 4 hours before treatment',
        'Come with clean, dry hair',
        'Remove all jewelry and accessories'
      ]
    },
    {
      id: 3,
      scheduledDate: '2025-01-20',
      scheduledTime: '09:00:00',
      duration: 45,
      treatmentType: 'consultation',
      status: 'pending',
      practitioner: {
        id: 1,
        fullName: 'Priya Sharma'
      },
      location: 'Virtual',
      notes: 'Progress review and treatment plan adjustment',
      isVirtual: true,
      preparationInstructions: [
        'Prepare list of any concerns or questions',
        'Have your treatment journal ready',
        'Ensure stable internet connection'
      ]
    }
  ];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In production, this would be an actual API call
      // const response = await api.get('/appointments');
      // setAppointments(response.data);
      
      // For now, use mock data
      setTimeout(() => {
        setAppointments(mockAppointments);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
      setLoading(false);
    }
  };

  const bookAppointment = async (appointmentData) => {
    try {
      setLoading(true);
      
      // In production:
      // const response = await api.post('/appointments', appointmentData);
      // const newAppointment = response.data;
      
      // Mock implementation
      const newAppointment = {
        id: Date.now(),
        ...appointmentData,
        status: 'pending',
        practitioner: {
          id: 1,
          fullName: 'Priya Sharma'
        }
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      setLoading(false);
      
      return newAppointment;
    } catch (err) {
      setError(err.message || 'Failed to book appointment');
      setLoading(false);
      throw err;
    }
  };

  const rescheduleAppointment = async (appointmentId, newDateTime) => {
    try {
      setLoading(true);
      
      // In production:
      // const response = await api.put(`/appointments/${appointmentId}/reschedule`, {
      //   scheduledDate: newDateTime.date,
      //   scheduledTime: newDateTime.time
      // });
      
      // Mock implementation
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { 
                ...apt, 
                scheduledDate: newDateTime?.date || apt.scheduledDate,
                scheduledTime: newDateTime?.time || apt.scheduledTime,
                status: 'pending'
              }
            : apt
        )
      );
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to reschedule appointment');
      setLoading(false);
      throw err;
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      
      // In production:
      // await api.put(`/appointments/${appointmentId}/cancel`);
      
      // Mock implementation
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'cancelled' }
            : apt
        )
      );
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment');
      setLoading(false);
      throw err;
    }
  };

  const getUpcomingAppointments = (limit = 5) => {
    const now = new Date();
    return appointments
      .filter(apt => new Date(apt.scheduledDate) >= now && apt.status !== 'cancelled')
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
      .slice(0, limit);
  };

  const getAppointmentsByDateRange = (startDate, endDate) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.scheduledDate);
      return aptDate >= startDate && aptDate <= endDate;
    });
  };

  const getTodaysAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => 
      apt.scheduledDate === today && apt.status !== 'cancelled'
    );
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  return {
    appointments,
    loading,
    error,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
    getUpcomingAppointments,
    getAppointmentsByDateRange,
    getTodaysAppointments,
    refetch: fetchAppointments
  };
};
