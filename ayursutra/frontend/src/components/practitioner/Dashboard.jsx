import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, TrendingUp, Bell, Plus, Activity, BarChart3, Brain, AlertCircle } from 'lucide-react';
import PatientList from './PatientList';
import AppointmentScheduler from './AppointmentScheduler';
import CalendarView from './CalendarView';
import AIInsights from './AIInsights';
import AnalyticsDashboard from './AnalyticsDashboard';
import TreatmentPlanner from './TreatmentPlanner';
import PatientRecords from './PatientRecords';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [practitionerData, setPractitionerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock practitioner data
  const mockPractitionerData = {
    name: 'Dr. Rajesh Ayurved',
    specialization: 'Panchakarma Specialist',
    experience: '15 years',
    rating: 4.8,
    todayAppointments: 8,
    completedToday: 5,
    upcomingToday: 3,
    activePatients: 45,
    totalPatients: 127,
    weeklyRevenue: 87500,
    monthlyGrowth: 12,
    patientSatisfaction: 89
  };

  useEffect(() => {
    setTimeout(() => {
      setPractitionerData(mockPractitionerData);
      setLoading(false);
    }, 800);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'treatment-planner', label: 'Treatment Plans', icon: Clock },
    { id: 'patient-records', label: 'Records', icon: Bell },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {practitionerData?.name}
            </h1>
            <p className="text-gray-600 mt-2">
              {practitionerData?.specialization} • {practitionerData?.experience} experience
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Rating:</span>
              <span className="ml-2 font-semibold text-blue-600">
                ⭐ {practitionerData?.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-colors ${
                  activeView === item.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Dashboard */}
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Appointments</p>
                    <p className="text-3xl font-bold text-blue-600">{practitionerData?.todayAppointments}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {practitionerData?.completedToday} completed, {practitionerData?.upcomingToday} upcoming
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Patients</p>
                    <p className="text-3xl font-bold text-green-600">{practitionerData?.activePatients}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      of {practitionerData?.totalPatients} total
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Weekly Revenue</p>
                    <p className="text-3xl font-bold text-purple-600">₹{practitionerData?.weeklyRevenue?.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">
                      +{practitionerData?.monthlyGrowth}% this month
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Patient Satisfaction</p>
                    <p className="text-3xl font-bold text-orange-600">{practitionerData?.patientSatisfaction}%</p>
                    <p className="text-xs text-green-600 mt-1">Excellent rating</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Today's Schedule */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Today's Schedule
                    </h2>
                  </div>
                  <AppointmentScheduler />
                </div>
              </div>

              {/* Quick Actions & Alerts */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium text-blue-700">Add New Patient</span>
                    </button>
                    <button className="w-full flex items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                      <Calendar className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium text-green-700">Schedule Appointment</span>
                    </button>
                    <button className="w-full flex items-center justify-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
                      <Brain className="h-4 w-4 mr-2 text-purple-600" />
                      <span className="font-medium text-purple-700">AI Treatment Plan</span>
                    </button>
                  </div>
                </div>

                {/* Alerts & Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                    Alerts
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">Follow-up Required</p>
                      <p className="text-xs text-yellow-600 mt-1">3 patients need follow-up calls</p>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800">Urgent Appointment</p>
                      <p className="text-xs text-red-600 mt-1">Emergency slot requested by John Doe</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Treatment Complete</p>
                      <p className="text-xs text-blue-600 mt-1">2 patients completed their Panchakarma</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Recent Patients
                </h2>
              </div>
              <PatientList isCompact={true} />
            </div>
          </div>
        )}

        {/* Patients View */}
        {activeView === 'patients' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Patient Management</h2>
            </div>
            <PatientList />
          </div>
        )}

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Appointment Calendar</h2>
            </div>
            <CalendarView />
          </div>
        )}

        {/* AI Insights View */}
        {activeView === 'insights' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">AI-Powered Insights</h2>
            </div>
            <AIInsights />
          </div>
        )}

        {/* Treatment Planner View */}
        {activeView === 'treatment-planner' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Treatment Planning</h2>
            </div>
            <TreatmentPlanner />
          </div>
        )}

        {/* Patient Records View */}
        {activeView === 'patient-records' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Patient Records</h2>
            </div>
            <PatientRecords />
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Practice Analytics</h2>
            </div>
            <AnalyticsDashboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
