const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  practitioner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true, trim: true },
  age: { type: Number, default: null },
  gender: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  constitution: { type: String, default: '' },
  currentCondition: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive', 'Completed'], default: 'Active' },
  nextAppointment: { type: Date, default: null },
  lastVisit: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
