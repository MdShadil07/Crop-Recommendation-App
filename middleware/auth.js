const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ---------------- JWT-based middleware for pages ----------------
const ensureAuthenticatedJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken; // make sure cookie-parser is used
    if (!token) return res.redirect("/login");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.redirect("/login");

    req.user = user; // attach user to req
    next();
  } catch (err) {
    console.error("JWT auth failed:", err);
    return res.redirect("/login");
  }
};

// ---------------- Session-based middleware ----------------
const ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  req.session.flash = { type: "error", message: "⚠️ Please login or signup first" };
  return res.redirect("/login");
};

// Ensure user is admin (session-based)
const ensureAdmin = (req, res, next) => {
  if (req.session?.user?.role === "admin") return next();
  req.session.flash = { type: "error", message: "⚠️ Admin access only" };
  return res.redirect("/dashboard");
};

// ---------------- JWT-based middleware (for APIs) ----------------
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ success: false, message: "Not authorized, no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    if (!user.isActive) return res.status(401).json({ success: false, message: "Account is deactivated" });

    if (typeof user.updateLastActive === "function") user.updateLastActive();

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired, please login again." });
    }
    console.error("Auth middleware error:", error);
    return res.status(401).json({ success: false, message: "Not authorized, token invalid" });
  }
};

// Authorize roles (JWT-based)
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: `User role ${req.user.role} is not authorized` });
  }
  next();
};

// Require verification (JWT-based)
const requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ success: false, message: "Please complete account verification to access this feature" });
  }
  next();
};

// Optional authentication (JWT-based)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.authToken;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (user && user.isActive && typeof user.updateLastActive === "function") user.updateLastActive();
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
};

// Check account lock
const checkAccountLock = (req, res, next) => {
  if (req.user?.isLocked) {
    const lockTimeRemaining = Math.ceil((req.user.lockUntil - Date.now()) / 1000 / 60);
    return res.status(423).json({
      success: false,
      message: `Account locked. Try again in ${lockTimeRemaining} minutes.`,
      lockTimeRemaining,
    });
  }
  next();
};

// Rate limit sensitive operations
const sensitiveOperationLimit = (req, res, next) => {
  const key = `${req.ip}-${req.route?.path || req.path}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  if (!global.sensitiveOperations) global.sensitiveOperations = new Map();

  const attempts = global.sensitiveOperations.get(key) || [];
  const recentAttempts = attempts.filter(time => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: "Too many attempts. Please try again later.",
      retryAfter: Math.ceil((windowMs - (now - Math.min(...recentAttempts))) / 1000),
    });
  }

  recentAttempts.push(now);
  global.sensitiveOperations.set(key, recentAttempts);
  next();
};

// Language preference
const setLanguage = (req, res, next) => {
  req.language =
    req.query.lang ||
    req.headers["accept-language"]?.split(",")[0]?.split("-")[0] ||
    req.user?.language ||
    "en";

  const supported = ["en", "hi", "mr", "ta", "te", "bn"];
  if (!supported.includes(req.language)) req.language = "en";

  next();
};

// Log user activity
const logActivity = activity => (req, res, next) => {
  if (req.user) console.log(`User Activity: ${req.user.email} - ${activity} - ${new Date().toISOString()}`);
  next();
};

module.exports = {
  ensureAuthenticated,       // session-based
  ensureAuthenticatedJWT,    // JWT-based for pages
  ensureAdmin,
  protect,                   // JWT-based for APIs
  authorize,
  requireVerification,
  optionalAuth,
  checkAccountLock,
  sensitiveOperationLimit,
  setLanguage,
  logActivity,
};
