const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const REDIRECT_BASE = "http://localhost:5000";

/* ----------------- JWT & Cookie Helpers ----------------- */
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sendAuthCookie = (res, token) => {
  console.log("📦 Sending auth cookie...");
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/* ----------------- OTP Generation ----------------- */
router.post("/send-otp", async (req, res) => {
  try {
    console.log("🔹 /send-otp called with body:", req.body);
    const { contact, method } = req.body;
    if (!contact || !method)
      return res.status(400).json({ success: false, message: "Contact and method are required." });

    const otpPlain = String(Math.floor(100000 + Math.random() * 900000));
    console.log("Generated OTP:", otpPlain);

    const hashedOtp = await bcrypt.hash(otpPlain, 10);

    req.app.locals.otpSessions = req.app.locals.otpSessions || {};
    const sessionId = Date.now().toString();
    req.app.locals.otpSessions[sessionId] = { contact, method, hashedOtp, createdAt: Date.now() };
    console.log("Created OTP session:", sessionId);

    if (method === "email") {
      console.log("Sending OTP via email...");
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: `"AgriAI Support" <${process.env.EMAIL_USER}>`,
        to: contact,
        subject: "AgriAI — Verify your email with this OTP",
        html: `<p>Your verification code: <b>${otpPlain}</b></p>`,
      });
    }

    res.status(200).json({ success: true, message: `OTP sent via ${method}.`, sessionId });
  } catch (err) {
    console.error("❌ Error in /send-otp:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP.", error: err.message });
  }
});

/* ----------------- OTP Verification ----------------- */
const verifyPinHandler = async (req, res) => {
  try {
    console.log("🔹 /verify-otp called with body:", req.body);
    const { sessionId, pin } = req.body;

    if (!sessionId || !pin)
      return res.status(400).json({ success: false, message: "Missing sessionId or OTP." });

    const session = (req.app.locals.otpSessions || {})[sessionId];
    if (!session)
      return res.status(400).json({ success: false, message: "Invalid or expired OTP session." });

    const isMatch = await bcrypt.compare(pin, session.hashedOtp);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid OTP." });

    console.log("✅ OTP verified successfully for contact:", session.contact);

    // Do NOT create user yet, just respond success
    res.status(200).json({ success: true, message: "OTP verified successfully." });
  } catch (err) {
    console.error("❌ OTP verification error:", err);
    res.status(500).json({ success: false, message: "PIN verification failed.", error: err.message });
  }
};


router.post("/verify-pin", verifyPinHandler);
router.post("/verify-otp", (req, res) => {
  req.body.pin = req.body.otp;
  verifyPinHandler(req, res);
});

/* ----------------- Signup ----------------- */
router.post("/signup", async (req, res) => {
  try {
    console.log("🔹 /signup called with body:", req.body);
    const { personal, password, confirmPassword, userType, farm, expert, marketingEmails, agreeTerms } = req.body;

    // ----------------- Validations -----------------
    if (!personal?.firstName || !personal?.lastName || !personal?.email || !personal?.phone)
      return res.status(400).json({ success: false, message: "Missing required personal information." });
    if (!password || !confirmPassword)
      return res.status(400).json({ success: false, message: "Password and confirm password are required." });
    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: "Passwords do not match." });
    if (!agreeTerms) return res.status(400).json({ success: false, message: "You must agree to terms." });

    // ----------------- Farmer specific validation -----------------
    if (userType === "farmer") {
      if (!farm?.state || !farm?.district || !farm?.fieldSize || !farm?.farmingMethod)
        return res.status(400).json({ success: false, message: "All farm details are required." });
    }

    // ----------------- Check existing user -----------------
    let user = await User.findOne({ $or: [{ email: personal.email.toLowerCase() }, { phone: personal.phone }] });

    if (user) {
      console.log("Existing user found:", user._id);
      if (user.isVerified)
        return res.status(400).json({ success: false, message: "Email or phone already registered." });

      Object.assign(user, {
        firstName: personal.firstName.trim(),
        lastName: personal.lastName.trim(),
        email: personal.email.toLowerCase().trim(),
        phone: personal.phone.trim(),
        password,
        userType,
        marketingEmails: !!marketingEmails,
        farmDetails: userType === "farmer" ? farm : undefined,
        expertDetails: userType === "expert" ? expert : undefined,
      });
      await user.save();
      console.log("Unverified user updated:", user._id);
    } else {
      console.log("Creating new user...");
      user = await User.create({
        firstName: personal.firstName.trim(),
        lastName: personal.lastName.trim(),
        email: personal.email.toLowerCase().trim(),
        phone: personal.phone.trim(),
        password,
        isVerified: false,
        userType,
        marketingEmails: !!marketingEmails,
        farmDetails: userType === "farmer" ? farm : undefined,
        expertDetails: userType === "expert" ? expert : undefined,
        profileImage: `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(personal.firstName)}`,
      });
      console.log("New user created:", user._id);
    }

    // ----------------- Token -----------------
    const token = generateToken(user._id);
    sendAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Signup successful. Logged in automatically.",
      userId: user._id,
      redirectUrl: `${REDIRECT_BASE}/dashboard`,
      token,
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ success: false, message: "Registration failed.", error: err.message });
  }
});


/* ----------------- Login ----------------- */
/* ----------------- Login ----------------- */
router.post("/login", async (req, res) => {
  try {
    console.log("🔹 /login called with body:", req.body);
    const { email, password } = req.body;
    if (!email || !password) 
      return res.status(400).json({ success: false, message: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) 
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    // ✅ Generate JWT
    const token = generateToken(user._id);

    // ✅ Send auth cookie
    res.cookie("authToken", token, {
      httpOnly: true, // secure access only from server
      secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
      sameSite: "lax", // prevents CSRF issues
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("📦 Sending auth cookie...");
    console.log("✅ Login successful for user:", user._id);

    // ✅ Respond with token and redirect URL
    res.status(200).json({
      success: true,
      message: "Login successful",
      redirectUrl: `${REDIRECT_BASE}/dashboard`,
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, message: "Login failed. Please try again later.", error: err.message });
  }
});


/* ----------------- Check Email/Phone ----------------- */
router.get("/check-identifier", async (req, res) => {
  try {
    console.log("🔹 /check-identifier called with query:", req.query);
    const { email, phone } = req.query;
    if (!email && !phone) return res.status(400).json({ success: false, message: "Email or phone is required." });

    const existingUser = await User.findOne({
      ...(email ? { email: email.toLowerCase() } : {}),
      ...(phone ? { phone: phone.trim() } : {}),
    });

    res.status(200).json({ success: true, exists: !!existingUser });
  } catch (err) {
    console.error("❌ /check-identifier error:", err);
    res.status(500).json({ success: false, message: "Failed to check identifier.", error: err.message });
  }
});

module.exports = router;
