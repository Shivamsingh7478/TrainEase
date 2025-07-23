const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Allowlist = require('../models/Allowlist');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET is not set in environment variables. Using default secret.');
}

// Middleware: JWT authentication
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
}

// Middleware: Allowlist check for trainees
async function allowlistTraineeOnly(req, res, next) {
  if (req.user.role !== 'trainee') return res.status(403).json({ success: false, message: 'Trainers cannot access this resource.' });
  const allowed = await Allowlist.findOne({ email: req.user.email, status: 'invited' });
  if (!allowed) return res.status(403).json({ success: false, message: 'Trainee not allowed.' });
  next();
}

// Example: Secure video route for trainees
router.get('/trainee/video', authenticateJWT, allowlistTraineeOnly, (req, res) => {
  // Replace with actual video logic
  res.json({ success: true, message: 'Access granted to trainee video.' });
});

// Signup (API)
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists.' });
    }
    const role = email.endsWith('@company.com') ? 'trainer' : 'trainee';
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    // Issue JWT
    const token = jwt.sign({ email, id: user._id, role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, token, user: { email, id: user._id, role } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Login (API)
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const user = await User.findOne({ email: req.body.email });
    console.log('User found:', user);
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'changeme_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, user, token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get all users (API)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error reading user list:', error.message);
    res.status(500).json({ message: 'Server error reading user list' });
  }
});

module.exports = router;
