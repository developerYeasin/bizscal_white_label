const express = require("express");
const { body } = require("express-validator");
const { protect, protect_owner } = require("../middlewares/auth_middleware");
const { resolve_store } = require("../middlewares/store_middleware");
const authController = require("../controllers/auth_controller");
const ownerProductController = require("../controllers/owner_product_controller");
const storeController = require("../controllers/store_controller");
// const pageController = require("../controllers/page_controller"); // Replaced by theme_controller
const themeController = require("../controllers/theme_controller");
const categoryController = require("../controllers/category_controller");
const themeSettingsController = require("../controllers/themeSettingsController");
const landingPageSettingsController = require("../controllers/landingPageSettingsController");
const baseDataController = require("../controllers/baseDataController");
const orderController = require("../controllers/order_controller");
const couponController = require("../controllers/coupon_controller");
const ownerCouponController = require("../controllers/owner_coupon_controller");
const ownerUserController = require("../controllers/owner_user_controller");
const ownerOrderController = require("../controllers/owner_order_controller");
const ownerSubscriptionController = require("../controllers/owner_subscription_controller");
const ownerProductLandingPageRoutes = require("./owner_product_landing_page_routes");
const ownerDashboardController = require("../controllers/owner_dashboard_controller");
const ownerInvoiceController = require("../controllers/owner_invoice_controller");
const ownerContactSubmissionController = require("../controllers/owner_contact_submission_controller");
const uploadRoutes = require("./upload_routes");

const router = express.Router();

// NOTE: resolve_store middleware is NOT applied globally here.
// Protected routes use `protect` which sets req.store_id from the authenticated user.
// Public routes that need store resolution should have `resolve_store` added explicitly per-route.

// Owner Dashboard
router.get(
  "/dashboard",
  protect,
  protect_owner,
  ownerDashboardController.getDashboardData,
);

// Owner Theme Settings
router.get(
  "/theme-settings",
  protect,
  protect_owner,
  themeSettingsController.get_theme_settings,
);
router.put(
  "/theme-settings",
  protect,
  protect_owner,
  themeSettingsController.update_theme_settings,
);

// Owner Landing Page Settings
router.get(
  "/landing-page-settings",
  protect,
  protect_owner,
  landingPageSettingsController.get_landing_page_settings,
);
router.put(
  "/landing-page-settings",
  protect,
  protect_owner,
  landingPageSettingsController.update_landing_page_settings,
);

// Owner Base Data (Themes and Landing Page Templates)
router.get(
  "/themes",
  protect,
  protect_owner,
  baseDataController.get_all_themes_for_owner,
);
router.get(
  "/theme-blocks",
  protect,
  protect_owner,
  themeController.get_all_theme_blocks
);
router.get(
  "/landing-page-templates",
  protect,
  protect_owner,
  baseDataController.get_all_landing_page_templates_for_owner,
);

router.get(
  "/landing-page-templates/:id",
  protect,
  protect_owner,
  baseDataController.get_landing_page_template_by_id_for_owner,
);

// Owner Authentication
router.post(
  "/auth/register",
  body("email").isEmail().normalizeEmail(),
  body("name").not().isEmpty().trim().escape(),
  body("password").isLength({ min: 6 }),
  authController.owner_register,
);
router.post("/auth/login", authController.owner_login);
router.get("/auth/me", protect, protect_owner, authController.owner_get_me);
router.put("/auth/me", protect, protect_owner, authController.owner_update_me);
router.patch(
  "/auth/update-password",
  protect,
  protect_owner,
  authController.owner_update_password,
);
router.post(
  "/auth/logout",
  protect,
  protect_owner,
  authController.owner_logout,
);

// Owner Product Management
router.get(
  "/products",
  protect,
  protect_owner,
  ownerProductController.get_all_owner_products,
);
router.get(
  "/products/all",
  protect,
  protect_owner,
  ownerProductController.get_all_owner_products_all,
);
router.post(
  "/products",
  protect,
  protect_owner,
  ownerProductController.create_owner_product,
);
router.get(
  "/products/:product_id",
  protect,
  protect_owner,
  ownerProductController.get_owner_product_by_id,
);
router.put(
  "/products/:product_id",
  protect,
  protect_owner,
  ownerProductController.update_owner_product,
);
router.delete(
  "/products/:product_id",
  protect,
  protect_owner,
  ownerProductController.delete_owner_product,
);
router.post(
  "/products/:product_id/duplicate",
  protect,
  protect_owner,
  ownerProductController.duplicate_owner_product_as_draft,
);

router.put(
  "/products-reorder",
  protect,
  protect_owner,
  ownerProductController.reorderProducts,
);

// Owner Store Management
router.get(
  "/store-configuration",
  protect,
  protect_owner,
  storeController.get_store_configuration,
);
router.put(
  "/store-configuration",
  protect,
  protect_owner,
  storeController.update_store_configuration,
);
router.put(
  "/store_hostname/:store_id",
  protect,
  protect_owner,
  storeController.update_hostname,
);
router.post("/stores", protect, storeController.create_store);
router.delete(
  "/stores/:store_id",
  protect,
  protect_owner,
  storeController.delete_store,
);

// Theme Marketplace
router.get(
  "/themes/detailed",
  protect,
  protect_owner,
  themeController.get_all_themes
);
router.get(
  "/themes/:id",
  protect,
  protect_owner,
  themeController.get_theme_detail
);
router.post(
  "/themes/apply",
  protect,
  protect_owner,
  themeController.apply_theme
);

// Custom Pages Management (Advanced Page Builder)
router.get(
  "/custom-pages",
  protect,
  protect_owner,
  themeController.get_all_pages
);
router.get(
  "/custom-pages/:id",
  protect,
  protect_owner,
  themeController.get_page
);
router.post(
  "/custom-pages",
  protect,
  protect_owner,
  themeController.create_page
);
router.put(
  "/custom-pages/:id",
  protect,
  protect_owner,
  themeController.update_page
);
router.delete(
  "/custom-pages/:id",
  protect,
  protect_owner,
  themeController.delete_page
);
router.put(
  "/custom-pages/reorder",
  protect,
  protect_owner,
  themeController.reorder_pages
);

// Public page access for storefront (no auth required, but uses resolve_store)

// Owner Category Management
router.get(
  "/categories",
  protect,
  protect_owner,
  categoryController.get_all_categories_pagination,
);
router.get(
  "/categories/:category_id",
  protect,
  protect_owner,
  categoryController.get_category_by_id,
);
router.post(
  "/categories",
  protect,
  protect_owner,
  categoryController.create_category,
);
router.put(
  "/categories/:category_id",
  protect,
  protect_owner,
  categoryController.update_category,
);
router.delete(
  "/categories/:category_id",
  protect,
  protect_owner,
  categoryController.delete_category,
);

router.get(
  "/categories-all",
  protect,
  protect_owner,
  categoryController.get_all_categories,
);
router.post(
  "/categories/:category_id/duplicate",
  protect,
  protect_owner,
  categoryController.duplicate_category_as_draft,
);

// Owner Order Management
router.post("/orders", protect, protect_owner, orderController.createOrder);

router.get(
  "/orders/report",
  protect,
  protect_owner,
  ownerOrderController.getOrderReport,
);

// Owner Order Management
router.put(
  "/orders/status/:order_id",
  protect,
  protect_owner,
  orderController.update_order_status,
);
router.put(
  "/orders/:order_id",
  protect,
  protect_owner,
  orderController.updateOrder,
); // New comprehensive update
router.delete(
  "/orders/:order_id",
  protect,
  protect_owner,
  orderController.delete_order,
);
router.get(
  "/orders-status-counts",
  protect,
  protect_owner,
  orderController.get_order_status_counts,
);

// Owner Store Orders
router.get(
  "/store/orders",
  protect,
  protect_owner,
  orderController.get_all_store_orders,
);
router.get(
  "/store/orders/:order_id",
  protect,
  protect_owner,
  orderController.get_store_order_by_id,
);
router.get(
  "/store/orders-summary",
  protect,
  protect_owner,
  orderController.get_order_summary,
);
router.get(
  "/store/orders-export",
  protect,
  protect_owner,
  orderController.export_store_orders,
);
router.get(
  "/store/customers",
  protect,
  protect_owner,
  orderController.get_all_store_customers,
);

// Owner Coupon Management
router.get(
  "/coupons",
  protect,
  protect_owner,
  ownerCouponController.getCoupons,
);
router.post(
  "/coupons",
  protect,
  protect_owner,
  ownerCouponController.createCoupon,
);
router.put(
  "/coupons/:id",
  protect,
  protect_owner,
  ownerCouponController.updateCoupon,
);
router.delete(
  "/coupons/:id",
  protect,
  protect_owner,
  ownerCouponController.deleteCoupon,
);

// Owner User Management
router.post(
  "/users/invite",
  protect,
  protect_owner,
  ownerUserController.inviteUser,
);
router.get("/users", protect, protect_owner, ownerUserController.getUsers);
router.get(
  "/users/:id",
  protect,
  protect_owner,
  ownerUserController.getUserById,
);
router.put(
  "/users/:id",
  protect,
  protect_owner,
  ownerUserController.updateUser,
);
router.delete(
  "/users/:id",
  protect,
  protect_owner,
  ownerUserController.deleteUser,
);

// Subscription Discovery & Purchase
router.get(
  "/subscriptions",
  protect,
  protect_owner,
  ownerSubscriptionController.viewAvailableSubscriptions,
);
router.post(
  "/subscribe",
  protect,
  protect_owner,
  ownerSubscriptionController.initiateSubscription,
);
router.post(
  "/payment/verify",
  protect,
  protect_owner,
  ownerSubscriptionController.verifyPayment,
);

// Subscription & Billing Management
router.get(
  "/subscription",
  protect,
  protect_owner,
  ownerSubscriptionController.getCurrentSubscription,
);
router.get(
  "/billing-history",
  protect,
  protect_owner,
  ownerSubscriptionController.getBillingHistory,
);
router.post(
  "/subscription/cancel",
  protect,
  protect_owner,
  ownerSubscriptionController.cancelSubscription,
);

// Owner Invoice Management
router.post(
  "/invoices/generate-pdf",
  protect,
  protect_owner,
  ownerInvoiceController.generateInvoicePdf,
);

// Uploads
router.use("/uploads", uploadRoutes);
router.use(
  "/product-landing-pages",
  protect,
  protect_owner,
  ownerProductLandingPageRoutes,
);

  
// Owner Contact Submissions
router.get(
  "/contact-submissions",
  protect,
  protect_owner,
  ownerContactSubmissionController.getContactSubmissions,
);
router.get(
  "/contact-submissions/:id",
  protect,
  protect_owner,
  ownerContactSubmissionController.getContactSubmissionById,
);
router.put(
  "/contact-submissions/:id/status",
  protect,
  protect_owner,
  ownerContactSubmissionController.updateContactSubmissionStatus,
);

module.exports = router;
