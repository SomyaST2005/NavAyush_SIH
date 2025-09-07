import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './components/patient/Dashboard';
import PractitionerDashboard from './components/practitioner/Dashboard';
import BookAppointment from './pages/patient/BookAppointment';
import TreatmentHistory from './pages/patient/TreatmentHistory';
import Profile from './pages/patient/Profile';

// Component to conditionally render navbar
const ConditionalNavbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Show navbar only on authenticated pages or when user is logged in
  const publicPages = ['/', '/login', '/register'];
  const isPublicPage = publicPages.includes(location.pathname);
  
  // Show navbar if user is authenticated OR if on public page but user exists
  if (!user && isPublicPage) {
    return null;
  }
  
  return <Navbar />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ConditionalNavbar />
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Patient Routes */}
              <Route 
                path="/patient/dashboard" 
                element={
                  <ProtectedRoute>
                    <PatientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient/book-appointment" 
                element={
                  <ProtectedRoute>
                    <BookAppointment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient/treatment-history" 
                element={
                  <ProtectedRoute>
                    <TreatmentHistory />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Practitioner Routes */}
              <Route 
                path="/practitioner/dashboard" 
                element={
                  <ProtectedRoute>
                    <PractitionerDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect unknown routes to landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
