const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      match: [/^[+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    // Temporary PIN for first login
    tempPin: { type: String }, // hashed PIN
    mustChangePassword: { type: Boolean, default: false },

    // User Type and Role
    userType: {
      type: String,
      enum: ['farmer', 'expert'],
      required: [true, 'User type is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },

    // Verification
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Verification Codes
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    phoneVerificationCode: String,
    phoneVerificationExpire: Date,

    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Farmer Fields
    farmDetails: {
      state: { type: String, required() { return this.userType === 'farmer'; } },
      district: { type: String, required() { return this.userType === 'farmer'; } },
      fieldSize: { type: Number, required() { return this.userType === 'farmer'; } },
      crops: [{
        type: String,
        required() { return this.userType === 'farmer'; }
      }],
      farmingMethod: {
        type: String,
        enum: ['organic', 'traditional', 'hybrid'],
        required() { return this.userType === 'farmer'; },
      },
      address: String,
      pincode: String,
    },

    // Expert Fields
    expertDetails: {
      expertise: {
        type: String,
        enum: [
          'crop-science',
          'soil-science',
          'agricultural-engineering',
          'plant-pathology',
          'entomology',
          'agribusiness',
          'sustainable-agriculture',
        ],
        required() { return this.userType === 'expert'; },
      },
      experience: {
        type: String,
        enum: ['1-3', '4-7', '8-15', '15+'],
        required() { return this.userType === 'expert'; },
      },
      qualification: {
        type: String,
        enum: ['diploma', 'bachelor', 'master', 'phd'],
        required() { return this.userType === 'expert'; },
      },
      organization: String,
      licenseNumber: String,
      certifications: [String],
    },

    // Preferences
    language: {
      type: String,
      enum: ['en', 'hi', 'mr', 'ta', 'te', 'bn'],
      default: 'en',
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },

    // Security
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    lastLogin: Date,
    loginHistory: [
      {
        loginTime: { type: Date, default: Date.now },
        ipAddress: String,
        userAgent: String,
        location: String,
      },
    ],

    // Profile
    profileImage: String,
    bio: String,

    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual lock flag
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save: hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Methods
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.matchTempPin = function (enteredPin) {
  return bcrypt.compare(enteredPin, this.tempPin || '');
};

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, userType: this.userType, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Verification + reset token generators (same as your version)
userSchema.methods.getEmailVerificationToken = function () {
  const verifyToken = crypto.randomBytes(20).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  this.emailVerificationExpire = Date.now() + 10 * 60 * 1000;
  return verifyToken;
};

userSchema.methods.getPhoneVerificationCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.phoneVerificationCode = crypto.createHash('sha256').update(code).digest('hex');
  this.phoneVerificationExpire = Date.now() + 10 * 60 * 1000;
  return code;
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// Login attempts
userSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({ $unset: { lockUntil: 1 }, $set: { loginAttempts: 1 } });
  }
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= process.env.MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + process.env.LOCKOUT_TIME * 60 * 1000 };
  }
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({ $unset: { loginAttempts: 1, lockUntil: 1 } });
};

userSchema.methods.updateLastActive = function () {
  this.lastActive = Date.now();
  return this.save({ validateBeforeSave: false });
};

// Static helpers
userSchema.statics.findByEmailOrPhone = function (identifier) {
  const isEmail = identifier.includes('@');
  return this.findOne(isEmail ? { email: identifier } : { phone: identifier });
};

userSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        farmers: { $sum: { $cond: [{ $eq: ['$userType', 'farmer'] }, 1, 0] } },
        experts: { $sum: { $cond: [{ $eq: ['$userType', 'expert'] }, 1, 0] } },
        verifiedUsers: { $sum: { $cond: [{ $and: ['$isEmailVerified', '$isPhoneVerified'] }, 1, 0] } },
        activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
      },
    },
  ]);
  return stats[0] || {};
};

module.exports = mongoose.model('User', userSchema);
