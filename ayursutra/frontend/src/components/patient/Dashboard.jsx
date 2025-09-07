import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AppointmentCalendar from './AppointmentCalendar';
import ProgressChart from './ProgressChart';
import TreatmentMilestones from './TreatmentMilestones';
import NotificationPanel from './NotificationPanel';
import UpcomingAppointments from './UpcomingAppointments';
import TreatmentPhaseIndicator from './TreatmentPhaseIndicator';
import { Calendar, Clock, Activity, Bell, User, Heart } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch patient data
    const fetchPatientData = async () => {
      try {
        // This would be replaced with actual API call
        const mockData = {
          name: user?.fullName || 'Patient',
          constitution: 'Vata-Pitta',
          currentPhase: 'Pradhankarma',
          progressPercentage: 65,
          nextAppointment: {
            date: '2024-01-15',
            time: '10:00 AM',
            practitioner: 'Dr. Priya Sharma',
            treatment: 'Abhyanga'
          },
          totalSessions: 21,
          completedSessions: 14
        };
        setPatientData(mockData);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {patientData?.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Your Panchakarma journey continues. Stay consistent for optimal results.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Constitution:</span>
              <span className="ml-2 font-semibold text-green-600">
                {patientData?.constitution}
              </span>
            </div>
            <NotificationPanel />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Phase</p>
                <p className="text-2xl font-bold text-green-600">
                  {patientData?.currentPhase}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {patientData?.progressPercentage}%
                </p>
              </div>
              <Heart className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-2xl font-bold text-purple-600">
                  {patientData?.completedSessions}/{patientData?.totalSessions}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Session</p>
                <p className="text-lg font-bold text-orange-600">
                  {patientData?.nextAppointment?.date}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Treatment Phase Indicator */}
        <div className="mb-8">
          <TreatmentPhaseIndicator currentPhase={patientData?.currentPhase} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  Upcoming Appointments
                </h2>
              </div>
              <UpcomingAppointments />
            </div>

            {/* Progress Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  Treatment Progress
                </h2>
              </div>
              <ProgressChart />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Treatment Milestones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-purple-600" />
                  Treatment Milestones
                </h2>
              </div>
              <TreatmentMilestones />
            </div>

            {/* Calendar Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  Calendar
                </h2>
              </div>
              <AppointmentCalendar />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              <span className="font-medium text-green-700">Book Appointment</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-medium text-blue-700">View Progress</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <User className="h-5 w-5 mr-2 text-purple-600" />
              <span className="font-medium text-purple-700">Update Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
