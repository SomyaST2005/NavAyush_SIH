const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  type: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null },
  status: { type: String, enum: ['Active', 'Completed', 'On Hold', 'Cancelled'], default: 'Active' },
  totalSessions: { type: Number, default: null },
  completedSessions: { type: Number, default: 0 },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Treatment', treatmentSchema);
