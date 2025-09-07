import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, AlertTriangle, Lightbulb, BarChart3, PieChart, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState('overview');

  // Mock AI insights data
  const mockInsights = {
    overview: {
      totalPatients: 127,
      activePatients: 45,
      treatmentSuccessRate: 89,
      averageSessionsPerPatient: 12.5,
      patientSatisfactionScore: 4.7
    },
    treatmentEffectiveness: [
      { treatment: 'Abhyanga', successRate: 92, totalPatients: 35, avgSessions: 8 },
      { treatment: 'Shirodhara', successRate: 88, totalPatients: 28, avgSessions: 12 },
      { treatment: 'Panchakarma', successRate: 95, totalPatients: 22, avgSessions: 21 },
      { treatment: 'Swedana', successRate: 85, totalPatients: 18, avgSessions: 6 },
      { treatment: 'Nasya', successRate: 78, totalPatients: 15, avgSessions: 5 }
    ],
    patientProgress: [
      { month: 'Aug', completed: 12, improved: 18, stable: 8 },
      { month: 'Sep', completed: 15, improved: 22, stable: 6 },
      { month: 'Oct', completed: 18, improved: 25, stable: 4 },
      { month: 'Nov', completed: 22, improved: 28, stable: 3 },
      { month: 'Dec', completed: 25, improved: 32, stable: 2 },
      { month: 'Jan', completed: 28, improved: 35, stable: 2 }
    ],
    constitutionDistribution: [
      { name: 'Vata', value: 35, color: '#8B5CF6' },
      { name: 'Pitta', value: 40, color: '#EF4444' },
      { name: 'Kapha', value: 25, color: '#10B981' }
    ],
    recommendations: [
      {
        type: 'treatment',
        priority: 'high',
        title: 'Optimize Shirodhara Sessions',
        description: 'Analysis shows 15% better outcomes when Shirodhara sessions are extended by 15 minutes for Vata-dominant patients.',
        impact: 'Potential 12% improvement in treatment success rate',
        action: 'Adjust treatment protocols for Vata patients'
      },
      {
        type: 'scheduling',
        priority: 'medium',
        title: 'Morning Slot Optimization',
        description: 'Patients show 23% better compliance with morning appointments (8-11 AM) compared to afternoon slots.',
        impact: 'Reduce no-shows by 18%',
        action: 'Prioritize morning slots for new patients'
      },
      {
        type: 'patient-care',
        priority: 'high',
        title: 'Follow-up Frequency',
        description: 'Patients with weekly follow-ups show 28% faster recovery compared to bi-weekly follow-ups.',
        impact: 'Reduce average treatment duration by 2.3 sessions',
        action: 'Implement weekly check-ins for active patients'
      },
      {
        type: 'resource',
        priority: 'low',
        title: 'Equipment Utilization',
        description: 'Steam therapy equipment shows peak usage between 2-4 PM. Consider additional equipment or schedule optimization.',
        impact: 'Increase daily capacity by 15%',
        action: 'Review equipment scheduling'
      }
    ],
    riskPatients: [
      {
        name: 'Rajesh Kumar',
        risk: 'high',
        reason: 'Missed 2 consecutive appointments',
        lastVisit: '2024-01-10',
        recommendation: 'Immediate follow-up call required'
      },
      {
        name: 'Priya Sharma',
        risk: 'medium',
        reason: 'Slow treatment progress',
        lastVisit: '2024-01-13',
        recommendation: 'Consider treatment plan adjustment'
      },
      {
        name: 'Amit Patel',
        risk: 'medium',
        reason: 'Reported side effects',
        lastVisit: '2024-01-12',
        recommendation: 'Schedule consultation for treatment review'
      }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* AI Insights Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI-Powered Insights</h2>
            <p className="text-gray-600">Data-driven recommendations for better patient outcomes</p>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
          <span className="text-sm text-purple-700 font-medium">Last Updated: Just now</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-green-600">{insights.overview.treatmentSuccessRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">+5% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Patients</p>
              <p className="text-3xl font-bold text-blue-600">{insights.overview.activePatients}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-blue-600 mt-2">of {insights.overview.totalPatients} total</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Sessions</p>
              <p className="text-3xl font-bold text-purple-600">{insights.overview.averageSessionsPerPatient}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-xs text-purple-600 mt-2">Per patient</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfaction</p>
              <p className="text-3xl font-bold text-orange-600">{insights.overview.patientSatisfactionScore}</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-xs text-orange-600 mt-2">out of 5.0</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Risk Patients</p>
              <p className="text-3xl font-bold text-red-600">{insights.riskPatients.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-xs text-red-600 mt-2">Need attention</p>
        </div>
      </div>

      {/* Treatment Effectiveness */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Treatment Effectiveness Analysis</h3>
        </div>
        <div className="p-6">
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.treatmentEffectiveness}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="treatment" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'successRate' ? `${value}%` : value,
                    name === 'successRate' ? 'Success Rate' : 
                    name === 'totalPatients' ? 'Total Patients' : 'Avg Sessions'
                  ]}
                />
                <Bar dataKey="successRate" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.treatmentEffectiveness.slice(0, 3).map((treatment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">{treatment.treatment}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-medium text-green-600">{treatment.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patients:</span>
                    <span className="font-medium">{treatment.totalPatients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Sessions:</span>
                    <span className="font-medium">{treatment.avgSessions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient Progress Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Patient Progress Trends</h3>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights.patientProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    name="Completed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="improved" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    name="Improved"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="stable" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                    name="Stable"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Constitution Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Patient Constitution Distribution</h3>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <RechartsPieChart
                    data={insights.constitutionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {insights.constitutionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {insights.constitutionDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            AI Recommendations
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-gray-800">{rec.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-blue-800">Expected Impact:</p>
                  <p className="text-sm text-blue-700">{rec.impact}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Action: {rec.action}</span>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                    Implement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Patients Alert */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Patients Requiring Attention
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {insights.riskPatients.map((patient, index) => (
              <div key={index} className={`rounded-lg border p-4 ${getRiskColor(patient.risk)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{patient.name}</h4>
                    <p className="text-sm mt-1">{patient.reason}</p>
                    <p className="text-xs mt-1 opacity-75">Last visit: {patient.lastVisit}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      patient.risk === 'high' ? 'bg-red-200 text-red-800' :
                      patient.risk === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {patient.risk} risk
                    </span>
                    <p className="text-xs mt-2 font-medium">{patient.recommendation}</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                    Contact Patient
                  </button>
                  <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
