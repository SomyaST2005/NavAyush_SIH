# Practitioner Dashboard Implementation Guide

## Overview

The Practitioner Dashboard is the primary interface for Ayurvedic doctors and therapists to manage their patients, appointments, treatment plans, and gain AI-powered insights for better patient care.

## UI Components Structure

```
PractitionerDashboard/
├── components/
│   ├── PatientList.jsx
│   ├── AppointmentScheduler.jsx
│   ├── TreatmentPlanner.jsx
│   ├── PatientRecords.jsx
│   ├── AnalyticsDashboard.jsx
│   ├── AIInsights.jsx
│   └── CalendarView.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── PatientDetails.jsx
│   ├── TreatmentPlans.jsx
│   └── Analytics.jsx
└── hooks/
    ├── usePractitionerData.js
    ├── usePatientManagement.js
    └── useAIInsights.js
```

## Core Components Implementation

### 1. Main Practitioner Dashboard

```jsx
// components/practitioner/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import PatientList from './PatientList';
import CalendarView from './CalendarView';
import AnalyticsDashboard from './AnalyticsDashboard';
import AIInsights from './AIInsights';
import { usePractitionerData } from '../../hooks/usePractitionerData';

const Dashboard = () => {
  const { practitionerData, patients, appointments, loading } = usePractitionerData();
  const [activeView, setActiveView] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Doctor Practitioner</h1>
            <p className="text-gray-600 mt-1">Manage your Panchakarma practice</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <input 
                type="search" 
                placeholder="Search patients..."
                className="border-none outline-none text-sm"
              />
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">👨‍⚕️</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Patient List */}
          <div className="lg:col-span-1">
            <PatientList patients={patients} loading={loading} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <CalendarView appointments={appointments} />
            <AnalyticsDashboard />
          </div>

          {/* Right Sidebar - AI Insights */}
          <div className="lg:col-span-1">
            <AIInsights />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

### 2. Patient List Component

```jsx
// components/practitioner/PatientList.jsx
import React, { useState } from 'react';
import { usePatientManagement } from '../../hooks/usePatientManagement';

const PatientList = ({ patients, loading }) => {
  const { selectPatient, selectedPatient } = usePatientManagement();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients?.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Patients</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Add New
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Patient List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => selectPatient(patient)}
            className={`
              p-3 rounded-lg cursor-pointer transition-all duration-200 border
              ${selectedPatient?.id === patient.id 
                ? 'bg-blue-50 border-blue-200' 
                : 'hover:bg-gray-50 border-transparent'
              }
            `}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 text-sm">
                  {patient.full_name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {patient.age} years • {patient.gender}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Last visit: {new Date(patient.last_visit).toLocaleDateString()}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {patient.constitution_type}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No patients found</p>
        </div>
      )}
    </div>
  );
};

export default PatientList;
```

### 3. Calendar View Component

```jsx
// components/practitioner/CalendarView.jsx
import React, { useState } from 'react';

const CalendarView = ({ appointments }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day'); // day, week, month

  // Mock appointments for today
  const todayAppointments = [
    { id: 1, patient: 'Theresa Willis', time: '09:00', treatment: 'Abhyanga', status: 'confirmed' },
    { id: 2, patient: 'Walter Holt', time: '10:30', treatment: 'Swedana', status: 'confirmed' },
    { id: 3, patient: 'Darlene Nguyen', time: '14:00', treatment: 'Shirodhara', status: 'pending' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Calendar</h2>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
            Today
          </button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['day', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${
                  viewMode === mode 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="grid grid-cols-7 gap-1 mb-4 text-center text-sm">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="font-medium text-gray-500 py-2">{day}</div>
        ))}
        {/* Calendar days would be generated here */}
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 6; // Adjust for month start
          const isToday = day === 23;
          const hasAppointment = [5, 8, 15, 23, 28].includes(day);
          
          return (
            <div
              key={i}
              className={`
                py-2 text-sm cursor-pointer rounded-md relative
                ${day > 0 && day <= 31 ? 'hover:bg-gray-100' : 'text-gray-300'}
                ${isToday ? 'bg-blue-500 text-white font-semibold' : ''}
                ${hasAppointment && !isToday ? 'bg-blue-100 text-blue-800' : ''}
              `}
            >
              {day > 0 && day <= 31 ? day : ''}
              {hasAppointment && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Today's Appointments */}
      <div className="border-t pt-4">
        <h3 className="font-medium text-gray-800 mb-3">Today's Appointments</h3>
        <div className="space-y-2">
          {todayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`p-3 rounded-lg border ${getStatusColor(appointment.status)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-sm">{appointment.patient}</h4>
                  <p className="text-xs opacity-75 mt-1">{appointment.treatment}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{appointment.time}</span>
                  <p className="text-xs opacity-75 mt-1 capitalize">{appointment.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
```

### 4. Analytics Dashboard Component

```jsx
// components/practitioner/AnalyticsDashboard.jsx
import React from 'react';

const AnalyticsDashboard = () => {
  // Mock analytics data
  const analyticsData = {
    totalPatients: 156,
    appointmentsToday: 8,
    treatmentSuccess: 92,
    revenue: 45600
  };

  const chartData = [
    { month: 'Jan', patients: 45 },
    { month: 'Feb', patients: 52 },
    { month: 'Mar', patients: 48 },
    { month: 'Apr', patients: 61 },
    { month: 'May', patients: 55 },
    { month: 'Jun', patients: 67 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Analytics</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Patients</p>
              <p className="text-2xl font-bold text-blue-800">{analyticsData.totalPatients}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">👥</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-green-800">{analyticsData.treatmentSuccess}%</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Patient Growth</h3>
        <div className="h-32 flex items-end justify-between space-x-2">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-blue-500 rounded-t-sm transition-all duration-500"
                style={{ height: `${(data.patients / 70) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart */}
      <div className="flex justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="75, 100"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray="25, 100"
              strokeDashoffset="-75"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">75%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
```

### 5. AI Insights Component

```jsx
// components/practitioner/AIInsights.jsx
import React from 'react';
import { useAIInsights } from '../../hooks/useAIInsights';

const AIInsights = () => {
  const { insights, loading } = useAIInsights();

  const mockInsights = [
    {
      id: 1,
      type: 'treatment_recommendation',
      title: "Review James Clark's treatment plan",
      description: 'AI suggests adjusting Abhyanga frequency based on progress data.',
      priority: 'high',
      icon: '🤖'
    },
    {
      id: 2,
      type: 'health_alert',
      title: 'Consider additional tests for kidneys',
      description: 'Pattern analysis indicates potential kidney-related concerns.',
      priority: 'medium',
      icon: '⚕️'
    },
    {
      id: 3,
      type: 'scheduling',
      title: 'Optimize appointment slots',
      description: 'AI identified 3 potential scheduling conflicts next week.',
      priority: 'low',
      icon: '📅'
    },
    {
      id: 4,
      type: 'patient_progress',
      title: 'Excellent progress detected',
      description: 'Sarah Johnson showing 40% faster recovery than average.',
      priority: 'info',
      icon: '📊'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      case 'info': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityTextColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-800';
      case 'medium': return 'text-yellow-800';
      case 'low': return 'text-blue-800';
      case 'info': return 'text-green-800';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">AI Insights</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {mockInsights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-lg border-l-4 ${getPriorityColor(insight.priority)} cursor-pointer hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg">{insight.icon}</span>
              <div className="flex-1">
                <h3 className={`font-medium text-sm ${getPriorityTextColor(insight.priority)}`}>
                  {insight.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {insight.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)} ${getPriorityTextColor(insight.priority)} font-medium`}>
                    {insight.priority.toUpperCase()}
                  </span>
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Insights
        </button>
      </div>
    </div>
  );
};

export default AIInsights;
```

## Custom Hooks

### 1. usePractitionerData Hook

```javascript
// hooks/usePractitionerData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePractitionerData = () => {
  const [practitionerData, setPractitionerData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPractitionerData();
  }, []);

  const fetchPractitionerData = async () => {
    try {
      setLoading(true);
      const [practitionerResponse, patientsResponse, appointmentsResponse] = await Promise.all([
        axios.get('/api/practitioner/profile'),
        axios.get('/api/practitioner/patients'),
        axios.get('/api/practitioner/appointments')
      ]);
      
      setPractitionerData(practitionerResponse.data);
      setPatients(patientsResponse.data);
      setAppointments(appointmentsResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    practitionerData,
    patients,
    appointments,
    loading,
    error,
    refetch: fetchPractitionerData
  };
};
```

### 2. usePatientManagement Hook

```javascript
// hooks/usePatientManagement.js
import { useState, useCallback } from 'react';
import axios from 'axios';

export const usePatientManagement = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectPatient = useCallback(async (patient) => {
    setSelectedPatient(patient);
    setLoading(true);
    
    try {
      const response = await axios.get(`/api/practitioner/patients/${patient.id}/history`);
      setPatientHistory(response.data);
    } catch (err) {
      console.error('Error fetching patient history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePatientRecord = async (patientId, updateData) => {
    try {
      const response = await axios.put(`/api/practitioner/patients/${patientId}`, updateData);
      setSelectedPatient(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating patient record:', err);
      throw err;
    }
  };

  const addTreatmentNote = async (patientId, note) => {
    try {
      const response = await axios.post(`/api/practitioner/patients/${patientId}/notes`, note);
      setPatientHistory(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      console.error('Error adding treatment note:', err);
      throw err;
    }
  };

  return {
    selectedPatient,
    patientHistory,
    loading,
    selectPatient,
    updatePatientRecord,
    addTreatmentNote
  };
};
```

## API Endpoints Required

```javascript
// Practitioner API endpoints
GET    /api/practitioner/profile           // Get practitioner profile
GET    /api/practitioner/patients          // Get all patients
GET    /api/practitioner/patients/:id      // Get specific patient
PUT    /api/practitioner/patients/:id      // Update patient record
GET    /api/practitioner/patients/:id/history // Get patient treatment history
POST   /api/practitioner/patients/:id/notes   // Add treatment note
GET    /api/practitioner/appointments      // Get practitioner's appointments
POST   /api/practitioner/appointments      // Create new appointment
PUT    /api/practitioner/appointments/:id  // Update appointment
DELETE /api/practitioner/appointments/:id  // Cancel appointment
GET    /api/practitioner/analytics         // Get practice analytics
GET    /api/practitioner/ai-insights       // Get AI-generated insights
```

## Responsive Design

```css
/* Practitioner Dashboard Responsive */
@media (max-width: 768px) {
  .practitioner-grid {
    @apply grid-cols-1 gap-4;
  }
  
  .patient-list {
    @apply max-h-48;
  }
  
  .calendar-view {
    @apply text-sm;
  }
}

@media (min-width: 1024px) {
  .practitioner-grid {
    @apply grid-cols-4 gap-6;
  }
}
```

## Key Features

### 1. Patient Management
- Comprehensive patient list with search and filtering
- Detailed patient records and treatment history
- Quick access to patient information and progress

### 2. Appointment Scheduling
- Calendar view with day/week/month options
- Drag-and-drop appointment management
- Conflict detection and resolution

### 3. Treatment Planning
- Customizable treatment protocols
- Progress tracking and milestone management
- Treatment outcome analysis

### 4. AI-Powered Insights
- Treatment recommendations based on patient data
- Scheduling optimization suggestions
- Health pattern recognition and alerts

### 5. Analytics Dashboard
- Practice performance metrics
- Patient outcome statistics
- Revenue and appointment analytics

## Security Considerations

- Role-based access control for practitioner features
- Patient data encryption and HIPAA compliance
- Audit logging for all patient record access
- Secure API endpoints with JWT authentication

## Testing Strategy

- Unit tests for all components and hooks
- Integration tests for patient management workflows
- E2E tests for appointment scheduling
- Performance tests for large patient datasets

This implementation guide provides a comprehensive foundation for building the Practitioner Dashboard with all essential features for managing an Ayurvedic practice effectively.
