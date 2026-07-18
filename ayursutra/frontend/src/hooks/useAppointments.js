import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { appointmentAPI } from '../services/api';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentAPI.getAll();
      setAppointments(response.data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  const bookAppointment = useCallback(async (appointmentData) => {
    try {
      const response = await appointmentAPI.create(appointmentData);
      setAppointments(prev => [...prev, response.data.appointment]);
      return response.data.appointment;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to book appointment');
    }
  }, []);

  const rescheduleAppointment = useCallback(async (appointmentId, newDateTime) => {
    try {
      await appointmentAPI.update(appointmentId, newDateTime);
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId
            ? { ...apt, ...newDateTime, status: 'pending' }
            : apt
        )
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to reschedule');
    }
  }, []);

  const cancelAppointment = useCallback(async (appointmentId) => {
    try {
      await appointmentAPI.cancel(appointmentId);
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        )
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to cancel');
    }
  }, []);

  const getUpcomingAppointments = useCallback((limit = 5) => {
    const now = new Date();
    return appointments
      .filter(apt => new Date(apt.scheduledDate) >= now && apt.status !== 'cancelled')
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
      .slice(0, limit);
  }, [appointments]);

  const getAppointmentsByDateRange = useCallback((startDate, endDate) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.scheduledDate);
      return aptDate >= startDate && aptDate <= endDate;
    });
  }, [appointments]);

  const getTodaysAppointments = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.scheduledDate === today && apt.status !== 'cancelled');
  }, [appointments]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, fetchAppointments]);

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
    refetch: fetchAppointments,
  };
};
