const express = require('express');
const { signupController, loginController } = require('./auth.controller');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', signupController);

// POST /api/auth/login
router.post('/login', loginController);

module.exports = router;
