const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const { authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createAppointmentSchema } = require('../validators/appointmentValidator');

router.get('/', async (req, res, next) => {
  try {
    const { limit = 50, offset = 0, status, date } = req.query;
    let query = {};

    if (req.userRole === 'patient') {
      const patient = await Patient.findOne({ user: req.userId });
      if (patient) query.patient = patient._id;
      else return res.json({ success: true, appointments: [] });
    }
    if (req.userRole === 'practitioner') query.practitioner = req.userId;
    if (status) query.status = status;
    if (date) query.scheduledDate = new Date(date);

    const appointments = await Appointment.find(query)
      .populate('patient', 'name patientId')
      .populate('practitioner', 'fullName')
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .skip(parseInt(offset)).limit(parseInt(limit));

    res.json({ success: true, appointments });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('patient').populate('practitioner', 'fullName');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, appointment });
  } catch (err) { next(err); }
});

router.post('/', validate(createAppointmentSchema), async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      practitioner: req.body.practitionerId || req.userId,
      patient: req.body.patientId,
    });
    res.status(201).json({ success: true, appointment });
  } catch (err) { next(err); }
});

router.put('/:id', authorize('practitioner', 'admin'), async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, appointment });
  } catch (err) { next(err); }
});

router.put('/:id/cancel', async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, appointment });
  } catch (err) { next(err); }
});

module.exports = router;
