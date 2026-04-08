const express = require('express');
const cors = require('cors');
const { BkashGateway } = require('bkash-payment-gateway');
const { NagadGateway } = require('nagad-payment-gateway');
const SSLCommerzPayment = require('sslcommerz-lts');
require('dotenv').config();

const asyncHandler = require('../../utils/async_handler');
const ApiError = require('../../utils/api_error');
const StoreConfiguration = require('../../api/models/StoreConfiguration'); // Import StoreConfiguration model

// Dynamic import for uuid
let uuidv4;
(async () => {
    const uuidModule = await import('uuid');
    uuidv4 = uuidModule.v4;
})();

// ====================================================================
// =================== COMMON ENV VARIABLES ===========================
// ====================================================================
const CLIENT_URL = process.env.CLIENT_URL;
const SERVER_URL = process.env.SERVER_URL;
const IS_SANDBOX = process.env.IS_SANDBOX === 'true';

// Helper function to get payment settings
const getPaymentSettings = async (storeId) => {
    const storeConfig = await StoreConfiguration.findOne({ store_id: storeId });
    if (!storeConfig || !storeConfig.payment_settings) {
        throw new ApiError(404, 'Payment settings not found for this store.');
    }
    return JSON.parse(storeConfig.payment_settings);
};

// ====================================================================
// =================== BKASH GATEWAY SETUP ============================
// ====================================================================
const getBkashGateway = (paymentSettings) => {
    return new BkashGateway({
        baseURL: IS_SANDBOX 
            ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta' 
            : 'https://tokenized.pay.bka.sh/v1.2.0-beta',
        username: paymentSettings.bkash_merchant_username,
        password: paymentSettings.bkash_merchant_password,
        appKey: paymentSettings.bkash_merchant_app_key,
        appSecret: paymentSettings.bkash_merchant_secret_key,
    });
};

const createBkashPayment = asyncHandler(async (req, res) => {
    const storeId = req.store_id; // Assuming store_id is available from middleware
    const paymentSettings = await getPaymentSettings(storeId);

    if (!paymentSettings.bkash_enabled) {
        throw new ApiError(400, 'bKash payment is not enabled.');
    }
    const bkash = getBkashGateway(paymentSettings);

    const { amount, orderId } = req.body;
    const paymentData = {
        amount: amount,
        intent: 'sale',
        currency: 'BDT',
        merchantInvoiceNumber: orderId || 'inv' + Date.now(),
        callbackURL: `${SERVER_URL}/api/payment/bkash/callback`, // Not used by hook, but required by bKash
    };
    const result = await bkash.createPayment(paymentData);
    if (result && result.bkashURL) {
        res.json({ bkashURL: result.bkashURL, paymentID: result.paymentID });
    } else {
        throw new ApiError(500, result.errorMessage || 'Payment creation failed');
    }
});

const executeBkashPayment = asyncHandler(async (req, res) => {
    const storeId = req.store_id; // Assuming store_id is available from middleware
    const paymentSettings = await getPaymentSettings(storeId);

    if (!paymentSettings.bkash_enabled) {
        throw new ApiError(400, 'bKash payment is not enabled.');
    }
    const bkash = getBkashGateway(paymentSettings);

    const { paymentID } = req.body;
    if (!paymentID) {
        throw new ApiError(400, 'paymentID is required');
    }
    const result = await bkash.executePayment(paymentID);
    if (result && result.trxID) {
        // Payment successful, save to DB
        res.json({
            message: 'Payment successful',
            transactionId: result.trxID,
            amount: result.amount,
        });
    } else {
        throw new ApiError(500, result.errorMessage || 'Payment execution failed');
    }
});

// Dummy callback for bKash (required by their API)
const bkashCallback = asyncHandler(async (req, res) => {
    res.json({ message: 'bKash Callback' });
});

// ====================================================================
// =================== NAGAD GATEWAY SETUP ============================
// ====================================================================
const getNagadGateway = (paymentSettings) => {
    return new NagadGateway({
        baseURL: process.env.NAGAD_BASE_URL, // This should be configured in .env
        merchantID: process.env.NAGAD_MERCHANT_ID, // This should be configured in .env
        merchantNumber: paymentSettings.mfs_phone_number,
        privKey: process.env.NAGAD_PRIVATE_KEY_PATH, // This should be configured in .env
        pubKey: process.env.NAGAD_PUBLIC_KEY_PATH, // This should be configured in .env
        isPath: true, // True as we are providing file paths
    });
};

const createNagadPayment = asyncHandler(async (req, res) => {
    const storeId = req.store_id; // Assuming store_id is available from middleware
    const paymentSettings = await getPaymentSettings(storeId);

    if (!paymentSettings.mfs_enabled || paymentSettings.mfs_method !== 'nagad') {
        throw new ApiError(400, 'Nagad payment is not enabled or configured.');
    }
    const nagad = getNagadGateway(paymentSettings);

    const { amount, orderId } = req.body;
    const callbackURL = `${CLIENT_URL}/payment/nagad/verify`; // Frontend route
    
    const paymentData = {
        amount: amount.toString(),
        ip: req.ip || '127.0.0.1',
        orderId: orderId || 'order' + Date.now(),
        productDetails: { 'product': 'YourProductName' },
        clientType: 'PC_WEB',
        callbackURL: callbackURL,
    };
    
    const nagadURL = await nagad.createPayment(paymentData);
    if (nagadURL) {
        res.json({ nagadURL });
    } else {
        throw new ApiError(500, 'Failed to create Nagad payment');
    }
});

const verifyNagadPayment = asyncHandler(async (req, res) => {
    const storeId = req.store_id; // Assuming store_id is available from middleware
    const paymentSettings = await getPaymentSettings(storeId);

    if (!paymentSettings.mfs_enabled || paymentSettings.mfs_method !== 'nagad') {
        throw new ApiError(400, 'Nagad payment is not enabled or configured.');
    }
    const nagad = getNagadGateway(paymentSettings);

    const { paymentRefId } = req.body;
    if (!paymentRefId) {
        throw new ApiError(400, 'paymentRefId is required');
    }
    
    const verificationResult = await nagad.verifyPayment(paymentRefId);
    if (verificationResult && verificationResult.status === 'Success') {
        // Payment verified, save to DB
        res.json({
            message: 'Payment verified successfully',
            data: verificationResult,
        });
    } else {
        throw new ApiError(400, 'Payment verification failed', verificationResult);
    }
});

// ====================================================================
// =================== SSLCOMMERZ (ROCKET) SETUP ======================
// ====================================================================
const getSslcommerzGateway = (paymentSettings) => {
    const store_id = paymentSettings.aamarpay_merchant_store_id; // Using aamarpay store ID for SSLCommerz
    const store_passwd = paymentSettings.aamarpay_merchant_secret_key; // Using aamarpay secret key for SSLCommerz
    const is_live = !IS_SANDBOX; // sslcommerz uses 'true' for live, 'false' for sandbox
    return new SSLCommerzPayment(store_id, store_passwd, is_live);
};

const initSslcommerzPayment = asyncHandler(async (req, res) => {
    const storeId = req.store_id; // Assuming store_id is available from middleware
    const paymentSettings = await getPaymentSettings(storeId);

    // Assuming SSLCommerz is used for aamarpay if aamarpay_enabled is true, or a generic MFS if mfs_enabled is true
    if (!paymentSettings.aamarpay_enabled && !paymentSettings.mfs_enabled) {
        throw new ApiError(400, 'SSLCommerz/Aamarpay payment is not enabled.');
    }

    const { amount, customerName, customerEmail, customerPhone } = req.body;
    if (!amount || !customerName || !customerEmail || !customerPhone) {
        throw new ApiError(400, 'Missing required fields');
    }

    const sslcz = getSslcommerzGateway(paymentSettings);

    // Ensure uuidv4 is initialized before use
    if (!uuidv4) {
        const uuidModule = await import('uuid');
        uuidv4 = uuidModule.v4;
    }
    const tran_id = uuidv4(); // Unique transaction ID
    const data = {
        total_amount: amount,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${SERVER_URL}/api/payment/success?transactionId=${tran_id}`,
        fail_url: `${SERVER_URL}/api/payment/fail?transactionId=${tran_id}`,
        cancel_url: `${SERVER_URL}/api/payment/cancel`,
        ipn_url: `${SERVER_URL}/api/payment/ipn`,
        shipping_method: 'No',
        product_name: 'Your Product Name',
        product_category: 'General',
        product_profile: 'general',
        cus_name: customerName,
        cus_email: customerEmail,
        cus_phone: customerPhone,
        cus_add1: 'N/A',
        cus_city: 'N/A',
        cus_state: 'N/A',
        cus_postcode: 'N/A',
        cus_country: 'Bangladesh',
    };

    const apiResponse = await sslcz.init(data);
    
    if (apiResponse && apiResponse.GatewayPageURL) {
        res.json({ gatewayURL: apiResponse.GatewayPageURL });
    } else {
        throw new ApiError(500, 'Payment session initialization failed');
    }
});

const sslcommerzSuccess = asyncHandler(async (req, res) => {
    const storeId = req.store_id; // Assuming store_id is available from middleware
    const paymentSettings = await getPaymentSettings(storeId);
    const sslcz = getSslcommerzGateway(paymentSettings);

    const { transactionId } = req.query;
    const validationData = req.body;

    if (!transactionId || !validationData) {
        return res.redirect(`${CLIENT_URL}/payment/fail`);
    }

    const validation = await sslcz.validate(validationData);

    if (validation.status === 'VALID' && validation.tran_id === transactionId) {
        // Payment valid, update DB
        console.log('SSLCommerz Payment Successful. Tran_ID:', validation.tran_id);
        // Redirect to frontend success page
        res.redirect(`${CLIENT_URL}/payment/success`);
    } else {
        console.log('SSLCommerz Payment Validation Failed.');
        res.redirect(`${CLIENT_URL}/payment/fail`);
    }
});

const sslcommerzFail = asyncHandler(async (req, res) => {
    res.redirect(`${CLIENT_URL}/payment/fail`);
});

const sslcommerzCancel = asyncHandler(async (req, res) => {
    res.redirect(`${CLIENT_URL}/payment/fail`);
});

const sslcommerzIpn = asyncHandler(async (req, res) => {
    const storeId = req.store_id; // Assuming store_id is available from middleware
    const paymentSettings = await getPaymentSettings(storeId);
    const sslcz = getSslcommerzGateway(paymentSettings);

    const ipnData = req.body;
    if (!ipnData || ipnData.status !== 'VALID') {
        return res.status(200).send('OK'); // Acknowledge, but do nothing
    }

    const validation = await sslcz.validate(ipnData);

    if (validation.status === 'VALID') {
        // Most reliable place to update DB
        console.log('SSLCommerz IPN Received and Validated. Tran_ID:', validation.tran_id);
    } else {
        console.log('SSLCommerz IPN Validation Failed.');
    }
    res.status(200).send('OK'); // Must send 200 OK
});

module.exports = {
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
};