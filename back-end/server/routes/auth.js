const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- 1. UPDATED THIS HELPER FUNCTION ---
// It now accepts the full user object to include both ID and email in the token.
const createToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expires in 1 day
  });
};

// --- ROUTE 1: User Registration ---
// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const result = await User.create(username, email, hashedPassword);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    // --- 2. UPDATED THIS LINE ---
    // We now pass an object with both the new user's ID and their email.
    const token = createToken({ id: result.id, email: email });
    
    res.status(201).json({
      message: "User registered successfully!",
      token,
      username: result.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// --- ROUTE 2: User Login ---
// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // --- 3. UPDATED THIS LINE ---
    // We now pass the entire user object to the createToken function.
    const token = createToken(user);

    res.json({
      message: "Login successful!",
      token,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;

