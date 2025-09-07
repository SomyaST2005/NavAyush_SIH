import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, User, FileText, Save, X, Edit, Trash2, Search, Filter } from 'lucide-react';

const TreatmentPlanner = () => {
  const [treatments, setTreatments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTreatment, setNewTreatment] = useState({
    patientId: '',
    patientName: '',
    treatmentType: '',
    startDate: '',
    endDate: '',
    sessions: [],
    notes: '',
    status: 'planned'
  });

  // Mock treatment plans data
  const mockTreatments = [
    {
      id: 1,
      patientId: 'P001',
      patientName: 'Rajesh Kumar',
      treatmentType: 'Panchakarma',
      startDate: '2025-01-15',
      endDate: '2025-02-15',
      status: 'active',
      progress: 60,
      sessions: [
        { id: 1, date: '2025-01-15', type: 'Consultation', duration: 45, status: 'completed', notes: 'Initial assessment completed' },
        { id: 2, date: '2025-01-17', type: 'Abhyanga', duration: 60, status: 'completed', notes: 'Full body massage with warm oil' },
        { id: 3, date: '2025-01-19', type: 'Shirodhara', duration: 90, status: 'completed', notes: 'Continuous oil pouring on forehead' },
        { id: 4, date: '2025-01-22', type: 'Swedana', duration: 30, status: 'scheduled', notes: 'Steam therapy session' },
        { id: 5, date: '2025-01-24', type: 'Virechana', duration: 120, status: 'planned', notes: 'Therapeutic purgation' }
      ],
      notes: 'Patient responding well to treatment. Vata dosha imbalance being addressed.',
      constitution: 'Vata-Pitta',
      condition: 'Chronic joint pain, insomnia'
    },
    {
      id: 2,
      patientId: 'P002',
      patientName: 'Priya Sharma',
      treatmentType: 'Abhyanga Therapy',
      startDate: '2024-01-10',
      endDate: '2024-01-31',
      status: 'active',
      progress: 75,
      sessions: [
        { id: 1, date: '2024-01-10', type: 'Consultation', duration: 30, status: 'completed', notes: 'Stress-related symptoms discussed' },
        { id: 2, date: '2024-01-12', type: 'Abhyanga', duration: 60, status: 'completed', notes: 'Relaxation massage with herbal oils' },
        { id: 3, date: '2024-01-15', type: 'Abhyanga', duration: 60, status: 'completed', notes: 'Continued therapy, good response' },
        { id: 4, date: '2024-01-18', type: 'Abhyanga', duration: 60, status: 'completed', notes: 'Stress levels reducing' }
      ],
      notes: 'Excellent progress in stress management. Patient reports better sleep.',
      constitution: 'Pitta-Kapha',
      condition: 'Stress, anxiety, muscle tension'
    },
    {
      id: 3,
      patientId: 'P003',
      patientName: 'Amit Patel',
      treatmentType: 'Shirodhara',
      startDate: '2024-01-20',
      endDate: '2024-02-10',
      status: 'planned',
      progress: 0,
      sessions: [
        { id: 1, date: '2024-01-20', type: 'Consultation', duration: 45, status: 'scheduled', notes: 'Initial assessment and treatment planning' },
        { id: 2, date: '2024-01-22', type: 'Shirodhara', duration: 90, status: 'planned', notes: 'First Shirodhara session' },
        { id: 3, date: '2024-01-25', type: 'Shirodhara', duration: 90, status: 'planned', notes: 'Second session' }
      ],
      notes: 'New patient with chronic headaches and mental fatigue.',
      constitution: 'Vata',
      condition: 'Chronic headaches, mental fatigue'
    }
  ];

  const treatmentTypes = [
    'Panchakarma',
    'Abhyanga',
    'Shirodhara',
    'Swedana',
    'Nasya',
    'Basti',
    'Virechana',
    'Consultation',
    'Follow-up'
  ];

  const sessionTypes = [
    'Consultation',
    'Abhyanga',
    'Shirodhara',
    'Swedana',
    'Nasya',
    'Basti',
    'Virechana',
    'Follow-up'
  ];

  useEffect(() => {
    setTreatments(mockTreatments);
  }, []);

  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = treatment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         treatment.treatmentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || treatment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddTreatment = () => {
    const treatment = {
      ...newTreatment,
      id: treatments.length + 1,
      progress: 0,
      sessions: []
    };
    setTreatments([...treatments, treatment]);
    setNewTreatment({
      patientId: '',
      patientName: '',
      treatmentType: '',
      startDate: '',
      endDate: '',
      sessions: [],
      notes: '',
      status: 'planned'
    });
    setShowAddModal(false);
  };

  const addSessionToTreatment = (treatmentId, session) => {
    setTreatments(treatments.map(treatment => 
      treatment.id === treatmentId 
        ? { ...treatment, sessions: [...treatment.sessions, { ...session, id: Date.now() }] }
        : treatment
    ));
  };

  const updateSessionStatus = (treatmentId, sessionId, status) => {
    setTreatments(treatments.map(treatment => 
      treatment.id === treatmentId 
        ? {
            ...treatment,
            sessions: treatment.sessions.map(session =>
              session.id === sessionId ? { ...session, status } : session
            )
          }
        : treatment
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Treatment Planner</h2>
          <p className="text-gray-600">Plan and manage patient treatment schedules</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Treatment Plan</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or treatment type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Treatment Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTreatments.map((treatment) => (
          <div key={treatment.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{treatment.patientName}</h3>
                  <p className="text-sm text-gray-600">{treatment.treatmentType}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(treatment.status)}`}>
                    {treatment.status}
                  </span>
                  <button
                    onClick={() => setSelectedTreatment(treatment)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{treatment.startDate} - {treatment.endDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{treatment.constitution} • {treatment.condition}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{treatment.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(treatment.progress)}`}
                    style={{ width: `${treatment.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Sessions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Upcoming Sessions</h4>
                {treatment.sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        session.status === 'completed' ? 'bg-green-500' :
                        session.status === 'scheduled' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{session.type}</p>
                        <p className="text-xs text-gray-600">{session.date} • {session.duration}min</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                ))}
                {treatment.sessions.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{treatment.sessions.length - 3} more sessions
                  </p>
                )}
              </div>

              {treatment.notes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{treatment.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Treatment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">New Treatment Plan</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={newTreatment.patientName}
                    onChange={(e) => setNewTreatment({...newTreatment, patientName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Type</label>
                  <select
                    value={newTreatment.treatmentType}
                    onChange={(e) => setNewTreatment({...newTreatment, treatmentType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select treatment type</option>
                    {treatmentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newTreatment.startDate}
                    onChange={(e) => setNewTreatment({...newTreatment, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newTreatment.endDate}
                    onChange={(e) => setNewTreatment({...newTreatment, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newTreatment.notes}
                  onChange={(e) => setNewTreatment({...newTreatment, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Treatment notes and observations..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTreatment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Treatment Detail Modal */}
      {selectedTreatment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedTreatment.patientName} - {selectedTreatment.treatmentType}
              </h3>
              <button
                onClick={() => setSelectedTreatment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Sessions</h4>
                <div className="space-y-3">
                  {selectedTreatment.sessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            session.status === 'completed' ? 'bg-green-500' :
                            session.status === 'scheduled' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          }`}></div>
                          <h5 className="font-medium text-gray-800">{session.type}</h5>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                          {session.status === 'scheduled' && (
                            <button
                              onClick={() => updateSessionStatus(selectedTreatment.id, session.id, 'completed')}
                              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{session.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{session.duration} min</span>
                        </span>
                      </div>
                      {session.notes && (
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{session.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Treatment Info</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedTreatment.status)}`}>
                          {selectedTreatment.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-medium">{selectedTreatment.progress}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Constitution:</span>
                        <span className="font-medium">{selectedTreatment.constitution}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Condition</h5>
                    <p className="text-sm text-gray-700">{selectedTreatment.condition}</p>
                  </div>

                  {selectedTreatment.notes && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-medium text-blue-800 mb-2">Notes</h5>
                      <p className="text-sm text-blue-700">{selectedTreatment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentPlanner;
