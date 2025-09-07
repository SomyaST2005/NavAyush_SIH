import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock, MapPin } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';

const AppointmentCalendar = () => {
  const { appointments, loading } = useAppointments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month'); // 'month' or 'week'

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
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
  const remainingDays = 42 - calendarDays.length; // 6 rows × 7 days
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      date: day,
      isCurrentMonth: false,
      isToday: false,
      fullDate: new Date(currentYear, currentMonth + 1, day)
    });
  }

  const getAppointmentsForDate = (date) => {
    if (!appointments) return [];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.scheduledDate);
      return aptDate.toDateString() === date.toDateString();
    });
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
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDayAppointmentIndicator = (dayAppointments) => {
    if (dayAppointments.length === 0) return null;
    
    const colors = {
      confirmed: 'bg-green-500',
      pending: 'bg-yellow-500',
      cancelled: 'bg-red-500'
    };

    return (
      <div className="flex justify-center mt-1 space-x-1">
        {dayAppointments.slice(0, 3).map((apt, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full ${colors[apt.status] || 'bg-blue-500'}`}
          />
        ))}
        {dayAppointments.length > 3 && (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {formatMonthYear(currentDate)}
          </h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
          <Plus className="h-4 w-4" />
          <span>Book</span>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
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
                className={`min-h-[80px] p-2 border-r border-b border-gray-200 last:border-r-0 cursor-pointer transition-colors ${
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
                  <div className={`text-sm font-medium ${
                    day.isToday 
                      ? 'text-blue-600' 
                      : day.isCurrentMonth 
                        ? 'text-gray-900' 
                        : 'text-gray-400'
                  }`}>
                    {day.date}
                  </div>
                  
                  {/* Appointment indicators */}
                  {getDayAppointmentIndicator(dayAppointments)}
                  
                  {/* First appointment preview */}
                  {dayAppointments.length > 0 && day.isCurrentMonth && (
                    <div className="mt-1 flex-1">
                      <div className="text-xs p-1 bg-blue-100 text-blue-700 rounded truncate">
                        {formatTime(dayAppointments[0].scheduledTime)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          
          {(() => {
            const dayAppointments = getAppointmentsForDate(selectedDate);
            
            if (dayAppointments.length === 0) {
              return (
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No appointments scheduled</p>
                  <button className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
                    Schedule Appointment
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {dayAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800 capitalize">
                          {appointment.treatmentType?.replace('_', ' ')}
                        </h5>
                        <div className="mt-1 space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(appointment.scheduledTime)} ({appointment.duration} min)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>Dr. {appointment.practitioner?.fullName}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
