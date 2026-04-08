const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/admin_user_controller');
const adminCategoryController = require('../controllers/admin_category_controller');
const adminCustomerController = require('../controllers/admin_customer_controller');
const landingPageTemplateController = require('../controllers/landing_page_template_controller');
const adminOrderController = require('../controllers/admin_order_controller');
const adminPageController = require('../controllers/admin_page_controller');
const adminProductController = require('../controllers/admin_product_controller');
const adminStoreConfigurationController = require('../controllers/admin_store_configuration_controller');
const adminStoreLandingPageSettingsController = require('../controllers/admin_store_landing_page_settings_controller');
const adminStoreThemeSettingsController = require('../controllers/admin_store_theme_settings_controller');
const adminStoreController = require('../controllers/admin_store_controller');
const themeAdminController = require('../controllers/theme_admin_controller');
const adminSubscriptionController = require('../controllers/admin_subscription_controller');
const adminPromoCodeController = require('../controllers/admin_promo_code_controller');
const adminPaymentController = require('../controllers/admin_payment_controller');
const adminContactSubmissionController = require('../controllers/admin_contact_submission_controller');
const { protect, authorize } = require('../middlewares/auth_middleware');

// Admin Login Route (does not require authentication)
router.post('/login', adminUserController.adminLogin);

// Middleware to ensure only admins can access these routes
router.use(protect);
router.use(authorize(['admin'])); // Assuming 'admin' is the role for administrators

// User Management (Admin specific)
router.post('/users', adminUserController.createAdminUser);
router.get('/users', adminUserController.getAllUsers);
router.get('/users/:id', adminUserController.getUserById);
router.put('/users/:id', adminUserController.updateUser);
router.delete('/users/:id', adminUserController.deleteUser);

// Category Management
router.post('/categories', adminCategoryController.create);
router.get('/categories', adminCategoryController.getAll);
router.get('/categories/:id', adminCategoryController.getById);
router.put('/categories/:id', adminCategoryController.update);
router.delete('/categories/:id', adminCategoryController.delete);

// Customer Management
router.post('/customers', adminCustomerController.create);
router.get('/customers', adminCustomerController.getAll);
router.get('/customers/:id', adminCustomerController.getById);
router.put('/customers/:id', adminCustomerController.update);
router.delete('/customers/:id', adminCustomerController.delete);

// Landing Page Template Management
router.post('/landing-page-templates', landingPageTemplateController.createLandingPageTemplate);
router.get('/landing-page-templates', landingPageTemplateController.getAllLandingPageTemplates);
router.get('/landing-page-templates/:id', landingPageTemplateController.getLandingPageTemplateById);
router.put('/landing-page-templates/:id', landingPageTemplateController.updateLandingPageTemplate);
router.delete('/landing-page-templates/:id', landingPageTemplateController.deleteLandingPageTemplate);

// Order Management
router.post('/orders', adminOrderController.create);
router.get('/orders', adminOrderController.getAll);
router.get('/orders/:id', adminOrderController.getById);
router.put('/orders/:id', adminOrderController.update);
router.delete('/orders/:id', adminOrderController.delete);

// Page Management
router.post('/pages', adminPageController.create);
router.get('/pages', adminPageController.getAll);
router.get('/pages/:id', adminPageController.getById);
router.put('/pages/:id', adminPageController.update);
router.delete('/pages/:id', adminPageController.delete);

// Product Management
router.post('/products', adminProductController.create);
router.get('/products', adminProductController.getAll);
router.get('/products/:id', adminProductController.getById);
router.put('/products/:id', adminProductController.update);
router.delete('/products/:id', adminProductController.delete);

// Store Configuration Management
router.post('/store-configurations', adminStoreConfigurationController.create);
router.get('/store-configurations', adminStoreConfigurationController.getAll);
router.get('/store-configurations/:id', adminStoreConfigurationController.getById);
router.put('/store-configurations/:id', adminStoreConfigurationController.update);
router.delete('/store-configurations/:id', adminStoreConfigurationController.delete);

// Store Landing Page Settings Management
router.post('/store-landing-page-settings', adminStoreLandingPageSettingsController.create);
router.get('/store-landing-page-settings', adminStoreLandingPageSettingsController.getAll);
router.get('/store-landing-page-settings/:id', adminStoreLandingPageSettingsController.getById);
router.put('/store-landing-page-settings/:id', adminStoreLandingPageSettingsController.update);
router.delete('/store-landing-page-settings/:id', adminStoreLandingPageSettingsController.delete);

// Store Theme Settings Management
router.post('/store-theme-settings', adminStoreThemeSettingsController.create);
router.get('/store-theme-settings', adminStoreThemeSettingsController.getAll);
router.get('/store-theme-settings/:id', adminStoreThemeSettingsController.getById);
router.put('/store-theme-settings/:id', adminStoreThemeSettingsController.update);
router.delete('/store-theme-settings/:id', adminStoreThemeSettingsController.delete);

// Store Management
router.post('/stores', adminStoreController.create);
router.get('/stores', adminStoreController.getAll);
router.get('/stores/:id', adminStoreController.getById);
router.put('/stores/:id', adminStoreController.update);
router.delete('/stores/:id', adminStoreController.delete);

// Theme Management
router.post('/themes', themeAdminController.create);
router.get('/themes', themeAdminController.getAll);
router.get('/themes/:id', themeAdminController.getById);
router.put('/themes/:id', themeAdminController.update);
router.delete('/themes/:id', themeAdminController.delete);

// Subscription Plan Management
router.post('/subscriptions', adminSubscriptionController.createSubscription);
router.get('/subscriptions', adminSubscriptionController.getAllSubscriptions);
router.get('/subscriptions/:id', adminSubscriptionController.getSubscriptionById);
router.put('/subscriptions/:id', adminSubscriptionController.updateSubscription);
router.delete('/subscriptions/:id', adminSubscriptionController.deleteSubscription);

// Promo Codes Management
router.post('/promo-codes', adminPromoCodeController.createPromoCode);
router.get('/promo-codes', adminPromoCodeController.getAllPromoCodes);
router.get('/promo-codes/:id', adminPromoCodeController.getPromoCodeById);
router.put('/promo-codes/:id', adminPromoCodeController.updatePromoCode);
router.delete('/promo-codes/:id', adminPromoCodeController.deletePromoCode);

// Payment Management
router.get('/payments', adminPaymentController.getAllPayments);
router.get('/payments/:id', adminPaymentController.getPaymentById);
router.put('/payments/:id', adminPaymentController.updatePayment);
router.delete('/payments/:id', adminPaymentController.deletePayment);

// Admin Contact Submissions Management
router.post('/contact-submissions', adminContactSubmissionController.createContactSubmission);
router.get('/contact-submissions', adminContactSubmissionController.getAllContactSubmissions);
router.get('/contact-submissions/:id', adminContactSubmissionController.getContactSubmissionById);
router.put('/contact-submissions/:id', adminContactSubmissionController.updateContactSubmission);
router.delete('/contact-submissions/:id', adminContactSubmissionController.deleteContactSubmission);

module.exports = router;