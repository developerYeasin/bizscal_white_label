const express = require('express');
const { submitContactForm } = require('../controllers/contact_submission_controller');

const router = express.Router();

router.route('/contact-submissions').post(submitContactForm);

module.exports = router;