// routes/auth.js
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// ----------------- Send OTP (Step 0) -----------------
router.post('/send-otp', async (req, res) => {
  console.log("📩 Incoming send-otp request:", req.body);

  try {
    const { contact, method } = req.body;

    if (!contact || !method) {
      console.warn("⚠️ Missing contact or method");
      return res.status(400).json({ success: false, message: 'Contact and method are required.' });
    }

    // Generate OTP
    const otpPlain = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await bcrypt.hash(otpPlain, 10);

    // Here you can either:
    // 1. Store OTP in DB (linked to email/phone)
    // 2. Or store in-memory for testing (less secure)
    // For now, let's just simulate DB-like storage:
    const sessionId = Date.now().toString(); // simple unique ID
    req.app.locals.otpSessions = req.app.locals.otpSessions || {};
    req.app.locals.otpSessions[sessionId] = {
      contact,
      method,
      hashedOtp,
      createdAt: Date.now()
    };

    console.log(`🔑 OTP generated for ${method}:${contact} = ${otpPlain}`);

    // Send email if method=email
    if (method === "email") {
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
            <h2>Email Verification</h2>
            <p>Use this code to verify your email:</p>
            <p><strong style="font-size:20px;">${otpPlain}</strong></p>
          </div>
        `;

        await transporter.sendMail({
          from: `"AgriAI Support" <${process.env.EMAIL_USER}>`,
          to: contact,
          subject: 'AgriAI — Verify your email with this OTP',
          html: emailHtml
        });

        console.log("📧 OTP email sent to:", contact);
      } catch (emailErr) {
        console.error("❌ Email sending failed:", emailErr);
        return res.status(500).json({
          success: false,
          message: 'OTP generation succeeded but email sending failed.',
          error: emailErr.message
        });
      }
    }

    // TODO: Add SMS provider if method === "phone"

    return res.status(200).json({
      success: true,
      message: `OTP sent via ${method}.`,
      sessionId
    });

  } catch (err) {
    console.error("❌ send-otp error:", err);
    return res.status(500).json({ success: false, message: 'Failed to send OTP.', error: err.message });
  }
});

// ----------------- Signup Route (Step 1) -----------------
// ----------------- Signup Route (Step 1) -----------------
router.post('/signup', async (req, res) => {
  console.log("📩 Incoming signup request:", JSON.stringify(req.body, null, 2));
  try {
    const { personal, password, confirmPassword, userType, farm, expert, marketingEmails, agreeTerms } = req.body;

    if (!personal?.firstName || !personal?.lastName || !personal?.email || !personal?.phone) {
      return res.status(400).json({ success: false, message: 'Missing required personal information.' });
    }
    if (!password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password and confirm password are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }
    if (!agreeTerms) {
      return res.status(400).json({ success: false, message: 'You must agree to terms.' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: personal.email.toLowerCase() }, { phone: personal.phone }]
    });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or phone already registered.' });
    }

    const tempPinPlain = String(Math.floor(100000 + Math.random() * 900000));
    const hashedTempPin = await bcrypt.hash(tempPinPlain, 10);

    const newUser = new User({
      firstName: personal.firstName.trim(),
      lastName: personal.lastName.trim(),
      email: personal.email.toLowerCase().trim(),
      phone: personal.phone.trim(),
      password,
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

    // Send verification email
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"AgriAI Support" <${process.env.EMAIL_USER}>`,
        to: newUser.email,
        subject: 'AgriAI — Verify your email with this PIN',
        html: `<p>Your Temporary PIN: <b>${tempPinPlain}</b></p>`
      });

      console.log("📧 Verification email sent to:", newUser.email);
    } catch (emailErr) {
      return res.status(500).json({
        success: false,
        message: 'Signup created but email sending failed.',
        error: emailErr.message
      });
    }

    // ✅ Decide redirect vs JSON
    if (req.xhr || req.headers.accept?.includes("application/json")) {
      return res.status(200).json({
        success: true,
        message: 'Signup successful. PIN sent to email. Please verify.',
        userId: newUser._id,
        redirectUrl: '/dashboard' // helpful for frontend
      });
    } else {
      return res.redirect('/dashboard');
    }

  } catch (err) {
    console.error("❌ Signup error:", err);
    return res.status(500).json({ success: false, message: 'Registration failed.', error: err.message });
  }
});


// ----------------- Verify PIN/OTP Route (Step 2) -----------------
// ----------------- Verify PIN/OTP Route (Step 2) -----------------
// ----------------- Verify PIN/OTP Route -----------------


// ----------------- Verify PIN/OTP Route (Step 2) -----------------
router.post('/verify-pin', async (req, res) => {
  console.log("🔑 Incoming PIN verification:", req.body);

  try {
    const { sessionId, pin } = req.body;
    if (!sessionId || !pin) {
      return res.status(400).json({ success: false, message: 'Missing sessionId or PIN.' });
    }

    // Check OTP session stored in memory
    const otpSessions = req.app.locals.otpSessions || {};
    const session = otpSessions[sessionId];
    if (!session) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP session.' });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(pin, session.hashedOtp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    // OTP is valid → create user (if not already created)
    const existingUser = await User.findOne({ 
      $or: [{ email: session.contact }, { phone: session.contact }] 
    });

    if (existingUser && existingUser.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'User already verified.',
        redirectUrl: '/dashboard'
      });
    }

    // Mark existing user as verified (if exists)
    if (existingUser) {
      existingUser.isVerified = true;
      existingUser.tempPin = undefined;
      await existingUser.save();

      console.log("✅ User verified successfully:", existingUser.email);
      delete otpSessions[sessionId]; // clean up session

      return res.status(200).json({
        success: true,
        message: 'Account verified successfully.',
        redirectUrl: '/dashboard'
      });
    }

    // If no user yet, frontend will continue with signup
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You can now complete signup.',
    });

  } catch (err) {
    console.error("❌ PIN verification error:", err);
    return res.status(500).json({ success: false, message: 'PIN verification failed.', error: err.message });
  }
});

// ----------------- Alias for frontend expecting `/verify-otp` -----------------
router.post('/verify-otp', (req, res, next) => {
  console.log("🔄 Redirecting /verify-otp -> /verify-pin");
  req.body.pin = req.body.otp; // normalize field name
  return router.handle({ ...req, url: '/verify-pin', method: 'POST' }, res, next);
});



// ----------------- Check Email/Phone -----------------
router.get('/check-identifier', async (req, res) => {
  try {
    const { email, phone } = req.query;
    if (!email && !phone) {
      return res.status(400).json({ success: false, message: 'Email or phone is required.' });
    }
    let query = {};
    if (email) query.email = email.toLowerCase();
    if (phone) query.phone = phone.trim();

    const existingUser = await User.findOne(query);
    return res.status(200).json({ success: true, exists: !!existingUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to check identifier.', error: err.message });
  }
});

module.exports = router;
