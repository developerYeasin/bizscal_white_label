const express = require('express');
const asyncHandler = require('../../utils/async_handler'); // Import asyncHandler
const {
    createBkashPayment,
    executeBkashPayment,
    bkashCallback,
    createNagadPayment,
    verifyNagadPayment,
    initSslcommerzPayment,
    sslcommerzSuccess,
    sslcommerzFail,
    sslcommerzCancel,
    sslcommerzIpn,
} = require('../controllers/payment_controller');
const { resolve_store } = require('../middlewares/store_middleware');

const router = express.Router();

// Apply resolve_store middleware to all payment routes that require store context
router.use(asyncHandler(resolve_store));

// bKash Routes
router.post('/bkash/create-payment', createBkashPayment);
router.post('/bkash/execute-payment', executeBkashPayment);
router.get('/bkash/callback', bkashCallback); // This callback might not need storeMiddleware depending on bKash's implementation

// Nagad Routes
router.post('/nagad/create-payment', createNagadPayment);
router.post('/nagad/verify-payment', verifyNagadPayment);

// SSLCommerz (Aamarpay/Rocket) Routes
router.post('/payment/init', initSslcommerzPayment);
router.post('/payment/success', sslcommerzSuccess);
router.post('/payment/fail', sslcommerzFail);
router.post('/payment/cancel', sslcommerzCancel);
router.post('/payment/ipn', sslcommerzIpn);

module.exports = router;