const Joi = require('joi');

const createAppointmentSchema = Joi.object({
  patientId: Joi.string().required().messages({
    'any.required': 'Patient ID is required',
  }),
  practitionerId: Joi.number().integer().positive().optional(),
  scheduledDate: Joi.date().iso().required().messages({
    'date.format': 'Scheduled date must be a valid date',
    'any.required': 'Scheduled date is required',
  }),
  scheduledTime: Joi.string().required().messages({
    'any.required': 'Scheduled time is required',
  }),
  duration: Joi.number().integer().min(15).max(480).default(60),
  treatmentType: Joi.string().max(100).default('consultation'),
  location: Joi.string().max(255).allow('', null),
  notes: Joi.string().max(2000).allow('', null),
  isVirtual: Joi.boolean().default(false),
});

module.exports = { createAppointmentSchema };
