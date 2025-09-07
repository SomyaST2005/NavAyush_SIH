const express = require('express');
const router = express.Router();

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    userId: 1,
    type: 'appointment_reminder',
    title: 'Appointment Reminder',
    message: 'You have an appointment tomorrow at 10:00 AM',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 2,
    type: 'treatment_update',
    title: 'Treatment Progress',
    message: 'Your Panchakarma treatment is progressing well',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, notifications: mockNotifications });
});

router.get('/:id', (req, res) => {
  const notification = mockNotifications.find(n => n.id === parseInt(req.params.id));
  if (notification) {
    res.json({ success: true, notification });
  } else {
    res.status(404).json({ success: false, message: 'Notification not found' });
  }
});

router.put('/:id/read', (req, res) => {
  const notification = mockNotifications.find(n => n.id === parseInt(req.params.id));
  if (notification) {
    notification.read = true;
    res.json({ success: true, notification });
  } else {
    res.status(404).json({ success: false, message: 'Notification not found' });
  }
});

module.exports = router;
