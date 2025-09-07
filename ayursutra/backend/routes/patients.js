const express = require('express');
const router = express.Router();

// Mock patients data
const mockPatients = [
  {
    id: 'P001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    constitution: 'Vata-Pitta',
    currentCondition: 'Chronic joint pain, insomnia'
  },
  {
    id: 'P002',
    name: 'Priya Sharma',
    age: 32,
    gender: 'Female',
    phone: '+91 87654 32109',
    email: 'priya.sharma@email.com',
    constitution: 'Pitta-Kapha',
    currentCondition: 'Digestive issues, stress'
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, patients: mockPatients });
});

router.get('/:id', (req, res) => {
  const patient = mockPatients.find(p => p.id === req.params.id);
  if (patient) {
    res.json({ success: true, patient });
  } else {
    res.status(404).json({ success: false, message: 'Patient not found' });
  }
});

module.exports = router;
