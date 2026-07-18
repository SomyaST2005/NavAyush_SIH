const express = require('express');
const router = express.Router();
const Treatment = require('../models/Treatment');
const Patient = require('../models/Patient');
const { authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createTreatmentSchema, updateTreatmentSchema } = require('../validators/treatmentValidator');

router.get('/', async (req, res, next) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;
    let query = {};

    if (req.userRole === 'patient') {
      const patient = await Patient.findOne({ user: req.userId });
      if (patient) query.patient = patient._id;
      else return res.json({ success: true, treatments: [] });
    }
    if (status) query.status = status;

    const treatments = await Treatment.find(query)
      .populate('patient', 'name patientId')
      .skip(parseInt(offset)).limit(parseInt(limit));

    res.json({ success: true, treatments });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const treatment = await Treatment.findById(req.params.id).populate('patient', 'name');
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });
    res.json({ success: true, treatment });
  } catch (err) { next(err); }
});

router.post('/', authorize('practitioner', 'admin'), validate(createTreatmentSchema), async (req, res, next) => {
  try {
    const treatment = await Treatment.create({ ...req.body, status: 'Active' });
    res.status(201).json({ success: true, treatment });
  } catch (err) { next(err); }
});

router.put('/:id', authorize('practitioner', 'admin'), validate(updateTreatmentSchema), async (req, res, next) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });
    res.json({ success: true, treatment });
  } catch (err) { next(err); }
});

module.exports = router;
