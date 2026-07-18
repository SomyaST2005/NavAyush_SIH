const Joi = require('joi');

const createTreatmentSchema = Joi.object({
  patientId: Joi.string().required(),
  type: Joi.string().max(100).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).allow(null).messages({
    'date.min': 'End date must be after start date',
  }),
  totalSessions: Joi.number().integer().min(1).allow(null),
  notes: Joi.string().max(2000).allow('', null),
});

const updateTreatmentSchema = Joi.object({
  type: Joi.string().max(100),
  endDate: Joi.date().iso().allow(null),
  status: Joi.string().valid('Active', 'Completed', 'On Hold', 'Cancelled'),
  totalSessions: Joi.number().integer().min(1).allow(null),
  completedSessions: Joi.number().integer().min(0).allow(null),
  notes: Joi.string().max(2000).allow('', null),
}).min(1);

module.exports = { createTreatmentSchema, updateTreatmentSchema };
