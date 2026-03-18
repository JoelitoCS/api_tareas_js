const { Router } = require('express');
const { authController } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');

const router = Router();

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET  /api/auth/me  (requiere token)
router.get('/me', authMiddleware, authController.me);

module.exports = router;
