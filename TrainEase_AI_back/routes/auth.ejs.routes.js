const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.ejs.controller');

// Login page (root)
router.get('/', authController.renderLogin);
// Signup page
router.get('/signup', authController.renderSignup);
// Signup POST
router.post('/signup', authController.signup);
// Login POST
router.post('/login', authController.login);

module.exports = router; 