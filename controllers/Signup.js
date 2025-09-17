const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const validator = require('validator');
const User = require('../models/User');
const OtpVerification = require('../models/Verification'); // new OTP model
const TWILIO_ENABLED = !!(process.env.TWILIO_SID && process.env.TWILIO_TOKEN && process.env.TWILIO_FROM);
let twilioClient = null;

if (TWILIO_ENABLED) {
  const twilio = require('twilio');
  twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
}

// Helper to generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

exports.signup = async (req, res) => {
  try {
    const { personal, password, confirmPassword, userType, farm, expert, marketingEmails, agreeTerms, verificationMethod } = req.body;

    console.log("📥 Signup request received:", req.body);

    // ----------------- BASIC VALIDATION -----------------
    if (!personal?.firstName || !personal?.lastName || !personal?.email || !password || !confirmPassword) {
      console.warn("⚠️ Missing required fields");
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    if (!agreeTerms) {
      console.warn("⚠️ Terms not agreed");
      return res.status(400).json({ success: false, message: 'You must agree to terms to continue.' });
    }

    if (!validator.isEmail(personal.email)) {
      console.warn("⚠️ Invalid email:", personal.email);
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    if (password !== confirmPassword) {
      console.warn("⚠️ Password mismatch");
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // ----------------- DUPLICATE CHECK -----------------
    const existing = await User.findOne({
      $or: [
        { "personal.email": personal.email.toLowerCase() },
        { "personal.phone": personal.phone }
      ]
    });
    if (existing) {
      console.warn("⚠️ Duplicate user found:", existing.personal.email);
      return res.status(400).json({ success: false, message: 'Email or phone already registered.' });
    }

    // ----------------- ROLE-SPECIFIC DATA -----------------
    let farmData = {}, expertData = {};

    if (userType === 'farmer') {
      if (!farm?.state || !farm?.district) {
        return res.status(400).json({ success: false, message: 'Please provide farm location (state & district).' });
      }

      const cropsArr = Array.isArray(farm.crops)
        ? farm.crops.map(c => String(c).trim()).filter(Boolean)
        : farm.crops ? [String(farm.crops).trim()] : [];

      if (!cropsArr.length) {
        return res.status(400).json({ success: false, message: 'Please select at least one crop.' });
      }

      if (!farm.farmingMethod) {
        return res.status(400).json({ success: false, message: 'Please select a farming method.' });
      }

      farmData = {
        state: farm.state.trim(),
        district: farm.district.trim(),
        fieldSize: farm.fieldSize ? Number(farm.fieldSize) : undefined,
        crops: cropsArr,
        farmingMethod: farm.farmingMethod.trim()
      };
    } else if (userType === 'expert') {
      if (!expert?.expertise || !expert?.experience || !expert?.qualification) {
        return res.status(400).json({ success: false, message: 'Please fill expertise, experience, and qualification.' });
      }

      expertData = {
        expertise: expert.expertise.trim(),
        experience: expert.experience.trim(),
        qualification: expert.qualification.trim(),
        organization: expert.organization ? expert.organization.trim() : undefined
      };
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type.' });
    }

    // ----------------- PASSWORD HASH -----------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ----------------- TEMPORARY OTP -----------------
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Store OTP temporarily in DB
    const otpRecord = await OtpVerification.create({
      contact: verificationMethod === 'email' ? personal.email.toLowerCase() : personal.phone,
      otp,
      expiresAt: otpExpires
    });
    console.log("🔑 OTP stored:", otpRecord);

    // ----------------- SEND OTP -----------------
    if (verificationMethod === 'email') {
      try {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
          from: `"AgriAI Support" <${process.env.EMAIL_USER}>`,
          to: personal.email,
          subject: 'Your AgriAI Verification OTP',
          html: `<p>Your verification code is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`
        });
        console.log("📧 OTP sent via email to:", personal.email);
      } catch (emailErr) {
        console.error("❌ Failed to send OTP email:", emailErr);
        return res.status(500).json({ success: false, message: 'Failed to send OTP email.' });
      }
    } else if (verificationMethod === 'phone' && TWILIO_ENABLED) {
      try {
        await twilioClient.messages.create({
          from: process.env.TWILIO_FROM,
          to: personal.phone,
          body: `Your AgriAI verification code is: ${otp}`
        });
        console.log("📱 OTP sent via SMS to:", personal.phone);
      } catch (smsErr) {
        console.error("❌ Failed to send OTP SMS:", smsErr);
        return res.status(500).json({ success: false, message: 'Failed to send OTP SMS.' });
      }
    } else if (verificationMethod === 'phone') {
      return res.status(500).json({ success: false, message: 'SMS verification not enabled. Configure Twilio.' });
    }

    // ----------------- RESPOND WITH OTP SENT -----------------
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully. Verify it to complete account creation.',
      verificationMethod,
      tempUser: {
        firstName: personal.firstName,
        lastName: personal.lastName,
        email: personal.email,
        phone: personal.phone,
        userType,
        farmData,
        expertData,
        password: hashedPassword
      }
    });

  } catch (err) {
    console.error("❌ Signup error (catch):", err);
    return res.status(500).json({ success: false, message: 'Registration failed. Please try again later.', error: err.message });
  }
};
