import { useState, useEffect, useCallback } from 'react';
import { patientAPI } from '../services/api';

export const usePatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientAPI.getAll();
      setPatients(response.data.patients || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  }, []);

  const addPatient = useCallback(async (patientData) => {
    try {
      const response = await patientAPI.create(patientData);
      setPatients(prev => [...prev, response.data.patient]);
      return response.data.patient;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add patient');
    }
  }, []);

  const updatePatient = useCallback(async (patientId, updates) => {
    try {
      await patientAPI.update(patientId, updates);
      setPatients(prev =>
        prev.map(p => (p.id === patientId ? { ...p, ...updates } : p))
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update patient');
    }
  }, []);

  const searchPatients = useCallback((query) => {
    if (!query) return patients;
    return patients.filter(p =>
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.email?.toLowerCase().includes(query.toLowerCase()) ||
      p.phone?.includes(query) ||
      p.id?.toLowerCase().includes(query.toLowerCase())
    );
  }, [patients]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    addPatient,
    updatePatient,
    searchPatients,
    refetch: fetchPatients,
  };
};
