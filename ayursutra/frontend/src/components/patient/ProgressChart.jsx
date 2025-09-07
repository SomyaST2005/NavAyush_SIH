import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Activity, Target } from 'lucide-react';
import { usePatientProgress } from '../../hooks/usePatientProgress';

const ProgressChart = () => {
  const { progressData, loading, error } = usePatientProgress();
  const [activeTab, setActiveTab] = useState('overall');

  // Mock data for demonstration
  const mockProgressData = {
    overall: [
      { date: '2024-01-01', progress: 10, energy: 6, sleep: 7, digestion: 5 },
      { date: '2024-01-03', progress: 18, energy: 7, sleep: 7, digestion: 6 },
      { date: '2024-01-05', progress: 25, energy: 7, sleep: 8, digestion: 7 },
      { date: '2024-01-07', progress: 35, energy: 8, sleep: 8, digestion: 7 },
      { date: '2024-01-09', progress: 42, energy: 8, sleep: 9, digestion: 8 },
      { date: '2024-01-11', progress: 50, energy: 9, sleep: 9, digestion: 8 },
      { date: '2024-01-13', progress: 58, energy: 9, sleep: 8, digestion: 9 },
      { date: '2024-01-15', progress: 65, energy: 9, sleep: 9, digestion: 9 }
    ],
    symptoms: [
      { symptom: 'Stress', before: 8, current: 3, improvement: 62 },
      { symptom: 'Fatigue', before: 9, current: 2, improvement: 78 },
      { symptom: 'Digestive Issues', before: 7, current: 2, improvement: 71 },
      { symptom: 'Sleep Problems', before: 6, current: 1, improvement: 83 },
      { symptom: 'Joint Pain', before: 5, current: 1, improvement: 80 }
    ],
    constitution: [
      { dosha: 'Vata', balance: 75, color: '#8B5CF6' },
      { dosha: 'Pitta', balance: 85, color: '#EF4444' },
      { dosha: 'Kapha', balance: 70, color: '#10B981' }
    ]
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === 'progress' ? '%' : '/10'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overall'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('overall')}
        >
          Overall Progress
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'symptoms'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('symptoms')}
        >
          Symptom Relief
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'constitution'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('constitution')}
        >
          Dosha Balance
        </button>
      </div>

      {/* Overall Progress Tab */}
      {activeTab === 'overall' && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Treatment Progress Over Time</h3>
            <p className="text-sm text-gray-600">Track your overall progress and wellness indicators</p>
          </div>
          
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockProgressData.overall}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name="Overall Progress"
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                  name="Energy Level"
                />
                <Line 
                  type="monotone" 
                  dataKey="sleep" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
                  name="Sleep Quality"
                />
                <Line 
                  type="monotone" 
                  dataKey="digestion" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                  name="Digestion"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Overall Progress</p>
                  <p className="text-2xl font-bold text-blue-700">65%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-blue-600 mt-2">+8% this week</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Energy Level</p>
                  <p className="text-2xl font-bold text-green-700">9/10</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-green-600 mt-2">Excellent</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Sleep Quality</p>
                  <p className="text-2xl font-bold text-purple-700">9/10</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-purple-600 mt-2">Restful sleep</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Digestion</p>
                  <p className="text-2xl font-bold text-yellow-700">9/10</p>
                </div>
                <Target className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-xs text-yellow-600 mt-2">Optimal</p>
            </div>
          </div>
        </div>
      )}

      {/* Symptom Relief Tab */}
      {activeTab === 'symptoms' && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Symptom Improvement</h3>
            <p className="text-sm text-gray-600">Compare your symptoms before and after treatment</p>
          </div>

          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockProgressData.symptoms} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="symptom" 
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" fontSize={12} domain={[0, 10]} />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'before' ? 'Before Treatment' : 'Current Level']}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="before" fill="#EF4444" name="before" radius={[2, 2, 0, 0]} />
                <Bar dataKey="current" fill="#10B981" name="current" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProgressData.symptoms.map((symptom, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">{symptom.symptom}</h4>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-red-600">Before: {symptom.before}/10</span>
                  <span className="text-green-600">Current: {symptom.current}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${symptom.improvement}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-600 font-medium">
                  {symptom.improvement}% improvement
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constitution Balance Tab */}
      {activeTab === 'constitution' && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Dosha Balance</h3>
            <p className="text-sm text-gray-600">Monitor your constitutional balance throughout treatment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dosha Balance Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockProgressData.constitution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="balance"
                  >
                    {mockProgressData.constitution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Balance']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Dosha Details */}
            <div className="space-y-4">
              {mockProgressData.constitution.map((dosha, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{dosha.dosha}</h4>
                    <span className="text-sm font-medium" style={{ color: dosha.color }}>
                      {dosha.balance}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${dosha.balance}%`,
                        backgroundColor: dosha.color
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {dosha.balance >= 80 ? 'Excellent balance' :
                     dosha.balance >= 70 ? 'Good balance' :
                     dosha.balance >= 60 ? 'Moderate balance' : 'Needs attention'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Constitution Insights */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
            <h4 className="font-medium text-gray-800 mb-2">Constitutional Insights</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Your Pitta dosha shows excellent balance (85%), indicating good metabolic function</p>
              <p>• Vata balance is improving (75%), continue with grounding practices</p>
              <p>• Kapha levels are stabilizing (70%), maintain current dietary guidelines</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
