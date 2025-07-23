const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    console.log('🔑 [LOGIN] Request body:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('❌ [LOGIN] Missing email or password');
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    console.log('🔍 [LOGIN] Looking up user by email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ [LOGIN] User not found for email:', email);
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    console.log('✅ [LOGIN] User found:', user.email, user._id);
    console.log('🔒 [LOGIN] Comparing password for user:', user.email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ [LOGIN] Invalid password for user:', user.email);
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }
    console.log('✅ [LOGIN] Password match for user:', user.email);
    if (!process.env.JWT_SECRET) {
      console.error('❌ [LOGIN] JWT_SECRET is not defined in environment variables!');
      return res.status(500).json({ success: false, message: 'Server misconfiguration: JWT secret missing.' });
    }
    console.log('🔑 [LOGIN] Generating JWT for user:', user.email);
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('✅ [LOGIN] JWT generated for user:', user.email);
    const responseObj = {
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    };
    console.log('✅ [LOGIN] About to send JSON response:', responseObj);
    return res.status(200).json(responseObj);
  } catch (err) {
    console.error('❌ [LOGIN] Login error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Server error during login', error: err.message });
    }
  }
}; 