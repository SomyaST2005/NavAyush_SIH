const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name must not exceed 100 characters',
    'any.required': 'Full name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must not exceed 128 characters',
    'any.required': 'Password is required',
  }),
  phone: Joi.string().trim().max(20).allow('', null).messages({
    'string.max': 'Phone number must not exceed 20 characters',
  }),
  role: Joi.string().valid('patient', 'practitioner').default('patient'),
  dateOfBirth: Joi.date().iso().max('now').allow(null).messages({
    'date.max': 'Date of birth cannot be in the future',
  }),
});

module.exports = { loginSchema, registerSchema };
