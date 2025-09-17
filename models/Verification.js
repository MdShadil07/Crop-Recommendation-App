// models/Verification.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const verificationSchema = new Schema({
  identifier: { type: String, required: true }, // email or phone (store normalized)
  channel: { type: String, enum: ['email','sms'], required: true },
  purpose: { type: String, enum: ['signup','login'], required: true },
  codeHash: { type: String, required: true },
  verified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  lockedUntil: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Verification', verificationSchema);
