// routes/auth.js
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// ----------------- Signup Route (Step 1) -----------------
router.post('/signup', async (req, res) => {
  console.log("📩 Incoming signup request:", JSON.stringify(req.body, null, 2));

  try {
    const { personal, password, confirmPassword, userType, farm, expert, marketingEmails, agreeTerms } = req.body;

    // ----------------- BASIC VALIDATION -----------------
    if (!personal?.firstName || !personal?.lastName || !personal?.email || !personal?.phone) {
      console.warn("⚠️ Missing required personal fields");
      return res.status(400).json({ success: false, message: 'Missing required personal information.' });
    }

    if (!password || !confirmPassword) {
      console.warn("⚠️ Password or confirm password missing");
      return res.status(400).json({ success: false, message: 'Password and confirm password are required.' });
    }

    if (password !== confirmPassword) {
      console.warn("⚠️ Passwords do not match");
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (!agreeTerms) {
      console.warn("⚠️ User did not agree to terms");
      return res.status(400).json({ success: false, message: 'You must agree to terms.' });
    }

    // ----------------- DUPLICATE CHECK -----------------
    const existingUser = await User.findOne({
      $or: [
        { email: personal.email.toLowerCase() },
        { phone: personal.phone }
      ]
    });

    if (existingUser) {
      console.warn("⚠️ Duplicate user found:", existingUser.email || existingUser.phone);
      return res.status(400).json({ success: false, message: 'Email or phone already registered.' });
    }

    // ----------------- TEMP PIN -----------------
    const tempPinPlain = String(Math.floor(100000 + Math.random() * 900000));
    const hashedTempPin = await bcrypt.hash(tempPinPlain, 10);

    // ----------------- USER CREATION -----------------
    const newUser = new User({
      firstName: personal.firstName.trim(),
      lastName: personal.lastName.trim(),
      email: personal.email.toLowerCase().trim(),
      phone: personal.phone.trim(),
      password, // 🔒 hash in pre-save hook in User model
      tempPin: hashedTempPin,
      isVerified: false,
      userType,
      marketingEmails: marketingEmails === 'true' || marketingEmails === 'on',
      farmDetails: userType === 'farmer' ? {
        state: farm?.state,
        district: farm?.district,
        fieldSize: farm?.fieldSize,
        crops: farm?.crops,
        farmingMethod: farm?.farmingMethod
      } : undefined,
      expertDetails: userType === 'expert' ? {
        expertise: expert?.expertise,
        experience: expert?.experience,
        qualification: expert?.qualification,
        organization: expert?.organization
      } : undefined,
      profileImage: `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(personal.firstName)}`
    });

    await newUser.save();
    console.log("✅ New user created (pending verification):", newUser.email);

    // ----------------- SEND EMAIL -----------------
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const emailHtml = `
        <div style="font-family:Arial, sans-serif; padding:20px;">
          <h2>Welcome, ${personal.firstName} ${personal.lastName}</h2>
          <p>Please verify your email to activate your account.</p>
          <p><strong>Your Temporary PIN:</strong> ${tempPinPlain}</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"AgriAI Support" <${process.env.EMAIL_USER}>`,
        to: newUser.email,
        subject: 'AgriAI — Verify your email with this PIN',
        html: emailHtml
      });

      console.log("📧 Verification email sent to:", newUser.email);
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
      return res.status(500).json({ success: false, message: 'Signup created but email sending failed.', error: emailErr.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Signup successful. PIN sent to email. Please verify.',
      userId: newUser._id
    });

  } catch (err) {
    console.error("❌ Signup error:", err);
    return res.status(500).json({ success: false, message: 'Registration failed.', error: err.message });
  }
});

// ----------------- Verify PIN/OTP Route (Step 2) -----------------
router.post('/verify-pin', async (req, res) => {
  console.log("🔑 Incoming PIN verification:", req.body);

  try {
    const { userId, pin } = req.body;
    if (!userId || !pin) {
      console.warn("⚠️ Missing userId or pin");
      return res.status(400).json({ success: false, message: 'Missing userId or PIN.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.warn("⚠️ User not found with ID:", userId);
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isVerified) {
      console.info("ℹ️ User already verified:", user.email);
      return res.status(200).json({ success: true, message: 'User already verified.' });
    }

    const isMatch = await bcrypt.compare(pin, user.tempPin);
    console.log("🔍 PIN compare result:", isMatch);

    if (!isMatch) {
      console.warn("⚠️ Incorrect PIN for user:", user.email);
      return res.status(400).json({ success: false, message: 'Invalid PIN.' });
    }

    user.isVerified = true;
    user.tempPin = undefined; // 🔒 clear temp PIN
    await user.save();

    console.log("✅ User verified successfully:", user.email);

    return res.status(200).json({ success: true, message: 'Account verified successfully.' });

  } catch (err) {
    console.error("❌ PIN verification error:", err);
    return res.status(500).json({ success: false, message: 'PIN verification failed.', error: err.message });
  }
});

// Alias for frontend that expects `/verify-otp`
router.post('/verify-otp', async (req, res) => {
  console.log("🔄 Redirecting /verify-otp -> /verify-pin");
  req.body.pin = req.body.otp; // normalize naming
  return router.handle({ ...req, url: '/verify-pin', method: 'POST' }, res);
});

// ----------------- Check Email/Phone Route -----------------
router.get('/check-identifier', async (req, res) => {
  console.log("🔍 Incoming check-identifier request:", req.query);

  try {
    const { email, phone } = req.query;

    if (!email && !phone) {
      console.warn("⚠️ Missing identifier in request");
      return res.status(400).json({ success: false, message: 'Email or phone is required.' });
    }

    let query = {};
    if (email) query.email = email.toLowerCase();
    if (phone) query.phone = phone.trim();

    const existingUser = await User.findOne(query);

    if (existingUser) {
      console.info("ℹ️ Identifier already registered:", existingUser.email || existingUser.phone);
      return res.status(200).json({ success: true, exists: true });
    }

    console.info("✅ Identifier is available:", email || phone);
    return res.status(200).json({ success: true, exists: false });

  } catch (err) {
    console.error("❌ Check identifier error:", err);
    return res.status(500).json({ success: false, message: 'Failed to check identifier.', error: err.message });
  }
});

module.exports = router;
