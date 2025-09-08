# Patient Dashboard Implementation Guide

## Overview

The Patient Dashboard is the primary interface for patients to manage their Panchakarma treatment journey. It provides appointment scheduling, progress tracking, treatment milestones, and notifications.

## UI Components Structure

```
PatientDashboard/
├── components/
│   ├── AppointmentCalendar.jsx
│   ├── ProgressChart.jsx
│   ├── TreatmentMilestones.jsx
│   ├── NotificationPanel.jsx
│   ├── UpcomingAppointments.jsx
│   └── TreatmentPhaseIndicator.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── BookAppointment.jsx
│   ├── TreatmentHistory.jsx
│   └── Profile.jsx
└── hooks/
    ├── useAppointments.js
    ├── usePatientProgress.js
    └── useNotifications.js
```

## Core Components Implementation

### 1. Main Dashboard Component

```jsx
// components/patient/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import AppointmentCalendar from './AppointmentCalendar';
import ProgressChart from './ProgressChart';
import TreatmentMilestones from './TreatmentMilestones';
import NotificationPanel from './NotificationPanel';
import UpcomingAppointments from './UpcomingAppointments';

const Dashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your Panchakarma journey</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 text-cyan-500">
              {/* Lotus icon */}
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C12 2 8 4 8 8s4 6 4 6 4-2 4-6-4-6-4-6z"/>
                <path d="M12 8C12 8 8 10 8 14s4 6 4 6 4-2 4-6-4-6-4-6z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <AppointmentCalendar />
            <UpcomingAppointments />
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-1 space-y-6">
            <ProgressChart />
            <TreatmentMilestones />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <NotificationPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

### 2. Appointment Calendar Component

```jsx
// components/patient/AppointmentCalendar.jsx
import React, { useState, useEffect } from 'react';
import { useAppointments } from '../../hooks/useAppointments';

const AppointmentCalendar = () => {
  const { appointments, loading, bookAppointment } = useAppointments();
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const hasAppointment = (day) => {
    if (!day) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return appointments.some(apt => 
      new Date(apt.scheduled_date).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Appointment</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Book New
        </button>
      </div>

      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays().map((day, index) => (
          <div
            key={index}
            className={`
              text-center py-2 text-sm cursor-pointer rounded-md
              ${day ? 'hover:bg-gray-100' : ''}
              ${day === 10 ? 'bg-green-100 text-green-800 font-semibold' : ''}
              ${hasAppointment(day) ? 'bg-blue-100 text-blue-800' : ''}
            `}
            onClick={() => day && setSelectedDate(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Progress Chart Component

```jsx
// components/patient/ProgressChart.jsx
import React from 'react';
import { usePatientProgress } from '../../hooks/usePatientProgress';

const ProgressChart = () => {
  const { progressData, loading } = usePatientProgress();

  // Mock progress data for demo
  const mockProgress = [
    { week: 1, value: 20 },
    { week: 2, value: 35 },
    { week: 3, value: 45 },
    { week: 4, value: 65 },
    { week: 5, value: 80 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress</h2>
      
      {/* Progress Chart - Simple SVG implementation */}
      <div className="h-32 relative">
        <svg className="w-full h-full" viewBox="0 0 300 100">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          
          {/* Progress Line */}
          <polyline
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            points={mockProgress.map((point, index) => 
              `${(index * 60) + 20},${100 - point.value}`
            ).join(' ')}
          />
          
          {/* Progress Points */}
          {mockProgress.map((point, index) => (
            <circle
              key={index}
              cx={(index * 60) + 20}
              cy={100 - point.value}
              r="4"
              fill="#10B981"
              className="animate-pulse"
            />
          ))}
        </svg>
      </div>
      
      {/* Progress Summary */}
      <div className="mt-4 text-center">
        <span className="text-2xl font-bold text-green-600">80%</span>
        <p className="text-sm text-gray-500">Treatment Progress</p>
      </div>
    </div>
  );
};
```

### 4. Treatment Milestones Component

```jsx
// components/patient/TreatmentMilestones.jsx
import React from 'react';

const TreatmentMilestones = () => {
  const milestones = [
    { 
      phase: 'Purvakarma', 
      name: 'Herbal Treatments', 
      completed: true,
      icon: '🌿'
    },
    { 
      phase: 'Purvakarma', 
      name: 'Yoga', 
      completed: true,
      icon: '🧘'
    },
    { 
      phase: 'Pradhankarma', 
      name: 'Abhyanga', 
      completed: false,
      icon: '💆'
    },
    { 
      phase: 'Pradhankarma', 
      name: 'Swedana', 
      completed: false,
      icon: '🌡️'
    },
    { 
      phase: 'Paschatkarma', 
      name: 'Rasayana', 
      completed: false,
      icon: '🍵'
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Treatment Milestones</h2>
      
      {/* Treatment Progress Line */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="absolute left-6 top-0 w-0.5 bg-green-500" style={{height: '40%'}}></div>
        
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-center relative">
              {/* Milestone Icon */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg relative z-10
                ${milestone.completed 
                  ? 'bg-green-100 border-2 border-green-500' 
                  : 'bg-gray-100 border-2 border-gray-300'
                }
              `}>
                {milestone.completed ? '✓' : milestone.icon}
              </div>
              
              {/* Milestone Content */}
              <div className="ml-4 flex-1">
                <h3 className={`font-medium ${milestone.completed ? 'text-green-800' : 'text-gray-600'}`}>
                  {milestone.name}
                </h3>
                <p className="text-sm text-gray-500">{milestone.phase}</p>
              </div>
              
              {/* Status Indicator */}
              {milestone.completed && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 5. Notifications Panel Component

```jsx
// components/patient/NotificationPanel.jsx
import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationPanel = () => {
  const { notifications, markAsRead } = useNotifications();

  const mockNotifications = [
    {
      id: 1,
      type: 'medication',
      title: 'Take medication',
      message: 'Time for your herbal medicine',
      time: '2:00 PM',
      read: false,
      icon: '💊'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Yoga session at 2:00 PM',
      message: 'Your yoga session starts in 1 hour',
      time: '1:00 PM',
      read: false,
      icon: '🧘'
    },
    {
      id: 3,
      type: 'health',
      title: 'Update health information',
      message: 'Please update your daily health metrics',
      time: '12:00 PM',
      read: false,
      icon: '📋'
    },
    {
      id: 4,
      type: 'treatment',
      title: 'Herbal treatment scheduled',
      message: 'Your next Abhyanga session is confirmed',
      time: '11:00 AM',
      read: true,
      icon: '🌿'
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
      
      <div className="space-y-3">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-200
              ${notification.read 
                ? 'bg-gray-50 border-gray-300' 
                : 'bg-green-50 border-green-500 hover:bg-green-100'
              }
            `}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg">{notification.icon}</span>
              <div className="flex-1">
                <h3 className={`font-medium text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                  {notification.title}
                </h3>
                <p className={`text-xs mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                  {notification.message}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">{notification.time}</span>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
        View All Notifications
      </button>
    </div>
  );
};
```

## Custom Hooks

### 1. useAppointments Hook

```javascript
// hooks/useAppointments.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/patient/appointments');
      setAppointments(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async (appointmentData) => {
    try {
      const response = await axios.post('/api/patient/appointments', appointmentData);
      setAppointments([...appointments, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`/api/patient/appointments/${appointmentId}`);
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    appointments,
    loading,
    error,
    bookAppointment,
    cancelAppointment,
    refetch: fetchAppointments
  };
};
```

### 2. usePatientProgress Hook

```javascript
// hooks/usePatientProgress.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePatientProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [progressResponse, milestonesResponse] = await Promise.all([
        axios.get('/api/patient/progress'),
        axios.get('/api/patient/milestones')
      ]);
      
      setProgressData(progressResponse.data);
      setMilestones(milestonesResponse.data);
    } catch (err) {
      console.error('Error fetching progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (progressUpdate) => {
    try {
      const response = await axios.post('/api/patient/progress', progressUpdate);
      setProgressData(response.data);
    } catch (err) {
      console.error('Error updating progress:', err);
      throw err;
    }
  };

  return {
    progressData,
    milestones,
    loading,
    updateProgress,
    refetch: fetchProgressData
  };
};
```

## API Endpoints Required

```javascript
// Patient API endpoints needed
GET    /api/patient/appointments     // Get patient's appointments
POST   /api/patient/appointments     // Book new appointment
DELETE /api/patient/appointments/:id // Cancel appointment
GET    /api/patient/progress         // Get treatment progress
POST   /api/patient/progress         // Update progress metrics
GET    /api/patient/milestones       // Get treatment milestones
GET    /api/patient/notifications    // Get notifications
POST   /api/patient/notifications/:id/read // Mark notification as read
GET    /api/patient/profile          // Get patient profile
PUT    /api/patient/profile          // Update patient profile
```

## Styling Guidelines

### Color Palette
```css
:root {
  --primary-green: #10B981;
  --primary-blue: #3B82F6;
  --secondary-cyan: #06B6D4;
  --accent-orange: #F59E0B;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-600: #4B5563;
  --gray-800: #1F2937;
}
```

### Component Classes
```css
/* Card Components */
.card-primary {
  @apply bg-white rounded-xl shadow-lg p-6;
}

.card-secondary {
  @apply bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4;
}

/* Button Styles */
.btn-primary {
  @apply bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors;
}

.btn-secondary {
  @apply bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors;
}

/* Icon Styles */
.icon-primary {
  @apply w-8 h-8 text-green-500;
}

.icon-secondary {
  @apply w-6 h-6 text-blue-500;
}
```

## Responsive Design

```css
/* Mobile First Approach */
@media (max-width: 640px) {
  .dashboard-grid {
    @apply grid-cols-1 gap-4;
  }
  
  .card-primary {
    @apply p-4;
  }
}

@media (min-width: 768px) {
  .dashboard-grid {
    @apply grid-cols-2 gap-6;
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    @apply grid-cols-3 gap-6;
  }
}
```

## Testing Requirements

### Unit Tests
- Component rendering
- Hook functionality
- API integration
- Form validation

### Integration Tests
- Dashboard data flow
- Appointment booking flow
- Progress tracking updates
- Notification system

### Example Test
```javascript
// __tests__/PatientDashboard.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../components/patient/Dashboard';

const MockedDashboard = () => (
  <BrowserRouter>
    <Dashboard />
  </BrowserRouter>
);

describe('Patient Dashboard', () => {
  test('renders dashboard components', () => {
    render(<MockedDashboard />);
    
    expect(screen.getByText('Patient Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Appointment')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Treatment Milestones')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  test('displays upcoming appointments', async () => {
    render(<MockedDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('April 21, 2024')).toBeInTheDocument();
      expect(screen.getByText('10:00 AM Visit')).toBeInTheDocument();
    });
  });
});
```

## Performance Optimization

### 1. React Optimization
```javascript
// Use React.memo for expensive components
const ProgressChart = React.memo(({ progressData }) => {
  // Component implementation
});

// Use useMemo for expensive calculations
const calculatedProgress = useMemo(() => {
  return progressData.reduce((acc, curr) => acc + curr.value, 0);
}, [progressData]);

// Use useCallback for event handlers
const handleAppointmentBook = useCallback((appointmentData) => {
  bookAppointment(appointmentData);
}, [bookAppointment]);
```

### 2. Data Loading Optimization
```javascript
// Implement lazy loading for dashboard sections
const LazyProgressChart = lazy(() => import('./ProgressChart'));
const LazyTreatmentMilestones = lazy(() => import('./TreatmentMilestones'));

// Use Suspense for loading states
<Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded"></div>}>
  <LazyProgressChart />
</Suspense>
```

## Accessibility Features

### 1. ARIA Labels and Roles
```jsx
// Add proper ARIA labels
<button
  aria-label="Book new appointment"
  role="button"
  className="btn-primary"
>
  Book New
</button>

// Progress indicators
<div
  role="progressbar"
  aria-valuenow={80}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Treatment progress"
>
  80% Complete
</div>
```

### 2. Keyboard Navigation
```javascript
// Handle keyboard events
const handleKeyDown = (event, action) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
};

// Focus management
useEffect(() => {
  if (isModalOpen) {
    modalRef.current?.focus();
  }
}, [isModalOpen]);
```

## Error Handling

### 1. Error Boundary Component
```jsx
// components/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. API Error Handling
```javascript
// utils/apiErrorHandler.js
export const handleApiError = (error, showNotification) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'Server error occurred';
    showNotification(message, 'error');
  } else if (error.request) {
    // Request made but no response
    showNotification('Network error. Please check your connection.', 'error');
  } else {
    // Something else happened
    showNotification('An unexpected error occurred.', 'error');
  }
};
```

## State Management

### 1. Context for Global State
```javascript
// context/PatientContext.js
const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const value = {
    patient,
    setPatient,
    appointments,
    setAppointments,
    notifications,
    setNotifications,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within PatientProvider');
  }
  return context;
};
```

## Animation and Micro-interactions

### 1. Loading Animations
```css
/* Loading skeleton */
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
```

### 2. Progress Animations
```css
/* Progress bar animation */
.progress-bar {
  position: relative;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  border-radius: 9999px;
  transition: width 0.5s ease-in-out;
}

/* Pulse animation for notifications */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.notification-pulse {
  animation: pulse 2s infinite;
}
```

## Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Action   │───▶│  Custom Hook    │───▶│   API Service   │
│  (Click, etc.)  │    │ (useAppointments│    │  (axios calls)  │
└─────────────────┘    │  useProgress)   │    └─────────────────┘
                       └─────────────────┘             │
                                │                      │
                                ▼                      ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Local State    │◀───│  API Response   │
                       │   (useState)    │    │    (data)       │
                       └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ UI Re-render    │
                       │  (Components)   │
                       └─────────────────┘
```

## Future Enhancements

### 1. Offline Support
```javascript
// service-worker.js registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('SW registered: ', registration);
    });
}

// Cache API responses for offline use
const cacheAppointments = (appointments) => {
  localStorage.setItem('cached_appointments', JSON.stringify({
    data: appointments,
    timestamp: Date.now()
  }));
};
```

### 2. Voice Interface
```javascript
// Voice commands for accessibility
const useVoiceCommands = () => {
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
      };
    }
  }, []);

  const handleVoiceCommand = (command) => {
    if (command.includes('book appointment')) {
      // Navigate to booking page
    } else if (command.includes('check progress')) {
      // Focus on progress section
    }
  };
};
```

### 3. Advanced Progress Tracking
```javascript
// Biometric data integration
const useBiometricTracking = () => {
  const [heartRate, setHeartRate] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);

  const connectWearableDevice = async () => {
    // Integration with fitness trackers
    // Apple HealthKit, Google Fit, etc.
  };

  return { heartRate, stressLevel, connectWearableDevice };
};
```

## Security Considerations

### 1. Data Protection
```javascript
// Encrypt sensitive data before storing
const encryptData = (data) => {
  // Use crypto-js or similar library
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// Sanitize user inputs
const sanitizeInput = (input) => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

### 2. Session Management
```javascript
// Auto-logout on inactivity
const useAutoLogout = (timeout = 30 * 60 * 1000) => {
  useEffect(() => {
    let timeoutId;
    
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Logout user
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }, timeout);
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keypress', resetTimeout);
    
    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
    };
  }, [timeout]);
};
```

This comprehensive Patient Dashboard implementation guide provides all the necessary components, hooks, styling, and best practices needed to build a robust, user-friendly interface for Panchakarma patients.