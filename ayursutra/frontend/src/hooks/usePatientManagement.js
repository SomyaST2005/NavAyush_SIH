import { useState, useEffect } from 'react';

export const usePatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock patients data
  const mockPatients = [
    {
      id: 'P001',
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@email.com',
      constitution: 'Vata-Pitta',
      lastVisit: '2025-01-15',
      status: 'Active',
      nextAppointment: '2025-01-22'
    },
    {
      id: 'P002',
      name: 'Priya Sharma',
      age: 32,
      gender: 'Female',
      phone: '+91 87654 32109',
      email: 'priya.sharma@email.com',
      constitution: 'Pitta-Kapha',
      lastVisit: '2025-01-18',
      status: 'Active',
      nextAppointment: '2025-01-25'
    },
    {
      id: 'P003',
      name: 'Amit Patel',
      age: 38,
      gender: 'Male',
      phone: '+91 76543 21098',
      email: 'amit.patel@email.com',
      constitution: 'Kapha-Vata',
      lastVisit: '2025-01-10',
      status: 'Completed',
      nextAppointment: null
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchPatients = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPatients(mockPatients);
        setError(null);
      } catch (err) {
        setError('Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const addPatient = (patientData) => {
    const newPatient = {
      id: `P${String(patients.length + 1).padStart(3, '0')}`,
      ...patientData,
      status: 'Active'
    };
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (patientId, updates) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, ...updates }
          : patient
      )
    );
  };

  const deletePatient = (patientId) => {
    setPatients(prev => prev.filter(patient => patient.id !== patientId));
  };

  const searchPatients = (query) => {
    if (!query) return patients;
    
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.email.toLowerCase().includes(query.toLowerCase()) ||
      patient.phone.includes(query) ||
      patient.id.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    patients,
    loading,
    error,
    addPatient,
    updatePatient,
    deletePatient,
    searchPatients
  };
};
