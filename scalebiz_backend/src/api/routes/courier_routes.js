const express = require("express");
const {
  createOrder,
  bulkCreateOrder,
  checkCustomerStatus,
  issuePathaoAccessToken,
  issueRedxAccessToken,
} = require("../controllers/courier_integration_controller");
const { bulk_update_order_status } = require("../controllers/order_controller");
const { protect, protect_owner } = require("../middlewares/auth_middleware");
const router = express.Router();

// Route for creating a single order
router.post("/orders", protect, protect_owner, createOrder);

// Route for creating bulk orders
router.post("/orders/bulk", protect, protect_owner, bulkCreateOrder);

// Route for bulk updating order statuses
router.put(
  "/orders/bulk-status",
  protect,
  protect_owner,
  bulk_update_order_status
);

// Route for checking customer status by number
router.get(
  "/status/:customerNumber",
  protect,
  protect_owner,
  checkCustomerStatus
);

// Route for generating and saving Pathao access token
router.post("/pathao/issue-token", protect, protect_owner, issuePathaoAccessToken);

// Route for generating and saving RedX access token
router.post("/redx/issue-token", protect, protect_owner, issueRedxAccessToken);

module.exports = router;
