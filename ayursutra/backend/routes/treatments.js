const express = require('express');
const router = express.Router();

// Mock treatments data
const mockTreatments = [
  {
    id: 1,
    patientId: 'P001',
    type: 'Panchakarma',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'Active',
    sessions: 12,
    completedSessions: 8
  },
  {
    id: 2,
    patientId: 'P002',
    type: 'Abhyanga',
    startDate: '2024-01-10',
    endDate: '2024-01-25',
    status: 'Completed',
    sessions: 10,
    completedSessions: 10
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, treatments: mockTreatments });
});

router.get('/:id', (req, res) => {
  const treatment = mockTreatments.find(t => t.id === parseInt(req.params.id));
  if (treatment) {
    res.json({ success: true, treatment });
  } else {
    res.status(404).json({ success: false, message: 'Treatment not found' });
  }
});

module.exports = router;
