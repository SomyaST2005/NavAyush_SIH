const express = require('express');
const router = express.Router();

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalPatients: 156,
    activePatients: 89,
    totalAppointments: 342,
    completedTreatments: 78,
    revenue: 245000,
    averageRating: 4.8
  },
  revenueData: [
    { month: 'Jan', revenue: 18000, patients: 25 },
    { month: 'Feb', revenue: 22000, patients: 32 },
    { month: 'Mar', revenue: 25000, patients: 38 },
    { month: 'Apr', revenue: 28000, patients: 42 },
    { month: 'May', revenue: 32000, patients: 48 },
    { month: 'Jun', revenue: 35000, patients: 52 }
  ],
  treatmentEffectiveness: [
    { treatment: 'Panchakarma', effectiveness: 92, patients: 45 },
    { treatment: 'Abhyanga', effectiveness: 88, patients: 67 },
    { treatment: 'Shirodhara', effectiveness: 94, patients: 34 },
    { treatment: 'Udvartana', effectiveness: 86, patients: 28 }
  ],
  patientFlow: [
    { day: 'Mon', appointments: 12, completed: 11 },
    { day: 'Tue', appointments: 15, completed: 14 },
    { day: 'Wed', appointments: 18, completed: 17 },
    { day: 'Thu', appointments: 14, completed: 13 },
    { day: 'Fri', appointments: 16, completed: 15 },
    { day: 'Sat', appointments: 10, completed: 9 }
  ]
};

router.get('/overview', (req, res) => {
  res.json({ success: true, data: mockAnalytics.overview });
});

router.get('/revenue', (req, res) => {
  res.json({ success: true, data: mockAnalytics.revenueData });
});

router.get('/treatment-effectiveness', (req, res) => {
  res.json({ success: true, data: mockAnalytics.treatmentEffectiveness });
});

router.get('/patient-flow', (req, res) => {
  res.json({ success: true, data: mockAnalytics.patientFlow });
});

module.exports = router;
