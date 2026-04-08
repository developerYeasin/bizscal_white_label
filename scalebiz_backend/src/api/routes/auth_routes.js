const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

router.post('/request-password-reset', authController.resetPasswordRequest);
router.post('/reset-password', authController.resetPassword);
router.post('/test-email', authController.sendTestEmail);

module.exports = router;