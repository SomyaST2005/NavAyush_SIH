import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Clock, DollarSign, Activity, Download, Filter, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Cell, AreaChart, Area } from 'recharts';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  // Mock analytics data
  const mockAnalytics = {
    overview: {
      totalRevenue: 125000,
      totalPatients: 127,
      totalAppointments: 456,
      averageSessionDuration: 75,
      patientRetentionRate: 89,
      cancellationRate: 8.5
    },
    revenueData: [
      { month: 'Jul', revenue: 18000, appointments: 65 },
      { month: 'Aug', revenue: 22000, appointments: 78 },
      { month: 'Sep', revenue: 25000, appointments: 85 },
      { month: 'Oct', revenue: 28000, appointments: 92 },
      { month: 'Nov', revenue: 24000, appointments: 88 },
      { month: 'Dec', revenue: 32000, appointments: 108 }
    ],
    treatmentRevenue: [
      { name: 'Panchakarma', value: 45000, sessions: 120, color: '#8B5CF6' },
      { name: 'Abhyanga', value: 28000, sessions: 180, color: '#3B82F6' },
      { name: 'Shirodhara', value: 22000, sessions: 95, color: '#10B981' },
      { name: 'Consultation', value: 18000, sessions: 240, color: '#F59E0B' },
      { name: 'Swedana', value: 12000, sessions: 85, color: '#EF4444' }
    ],
    patientFlow: [
      { time: '8:00', patients: 2 },
      { time: '9:00', patients: 5 },
      { time: '10:00', patients: 8 },
      { time: '11:00', patients: 12 },
      { time: '12:00', patients: 6 },
      { time: '13:00', patients: 3 },
      { time: '14:00', patients: 9 },
      { time: '15:00', patients: 11 },
      { time: '16:00', patients: 8 },
      { time: '17:00', patients: 5 },
      { time: '18:00', patients: 2 }
    ],
    treatmentEffectiveness: [
      { treatment: 'Panchakarma', satisfaction: 4.8, completion: 95, improvement: 92 },
      { treatment: 'Abhyanga', satisfaction: 4.6, completion: 88, improvement: 85 },
      { treatment: 'Shirodhara', satisfaction: 4.7, completion: 92, improvement: 89 },
      { treatment: 'Consultation', satisfaction: 4.5, completion: 98, improvement: 78 },
      { treatment: 'Swedana', satisfaction: 4.4, completion: 85, improvement: 82 }
    ],
    monthlyGrowth: [
      { month: 'Jan', newPatients: 12, returningPatients: 28, revenue: 32000 },
      { month: 'Feb', newPatients: 15, returningPatients: 32, revenue: 35000 },
      { month: 'Mar', newPatients: 18, returningPatients: 35, revenue: 38000 },
      { month: 'Apr', newPatients: 22, returningPatients: 38, revenue: 42000 },
      { month: 'May', newPatients: 25, returningPatients: 42, revenue: 45000 },
      { month: 'Jun', newPatients: 28, returningPatients: 45, revenue: 48000 }
    ]
  };

  const [analytics, setAnalytics] = useState(mockAnalytics);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 800);
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const exportData = () => {
    // Mock export functionality
    alert('Analytics data exported successfully!');
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
            <p className="text-gray-600">Practice performance insights and metrics</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.overview.totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">+12% from last period</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.overview.totalPatients}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-blue-600 mt-2">+8 new this month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Appointments</p>
              <p className="text-2xl font-bold text-purple-600">{analytics.overview.totalAppointments}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-xs text-purple-600 mt-2">This period</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-orange-600">{analytics.overview.averageSessionDuration}m</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-xs text-orange-600 mt-2">Per session</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Retention Rate</p>
              <p className="text-2xl font-bold text-teal-600">{analytics.overview.patientRetentionRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-teal-500" />
          </div>
          <p className="text-xs text-teal-600 mt-2">+3% improvement</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancellation</p>
              <p className="text-2xl font-bold text-red-600">{analytics.overview.cancellationRate}%</p>
            </div>
            <Activity className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-xs text-red-600 mt-2">-2% from last month</p>
        </div>
      </div>

      {/* Revenue and Appointments Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Revenue & Appointments Trend</h3>
        </div>
        <div className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis yAxisId="revenue" orientation="left" stroke="#6b7280" fontSize={12} />
                <YAxis yAxisId="appointments" orientation="right" stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : value,
                    name === 'revenue' ? 'Revenue' : 'Appointments'
                  ]}
                />
                <Area
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                />
                <Line
                  yAxisId="appointments"
                  type="monotone"
                  dataKey="appointments"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Treatment Revenue Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Revenue by Treatment</h3>
          </div>
          <div className="p-6">
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  <PieChart
                    data={analytics.treatmentRevenue}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {analytics.treatmentRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </PieChart>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {analytics.treatmentRevenue.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(item.value)}</div>
                    <div className="text-xs text-gray-500">{item.sessions} sessions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Flow by Hour */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Daily Patient Flow</h3>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.patientFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip formatter={(value) => [value, 'Patients']} />
                  <Bar dataKey="patients" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Peak hours: <span className="font-medium text-gray-800">10:00 AM - 12:00 PM</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Effectiveness */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Treatment Effectiveness Metrics</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Treatment</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Satisfaction</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Completion Rate</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Improvement Rate</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Performance</th>
                </tr>
              </thead>
              <tbody>
                {analytics.treatmentEffectiveness.map((treatment, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-800">{treatment.treatment}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{treatment.satisfaction}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        treatment.completion >= 90 ? 'bg-green-100 text-green-700' :
                        treatment.completion >= 80 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {treatment.completion}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        treatment.improvement >= 85 ? 'bg-green-100 text-green-700' :
                        treatment.improvement >= 75 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {treatment.improvement}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            treatment.improvement >= 85 ? 'bg-green-500' :
                            treatment.improvement >= 75 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${treatment.improvement}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Growth Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Patient Growth & Revenue Trends</h3>
        </div>
        <div className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis yAxisId="patients" orientation="left" stroke="#6b7280" fontSize={12} />
                <YAxis yAxisId="revenue" orientation="right" stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : value,
                    name === 'newPatients' ? 'New Patients' :
                    name === 'returningPatients' ? 'Returning Patients' : 'Revenue'
                  ]}
                />
                <Line
                  yAxisId="patients"
                  type="monotone"
                  dataKey="newPatients"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name="newPatients"
                />
                <Line
                  yAxisId="patients"
                  type="monotone"
                  dataKey="returningPatients"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="returningPatients"
                />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 5 }}
                  name="revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
