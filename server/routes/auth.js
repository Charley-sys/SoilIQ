const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.protect, authController.getMe);
router.patch('/profile', authController.protect, authController.updateProfile);
router.patch('/password', authController.protect, authController.changePassword);
router.post('/logout', authController.protect, authController.logout);

module.exports = router;