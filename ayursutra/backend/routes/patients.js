const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Treatment = require('../models/Treatment');
const { authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createPatientSchema, updatePatientSchema } = require('../validators/patientValidator');

router.get('/', async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    let query = {};
    if (req.userRole === 'patient') query.user = req.userId;
    if (req.userRole === 'practitioner') query.practitioner = req.userId;

    const patients = await Patient.find(query).skip(parseInt(offset)).limit(parseInt(limit)).populate('user', 'fullName email');
    res.json({ success: true, patients });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', 'fullName email').populate('practitioner', 'fullName');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    if (req.userRole === 'patient' && patient.user?._id?.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const [appointments, treatments] = await Promise.all([
      Appointment.find({ patient: patient._id }).populate('practitioner', 'fullName'),
      Treatment.find({ patient: patient._id }),
    ]);

    res.json({ success: true, patient: { ...patient.toObject(), appointments, treatments } });
  } catch (err) { next(err); }
});

router.post('/', authorize('practitioner', 'admin'), validate(createPatientSchema), async (req, res, next) => {
  try {
    const patient = await Patient.create({
      ...req.body,
      patientId: `P${Date.now().toString(36).toUpperCase()}`,
      practitioner: req.userId,
      status: 'Active',
    });
    res.status(201).json({ success: true, patient });
  } catch (err) { next(err); }
});

router.put('/:id', authorize('practitioner', 'admin'), validate(updatePatientSchema), async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, patient });
  } catch (err) { next(err); }
});

module.exports = router;
