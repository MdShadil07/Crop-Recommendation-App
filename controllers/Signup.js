const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT helper
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Send auth cookie
const sendAuthCookie = (res, token) => {
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // false for localhost
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// OTP helper
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// ----------------- SIGNUP (Send OTP) -----------------
exports.signup = async (req, res) => {
  try {
    const { personal, userType, farm, expert, verificationMethod } = req.body;
    if (!personal?.firstName || !personal?.lastName || !personal?.email)
      return res.status(400).json({ success: false, message: 'Fill all required fields.' });

    const existingUser = await User.findOne({ email: personal.email.toLowerCase() });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered.' });

    const otp = generateOtp();
    req.app.locals.otpSessions = req.app.locals.otpSessions || {};
    const sessionId = Date.now().toString();
    req.app.locals.otpSessions[sessionId] = {
      personal,
      userType,
      farm,
      expert,
      otp,
      createdAt: Date.now(),
    };

    // Send OTP
    if (verificationMethod === "email") {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: `"AgriAI Support" <${process.env.EMAIL_USER}>`,
        to: personal.email,
        subject: 'Your AgriAI Verification OTP',
        html: `<p>Your OTP is <b>${otp}</b>. Expires in 5 min.</p>`
      });
    }

    res.status(200).json({ success: true, message: 'OTP sent', sessionId });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Signup failed', error: err.message });
  }
};

// ----------------- VERIFY OTP -----------------
exports.verifyOtp = async (req, res) => {
  try {
    const { sessionId, otp, password, confirmPassword } = req.body;
    const session = (req.app.locals.otpSessions || {})[sessionId];
    if (!session) return res.status(400).json({ success: false, message: 'Invalid OTP session.' });

    if (String(session.otp) !== String(otp))
      return res.status(400).json({ success: false, message: 'Incorrect OTP.' });

    if (!password || password !== confirmPassword)
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName: session.personal.firstName.trim(),
      lastName: session.personal.lastName.trim(),
      email: session.personal.email.toLowerCase(),
      phone: session.personal.phone?.trim(),
      password: hashedPassword,
      userType: session.userType,
      farmDetails: session.userType === "farmer" ? session.farm : undefined,
      expertDetails: session.userType === "expert" ? session.expert : undefined,
      isVerified: true,
    });

    const token = generateToken(user._id);
    sendAuthCookie(res, token);

    delete req.app.locals.otpSessions[sessionId]; // cleanup

    res.status(200).json({ success: true, message: 'Account created', token, redirectUrl: "/dashboard" });

  } catch (err) {
    res.status(500).json({ success: false, message: 'OTP verification failed', error: err.message });
  }
};

// ----------------- LOGIN -----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = generateToken(user._id);
    sendAuthCookie(res, token);

    res.status(200).json({ success: true, message: 'Login successful', token, redirectUrl: "/dashboard" });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};
