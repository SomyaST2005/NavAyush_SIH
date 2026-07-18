const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, trim: true, default: '' },
  role: { type: String, enum: ['patient', 'practitioner', 'admin'], default: 'patient' },
  refreshToken: { type: String, default: null },
  refreshTokenExpires: { type: Date, default: null },
  dateOfBirth: { type: Date, default: null },
}, { timestamps: true });

// Exclude sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  delete obj.refreshTokenExpires;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
