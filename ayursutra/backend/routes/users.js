const express = require('express');
const router = express.Router();

// Mock users data
const mockUsers = [
  { id: 1, name: 'Dr. Ayurveda Sharma', email: 'doctor@ayursutra.com', role: 'practitioner' },
  { id: 2, name: 'Rajesh Kumar', email: 'patient@ayursutra.com', role: 'patient' }
];

router.get('/', (req, res) => {
  res.json({ success: true, users: mockUsers });
});

router.get('/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

module.exports = router;
