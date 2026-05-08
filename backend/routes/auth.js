const express = require("express");
const router = express.Router();
const User = require("../models/User");
const OtpChallenge = require("../models/OtpChallenge");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Route: Request OTP for Signup / Login
router.post("/otp/request", async (req, res) => {
  const { voterId, email, purpose } = req.body;
  
  if (!voterId || !email) {
    return res.status(400).json({ message: "VoterID and Email are required." });
  }

  // VoterID Validation
  if (!/^[A-Z]{3}[0-9]{7}$/.test(voterId)) {
    return res.status(400).json({ message: "Invalid Voter ID format. Expected 3 letters followed by 7 digits." });
  }

  try {
    const userExists = await User.findOne({ $or: [{ voterId }, { email }] });
    
    if (purpose === "signup" && userExists) {
      return res.status(400).json({ message: "User with this Voter ID or Email already exists." });
    }
    if (purpose === "login") {
      if (!userExists) {
        return res.status(400).json({ message: "User not found. Please sign up first." });
      }
      if (userExists.voterId !== voterId || userExists.email !== email) {
        return res.status(400).json({ message: "Voter ID and Email do not match our records." });
      }
    }

    const otp = generateOTP();
    
    // Save/Update OTP Challenge
    await OtpChallenge.findOneAndUpdate(
      { email },
      { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true, new: true }
    );

    // Send Email
    await transporter.sendMail({
      from: `"BlockVote" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your BlockVote Verification Code",
      text: `Your OTP for BlockVote is ${otp}. It is valid for 10 minutes.`
    });

    res.json({ message: "OTP sent successfully. Check your email." });
  } catch (error) {
    console.error("OTP Request Error:", error);
    res.status(500).json({ message: "Failed to process OTP request." });
  }
});

// Route: Verify OTP and Login/Signup
router.post("/verify", async (req, res) => {
  const { voterId, email, otp, purpose } = req.body;

  try {
    const challenge = await OtpChallenge.findOne({ email, otp });
    if (!challenge) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    let user;
    if (purpose === "signup") {
      user = new User({ voterId, email });
      await user.save();
    } else {
      user = await User.findOne({ voterId, email });
    }

    // Delete OTP challenge after successful verification
    await OtpChallenge.deleteOne({ email });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role, voterId: user.voterId },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    // Save session (if using express-session for added security layer)
    req.session.userId = user._id;

    res.json({
      message: purpose === "signup" ? "Account created successfully." : "Logged in successfully.",
      token,
      user: {
        voterId: user.voterId,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });

  } catch (error) {
    console.error("OTP Verify Error:", error);
    res.status(500).json({ message: "Failed to verify OTP." });
  }
});

// Admin Login
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  // In a real app, hash password and store in DB. 
  // For this overhaul, we will hardcode or use simple check for demonstration if not specified.
  if (email === "admin@blockvote.com" && password === "admin123") {
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );
    res.json({
      message: "Admin logged in",
      token,
      user: { role: "admin" }
    });
  } else {
    res.status(401).json({ message: "Invalid admin credentials" });
  }
});

module.exports = router;
