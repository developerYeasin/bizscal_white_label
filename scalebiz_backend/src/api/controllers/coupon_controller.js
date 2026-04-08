const asyncHandler = require('../../utils/async_handler');
const Coupon = require('../models/Coupon'); // Assuming you have a Coupon model

// @desc    Get coupon by code
// @route   GET /api/store/coupons/:code
// @access  Public
exports.getCoupon = asyncHandler(async (req, res, next) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.getCouponWithRestrictions(code);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found or invalid',
      });
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error); // asyncHandler will catch and pass to next, but adding for explicit try-catch
  }
});

// @desc    Validate coupon for a specific product
// @route   POST /api/store/coupons/validate
// @access  Public
exports.validateCouponForProduct = asyncHandler(async (req, res, next) => {
  try {
    const { code, product_ids, category_ids } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required.',
      });
    }

    const coupon = await Coupon.getCouponWithRestrictions(code);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found or invalid.',
      });
    }

    // Check if coupon is active
    if (!coupon.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is not active.',
      });
    }

    // Check if coupon has expired
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired.',
      });
    }

    // Check usage limit per coupon
    if (coupon.usage_limit_per_coupon !== null && coupon.times_used >= coupon.usage_limit_per_coupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit reached.',
      });
    }

    // Check minimum spend
    if (coupon.minimum_spend && req.body.cart_total < coupon.minimum_spend) {
      return res.status(400).json({
        success: false,
        message: `Minimum spend of ${coupon.minimum_spend} not met.`,
      });
    }

    // Check product restrictions
    if (coupon.restricted_products && coupon.restricted_products.length > 0) {
      if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Product IDs are required for this coupon.',
        });
      }

      const applicableProducts = product_ids.filter(id =>
        coupon.restricted_products.includes(Number(id))
      );

      if (applicableProducts.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Coupon is not applicable to any of the provided products.',
        });
      }
    }

    // Check category restrictions
    if (coupon.restricted_categories && coupon.restricted_categories.length > 0) {
      if (!category_ids || !Array.isArray(category_ids) || category_ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Category IDs are required for this coupon.',
        });
      }

      const applicableCategories = category_ids.filter(id =>
        coupon.restricted_categories.includes(Number(id))
      );

      if (applicableCategories.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Coupon is not applicable to any of the provided categories.',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Coupon is valid.',
      data: coupon,
    });
  } catch (error) {
    next(error); // asyncHandler will catch and pass to next, but adding for explicit try-catch
  }
});
