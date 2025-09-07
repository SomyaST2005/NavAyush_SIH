import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock, User, Filter, Eye } from 'lucide-react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [showAddModal, setShowAddModal] = useState(false);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Mock appointments data
  const mockAppointments = [
    {
      id: 1,
      date: '2024-01-15',
      time: '09:00',
      duration: 60,
      patient: 'Rajesh Kumar',
      treatment: 'Abhyanga',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2024-01-15',
      time: '10:30',
      duration: 45,
      patient: 'Priya Sharma',
      treatment: 'Consultation',
      status: 'confirmed'
    },
    {
      id: 3,
      date: '2024-01-16',
      time: '14:00',
      duration: 90,
      patient: 'Amit Patel',
      treatment: 'Shirodhara',
      status: 'pending'
    },
    {
      id: 4,
      date: '2024-01-17',
      time: '11:00',
      duration: 60,
      patient: 'Sunita Gupta',
      treatment: 'Panchakarma',
      status: 'confirmed'
    },
    {
      id: 5,
      date: '2024-01-18',
      time: '15:30',
      duration: 75,
      patient: 'Vikram Singh',
      treatment: 'Swedana',
      status: 'confirmed'
    },
    {
      id: 6,
      date: '2024-01-19',
      time: '09:30',
      duration: 30,
      patient: 'Meera Reddy',
      treatment: 'Follow-up',
      status: 'pending'
    }
  ];

  useEffect(() => {
    setAppointments(mockAppointments);
  }, []);

  // Generate calendar days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = [];
  
  // Previous month's trailing days
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      date: prevMonth.getDate() - i,
      isCurrentMonth: false,
      isToday: false,
      fullDate: new Date(currentYear, currentMonth - 1, prevMonth.getDate() - i)
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    calendarDays.push({
      date: day,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      fullDate: date
    });
  }

  // Next month's leading days
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      date: day,
      isCurrentMonth: false,
      isToday: false,
      fullDate: new Date(currentYear, currentMonth + 1, day)
    });
  }

  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTreatmentColor = (treatment) => {
    const colors = {
      'Abhyanga': 'bg-blue-500',
      'Shirodhara': 'bg-purple-500',
      'Swedana': 'bg-orange-500',
      'Consultation': 'bg-green-500',
      'Panchakarma': 'bg-indigo-500',
      'Follow-up': 'bg-gray-500'
    };
    return colors[treatment] || 'bg-gray-500';
  };

  return (
    <div className="p-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 min-w-[200px] text-center">
              {formatMonthYear(currentDate)}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['month', 'week', 'day'].map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                  view === viewType
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {viewType}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Appointment</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-4 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day.fullDate);
            const isSelected = selectedDate && selectedDate.toDateString() === day.fullDate.toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 cursor-pointer transition-colors ${
                  day.isCurrentMonth 
                    ? 'bg-white hover:bg-gray-50' 
                    : 'bg-gray-50 text-gray-400'
                } ${
                  day.isToday 
                    ? 'bg-blue-50 border-blue-200' 
                    : ''
                } ${
                  isSelected 
                    ? 'bg-blue-100 border-blue-300' 
                    : ''
                }`}
                onClick={() => setSelectedDate(day.fullDate)}
              >
                <div className="flex flex-col h-full">
                  <div className={`text-sm font-medium mb-2 ${
                    day.isToday 
                      ? 'text-blue-600' 
                      : day.isCurrentMonth 
                        ? 'text-gray-900' 
                        : 'text-gray-400'
                  }`}>
                    {day.date}
                  </div>
                  
                  {/* Appointments */}
                  <div className="flex-1 space-y-1">
                    {dayAppointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`text-xs p-1 rounded text-white truncate ${getTreatmentColor(appointment.treatment)}`}
                        title={`${formatTime(appointment.time)} - ${appointment.patient} (${appointment.treatment})`}
                      >
                        {formatTime(appointment.time)} {appointment.patient}
                      </div>
                    ))}
                    
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {(() => {
            const dayAppointments = getAppointmentsForDate(selectedDate);
            
            if (dayAppointments.length === 0) {
              return (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No appointments scheduled for this day</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Schedule Appointment
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {dayAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(appointment.status)}`}></div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{formatTime(appointment.time)}</span>
                            <span className="text-gray-500">({appointment.duration} min)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{appointment.patient}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-700">{appointment.treatment}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {appointment.status}
                        </span>
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Confirmed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600">Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Cancelled</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
          <div className="text-sm text-gray-600">Total Appointments</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {appointments.filter(apt => apt.status === 'confirmed').length}
          </div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {appointments.filter(apt => apt.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {appointments.reduce((total, apt) => total + apt.duration, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Minutes</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
