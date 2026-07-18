import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock, User, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ patient: '', treatment: '', date: '', time: '10:00', duration: 60 });

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const mockAppointments = useMemo(() => [
    { id: 1, date: '2024-01-15', time: '09:00', duration: 60, patient: 'Rajesh Kumar', treatment: 'Abhyanga', status: 'confirmed' },
    { id: 2, date: '2024-01-15', time: '10:30', duration: 45, patient: 'Priya Sharma', treatment: 'Consultation', status: 'confirmed' },
    { id: 3, date: '2024-01-16', time: '14:00', duration: 90, patient: 'Amit Patel', treatment: 'Shirodhara', status: 'pending' },
    { id: 4, date: '2024-01-17', time: '11:00', duration: 60, patient: 'Sunita Gupta', treatment: 'Panchakarma', status: 'confirmed' },
    { id: 5, date: '2024-01-18', time: '15:30', duration: 75, patient: 'Vikram Singh', treatment: 'Swedana', status: 'confirmed' },
    { id: 6, date: '2024-01-19', time: '09:30', duration: 30, patient: 'Meera Reddy', treatment: 'Follow-up', status: 'pending' },
  ], []);

  useEffect(() => { setAppointments(mockAppointments); }, [mockAppointments]);

  const handleAddAppointment = () => {
    if (!newAppointment.patient.trim()) { toast.error('Patient name is required'); return; }
    const aptDate = newAppointment.date || new Date().toISOString().split('T')[0];
    const newApt = { id: Date.now(), date: aptDate, time: newAppointment.time + ':00', duration: newAppointment.duration, patient: newAppointment.patient, treatment: newAppointment.treatment || 'Consultation', status: 'confirmed' };
    setAppointments(prev => [...prev, newApt]);
    toast.success(`Appointment for ${newAppointment.patient} created`);
    setShowAddModal(false);
    setNewAppointment({ patient: '', treatment: '', date: '', time: '10:00', duration: 60 });
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({ date: prevMonth.getDate() - i, isCurrentMonth: false, isToday: false, fullDate: new Date(currentYear, currentMonth - 1, prevMonth.getDate() - i) });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    calendarDays.push({ date: day, isCurrentMonth: true, isToday: date.toDateString() === today.toDateString(), fullDate: date });
  }
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({ date: day, isCurrentMonth: false, isToday: false, fullDate: new Date(currentYear, currentMonth + 1, day) });
  }

  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours), ampm = hour >= 12 ? 'PM' : 'AM', displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTreatmentColor = (treatment) => {
    const colors = { 'Abhyanga': 'bg-blue-500', 'Shirodhara': 'bg-purple-500', 'Swedana': 'bg-orange-500', 'Consultation': 'bg-green-500', 'Panchakarma': 'bg-indigo-500', 'Follow-up': 'bg-gray-500' };
    return colors[treatment] || 'bg-gray-500';
  };

  const formatMonthYear = (date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() - 1); setCurrentDate(d); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Previous month"><ChevronLeft className="h-5 w-5 text-gray-600" /></button>
            <h2 className="text-xl font-semibold text-gray-800 min-w-[200px] text-center">{formatMonthYear(currentDate)}</h2>
            <button onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() + 1); setCurrentDate(d); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Next month"><ChevronRight className="h-5 w-5 text-gray-600" /></button>
          </div>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Today</button>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['month', 'week', 'day'].map((vt) => (
              <button key={vt} onClick={() => setView(vt)} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${view === vt ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>{vt}</button>
            ))}
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"><Plus className="h-4 w-4" /><span>Add Appointment</span></button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (<div key={day} className="p-4 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">{day}</div>))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day.fullDate);
            return (
              <div key={index} className={`min-h-[100px] p-2 border-r border-b border-gray-200 cursor-pointer transition-colors ${day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'} ${day.isToday ? 'bg-blue-50' : ''}`} onClick={() => setSelectedDate(day.fullDate)}>
                <div className={`text-sm font-medium mb-1 ${day.isToday ? 'text-blue-600' : ''}`}>{day.date}</div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((apt) => (
                    <div key={apt.id} className={`text-xs p-1 rounded text-white truncate ${getTreatmentColor(apt.treatment)}`} title={`${formatTime(apt.time)} - ${apt.patient}`}>{formatTime(apt.time)} {apt.patient}</div>
                  ))}
                  {dayAppointments.length > 3 && <div className="text-xs text-gray-500 font-medium">+{dayAppointments.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
          {(() => {
            const dayAppts = getAppointmentsForDate(selectedDate);
            if (dayAppts.length === 0) return <div className="text-center py-8"><Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-500 mb-4">No appointments for this day</p><button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Schedule Appointment</button></div>;
            return <div className="space-y-3">{dayAppts.sort((a,b) => a.time.localeCompare(b.time)).map((apt) => (<div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div className="flex items-center space-x-4"><div><div className="flex items-center space-x-2 mb-1"><Clock className="h-4 w-4 text-gray-500" /><span className="font-medium">{formatTime(apt.time)}</span><span className="text-gray-500">({apt.duration} min)</span></div><div className="flex items-center space-x-2"><User className="h-4 w-4 text-gray-500" /><span>{apt.patient}</span><span className="text-gray-500">•</span><span>{apt.treatment}</span></div></div></div><span className={`px-2 py-1 text-xs font-medium rounded-full ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{apt.status}</span></div>))}</div>;
          })()}
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between"><h3 className="font-semibold text-gray-800">Add New Appointment</h3><button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button></div>
            <div className="p-4 space-y-3">
              <input type="text" placeholder="Patient Name" value={newAppointment.patient} onChange={(e) => setNewAppointment({...newAppointment, patient: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Treatment (e.g. Abhyanga)" value={newAppointment.treatment} onChange={(e) => setNewAppointment({...newAppointment, treatment: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" />
              <input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" />
              <input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" />
              <input type="number" placeholder="Duration (minutes)" value={newAppointment.duration} onChange={(e) => setNewAppointment({...newAppointment, duration: parseInt(e.target.value) || 60})} className="w-full p-2 border border-gray-300 rounded-lg" />
              <button onClick={handleAddAppointment} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">Create Appointment</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-blue-600">{appointments.length}</div><div className="text-sm text-gray-600">Total</div></div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-green-600">{appointments.filter(a => a.status === 'confirmed').length}</div><div className="text-sm text-gray-600">Confirmed</div></div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-yellow-600">{appointments.filter(a => a.status === 'pending').length}</div><div className="text-sm text-gray-600">Pending</div></div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-purple-600">{appointments.reduce((t, a) => t + a.duration, 0)}</div><div className="text-sm text-gray-600">Total Minutes</div></div>
      </div>
    </div>
  );
};

export default CalendarView;
