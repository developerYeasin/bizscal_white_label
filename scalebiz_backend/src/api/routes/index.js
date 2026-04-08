const express = require("express");
const ownerRoutes = require("./owner_routes");
const storeRoutes = require("./store_routes");
const adminRoutes = require("./admin_routes");
const authRoutes = require("./auth_routes");
const uploadRoutes = require("./upload_routes");
const courierRoutes = require("./courier_routes");
const paymentRoutes = require("./payment_routes"); // Add payment routes
const contactSubmissionRoutes = require("./contact_submission_routes");

const baseDataController = require("../controllers/baseDataController");

const router = express.Router();

// Public APIs (do not require hostname or store_id)
router.get("/themes", baseDataController.get_all_themes);
router.get("/landing-page-templates", baseDataController.get_all_landing_page_templates);
router.use(contactSubmissionRoutes);

// Owner APIs (do not require hostname)
router.use("/owner", ownerRoutes);

// Admin APIs (require admin role)
router.use("/admin", adminRoutes);

// Auth APIs (do not require hostname)
router.use("/auth", authRoutes);

// Store APIs (require hostname)
router.use("/store", storeRoutes);
router.use("/uploads", uploadRoutes);
router.use("/courier", courierRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
