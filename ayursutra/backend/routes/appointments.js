const express = require('express');
const router = express.Router();

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    date: '2024-01-20',
    time: '10:00 AM',
    type: 'Panchakarma Consultation',
    status: 'scheduled'
  },
  {
    id: 2,
    patientId: 'P002',
    patientName: 'Priya Sharma',
    date: '2024-01-20',
    time: '2:00 PM',
    type: 'Follow-up',
    status: 'completed'
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, appointments: mockAppointments });
});

router.get('/:id', (req, res) => {
  const appointment = mockAppointments.find(a => a.id === parseInt(req.params.id));
  if (appointment) {
    res.json({ success: true, appointment });
  } else {
    res.status(404).json({ success: false, message: 'Appointment not found' });
  }
});

router.post('/', (req, res) => {
  const newAppointment = {
    id: Date.now(),
    ...req.body,
    status: 'scheduled'
  };
  mockAppointments.push(newAppointment);
  res.json({ success: true, appointment: newAppointment });
});

module.exports = router;
