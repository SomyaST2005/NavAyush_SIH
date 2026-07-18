const Joi = require('joi');

const createPatientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  age: Joi.number().integer().min(0).max(150).allow(null),
  gender: Joi.string().valid('Male', 'Female', 'Other').allow(null),
  phone: Joi.string().trim().max(20).allow('', null),
  email: Joi.string().email().allow('', null),
  constitution: Joi.string().max(50).allow('', null),
  currentCondition: Joi.string().max(2000).allow('', null),
  userId: Joi.number().integer().positive().allow(null),
});

const updatePatientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  age: Joi.number().integer().min(0).max(150).allow(null),
  gender: Joi.string().valid('Male', 'Female', 'Other').allow(null),
  phone: Joi.string().trim().max(20).allow('', null),
  email: Joi.string().email().allow('', null),
  constitution: Joi.string().max(50).allow('', null),
  currentCondition: Joi.string().max(2000).allow('', null),
  status: Joi.string().valid('Active', 'Inactive', 'Completed'),
}).min(1);

module.exports = { createPatientSchema, updatePatientSchema };
