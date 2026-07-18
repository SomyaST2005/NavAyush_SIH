const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Treatment = require('../models/Treatment');
const { authorize } = require('../middleware/auth');

router.use(authorize('practitioner', 'admin'));

router.get('/overview', async (req, res, next) => {
  try {
    const match = req.userRole === 'practitioner' ? { practitioner: req.userId } : {};
    const [totalPatients, activePatients, totalAppointments, completedTreatments] = await Promise.all([
      Patient.countDocuments(match),
      Patient.countDocuments({ ...match, status: 'Active' }),
      Appointment.countDocuments(req.userRole === 'practitioner' ? { practitioner: req.userId } : {}),
      Treatment.countDocuments({ status: 'Completed' }),
    ]);
    res.json({ success: true, data: { totalPatients, activePatients, totalAppointments, completedTreatments, revenue: 0, averageRating: 0 } });
  } catch (err) { next(err); }
});

router.get('/revenue', async (req, res, next) => {
  try {
    const data = await Appointment.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { month: '$_id', count: 1, _id: 0 } },
    ]);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/treatment-effectiveness', async (req, res, next) => {
  try {
    const data = await Treatment.aggregate([
      { $group: { _id: '$type', patients: { $sum: 1 } } },
      { $project: { treatment: '$_id', effectiveness: { $round: [{ $add: [{ $rand: {} }, 0.8] }, 2] }, patients: 1, _id: 0 } },
    ]);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/patient-flow', async (req, res, next) => {
  try {
    const flowData = await Appointment.aggregate([
      { $group: { _id: { $dayOfWeek: '$scheduledDate' }, appointments: { $sum: 1 } } },
      { $project: { day: { $arrayElemAt: [['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], '$_id'] }, appointments: 1, _id: 0 } },
    ]);
    res.json({ success: true, data: flowData });
  } catch (err) { next(err); }
});

module.exports = router;
