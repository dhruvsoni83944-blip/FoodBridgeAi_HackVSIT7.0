const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/register
router.post('/register', authLimiter, registerValidator, validate, AuthController.register);

// POST /api/auth/login
router.post('/login', authLimiter, loginValidator, validate, AuthController.login);

// GET /api/auth/me
router.get('/me', authenticate, AuthController.getMe);

module.exports = router;
