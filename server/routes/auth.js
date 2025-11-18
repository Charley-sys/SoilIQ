// server/routes/auth.js
const express = require('express');
const { register, login, getMe, updateMe } = require('../controllers/authController');
const { protect, allowAll } = require('../middleware/auth');

const router = express.Router();

// Keep these routes but they won't be used in frontend
router.post('/register', register);
router.post('/login', login);

// Use allowAll instead of protect to bypass auth
router.get('/me', allowAll, getMe);
router.put('/me', allowAll, updateMe);

module.exports = router;