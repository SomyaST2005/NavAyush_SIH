const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  practitioner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },
  duration: { type: Number, default: 60 },
  treatmentType: { type: String, default: 'consultation' },
  status: { type: String, enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'pending'], default: 'scheduled' },
  location: { type: String, default: '' },
  notes: { type: String, default: '' },
  isVirtual: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
