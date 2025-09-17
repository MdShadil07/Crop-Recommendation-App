const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated. Please contact support.'
        });
      }

      // Update last active
      req.user.updateLastActive();

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user is verified
const requireVerification = (req, res, next) => {
  if (!req.user.isEmailVerified || !req.user.isPhoneVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please complete email and phone verification to access this feature',
      verification: {
        email: req.user.isEmailVerified,
        phone: req.user.isPhoneVerified
      }
    });
  }
  next();
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (req.user && req.user.isActive) {
        req.user.updateLastActive();
      }
    } catch (error) {
      // Token invalid, but continue without user
      req.user = null;
    }
  }

  next();
};

// Check if account is locked
const checkAccountLock = (req, res, next) => {
  if (req.user && req.user.isLocked) {
    const lockTimeRemaining = Math.ceil((req.user.lockUntil - Date.now()) / 1000 / 60);
    return res.status(423).json({
      success: false,
      message: `Account is temporarily locked due to too many failed login attempts. Try again in ${lockTimeRemaining} minutes.`,
      lockTimeRemaining
    });
  }
  next();
};

// Rate limiting middleware for sensitive operations
const sensitiveOperationLimit = (req, res, next) => {
  // This could be enhanced with Redis for distributed systems
  // For now, using in-memory tracking
  
  const key = `${req.ip}-${req.route?.path || req.path}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (!global.sensitiveOperations) {
    global.sensitiveOperations = new Map();
  }

  const attempts = global.sensitiveOperations.get(key) || [];
  const recentAttempts = attempts.filter(time => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Too many attempts. Please try again later.',
      retryAfter: Math.ceil((windowMs - (now - Math.min(...recentAttempts))) / 1000)
    });
  }

  recentAttempts.push(now);
  global.sensitiveOperations.set(key, recentAttempts);

  next();
};

// Middleware to extract user preference language
const setLanguage = (req, res, next) => {
  // Priority: URL param > Header > User preference > Default
  req.language = req.query.lang || 
                 req.headers['accept-language']?.split(',')[0]?.split('-')[0] ||
                 req.user?.language ||
                 'en';

  // Validate language
  const supportedLanguages = ['en', 'hi', 'mr', 'ta', 'te', 'bn'];
  if (!supportedLanguages.includes(req.language)) {
    req.language = 'en';
  }

  next();
};

// Middleware to log user activities
const logActivity = (activity) => {
  return (req, res, next) => {
    if (req.user) {
      // This could be enhanced to store in database
      console.log(`User Activity: ${req.user.email} - ${activity} - ${new Date().toISOString()}`);
      
      // You could add to user's activity log
      // req.user.activityLog.push({
      //   activity,
      //   timestamp: new Date(),
      //   ip: req.ip,
      //   userAgent: req.headers['user-agent']
      // });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
  requireVerification,
  optionalAuth,
  checkAccountLock,
  sensitiveOperationLimit,
  setLanguage,
  logActivity
};