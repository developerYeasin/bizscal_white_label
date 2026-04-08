const express = require("express");
const { body } = require("express-validator");
const {
  resolve_store,
  protect_store_owner,
} = require("../middlewares/store_middleware");
const { protect } = require("../middlewares/auth_middleware");
const storeController = require("../controllers/store_controller");
const storeTrackController = require("../controllers/store_track_controller");
const authController = require("../controllers/auth_controller");
const themeController = require("../controllers/theme_controller"); // New
const productController = require("../controllers/product_controller");
const cartController = require("../controllers/cart_controller");
const orderController = require("../controllers/order_controller");
const categoryController = require("../controllers/category_controller");
const couponController = require("../controllers/coupon_controller"); // Moved to top
const productLandingPageRoutes = require("./product_landing_page_routes");
const ownerInvoiceController = require("../controllers/owner_invoice_controller");
const {
  submitContactForm,
} = require("../controllers/contact_submission_controller");
const {
  checkCustomerStatus,
} = require("../controllers/courier_integration_controller");
const router = express.Router();

// Sitemap and Product Feed
// router.get("/:storeId/sitemap.xml", xmlController.generate_sitemap);
router.get("/:storeId/sitemap.xml", storeController.generate_sitemap);
router.get(
  "/:storeId/facebook-feed.xml",
  storeController.generate_facebook_feed,
);
router.get("/:storeId/tiktok-feed.xml", storeController.generate_tiktok_feed);

// All routes in this file will have the resolve_store middleware applied
router.use(resolve_store);

// Store & Content
router.get("/store_configuration", storeController.get_store_configuration);
router.get(
  "/store_configuration/integrations",
  storeController.get_store_integrations,
);
// router.put(
//   "/store_configuration/:store_id",
//   protect,
//   storeController.update_store_configuration
// );
router.route("/contact-submissions").post(submitContactForm);

// Custom Pages (Public storefront access)
router.get("/pages/:slug", themeController.get_public_page);

// Authentication
router.post(
  "/auth/register",
  body("email").isEmail().normalizeEmail(),
  body("name").not().isEmpty().trim().escape(),
  body("password").isLength({ min: 6 }),
  authController.register,
);
router.post(
  "/auth/login",
  body("email").isEmail().normalizeEmail(),
  body("password").not().isEmpty(),
  authController.login,
);
router.get("/auth/me", protect, authController.get_me);
router.post("/auth/logout", authController.logout);

// User Profile Management
router.put(
  "/auth/me",
  protect,
  body("name").optional().not().isEmpty().trim().escape(),
  body("email").optional().isEmail().normalizeEmail(),
  body("phone_number").optional().isString().trim().escape(),
  body("avatar_url").optional().isURL(),
  body("preferred_language").optional().isString().isLength({ max: 10 }),
  body("timezone").optional().isString().isLength({ max: 100 }),
  authController.update_me,
);
router.patch(
  "/auth/update-password",
  protect,
  body("current_password").not().isEmpty(),
  body("new_password").isLength({ min: 6 }),
  authController.update_password,
);

// User Management (Admin)
router.get("/users", protect, authController.get_all_users);
router.get("/users/:user_id", protect, authController.get_user_by_id);
router.put("/users/:user_id", protect, authController.update_user);
router.delete("/users/:user_id", protect, authController.delete_user);

// Products & Filtering
router.post("/products", protect, productController.create_product);
router.get("/products", productController.get_all_products);
router.get("/products/:product_id", productController.get_product_by_id);
router.put("/products/:product_id", protect, productController.update_product);
router.delete(
  "/products/:product_id",
  protect,
  productController.delete_product,
);
router.get("/filter_options", productController.get_filter_options);

// Categories
router.post("/categories", protect, categoryController.create_category);
router.get("/categories", categoryController.get_categories);
router.get("/categories/:category_id", categoryController.get_category_by_id);
router.put(
  "/categories/:category_id",
  protect,
  categoryController.update_category,
);
router.delete(
  "/categories/:category_id",
  protect,
  categoryController.delete_category,
);

// Shopping Cart (Session-based)
router.get("/cart", cartController.get_cart);
router.post("/cart/items", cartController.add_item_to_cart);
router.put("/cart/items/:item_id", cartController.update_cart_item);
router.delete("/cart/items/:item_id", cartController.remove_cart_item);
router.delete("/cart", cartController.clear_cart);

// Orders (Requires user authentication)
router.post(
  "/orders/incomplete",
  orderController.create_customer_incomplete_order,
); // API for initial incomplete order creation
router.put("/orders/:order_id", orderController.update_customer_order); // API for updating incomplete orders or finalizing them
router.get("/orders/:order_id", orderController.get_order_by_id);
router.get("/orders", protect, orderController.get_all_orders);

// Store Owner Orders (Requires store owner authentication)
router.get(
  "/owner/orders",
  protect_store_owner,
  orderController.get_all_store_orders,
);
router.get(
  "/owner/orders/:order_id",
  protect_store_owner,
  orderController.get_store_order_by_id,
);
router.put(
  "/owner/orders/:order_id",
  protect_store_owner,
  orderController.updateOrder,
); // New comprehensive update
router.delete(
  "/owner/orders/:order_id",
  protect_store_owner,
  orderController.delete_order,
);

// Coupons
router.post("/coupons/validate", couponController.validateCouponForProduct); // Public API for coupon validation

router.get("/all-products", storeController.get_store_products);
router.use("/product-landing-pages", productLandingPageRoutes);

// Store Tracking
router.post("/track-visit", storeTrackController.trackVisit);
router.post(
  "/invoices/generate-pdf",
  ownerInvoiceController.generateInvoicePdf,
);

router.get("/courier/status/:customerNumber", checkCustomerStatus);

module.exports = router;
