const asyncHandler = require('../../utils/async_handler');
const Coupon = require('../models/Coupon'); // Assuming you have a Coupon model
const ApiError = require('../../utils/api_error');

// @desc    Create a new coupon (Owner)
// @route   POST /api/v1/store/owner/coupons
// @access  Private (Owner)
exports.createCoupon = asyncHandler(async (req, res, next) => {
  const store_id = req.store_id;
  const {
    code,
    discount_type,
    discount_value,
    minimum_spend,
    usage_limit_per_coupon,
    usage_limit_per_customer,
    valid_from,
    valid_until,
    applies_to_products,
    applies_to_categories,
  } = req.body;

  const processed_valid_from = valid_from ? new Date(valid_from) : null;
  const processed_valid_until = valid_until ? new Date(valid_until) : null;

  // Basic validation
  if (!code || !discount_type || discount_value === undefined) {
    return next(new ApiError('Code, discount type, and discount value are required.', 400));
  }

  // Check if coupon code already exists
  const existingCoupon = await Coupon.getCouponWithRestrictions(code, store_id);
  if (existingCoupon) {
    return next(
      new ApiError("Coupon with this code already exists in your store.", 400)
    );
  }

  const newCoupon = await Coupon.create({
    code,
    discount_type,
    discount_value,
    minimum_spend,
    usage_limit_per_coupon,
    usage_limit_per_customer,
    valid_from: processed_valid_from,
    valid_until: processed_valid_until,
    applies_to_products,
    applies_to_categories,
    is_active: true,
    times_used: 0,
    store_id,
  });

  res.status(201).json({
    success: true,
    message: 'Coupon created successfully.',
    data: newCoupon,
  });
});

// @desc    Get all coupons (Owner)
// @route   GET /api/v1/store/owner/coupons
// @access  Private (Owner)
exports.getCoupons = asyncHandler(async (req, res, next) => {
    const store_id = req.store_id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { rows: coupons, count } = await Coupon.getAll({
        limit,
        offset,
        store_id,
    });

    res.status(200).json({
        success: true,
        data: coupons,
        pagination: {
            total: count,
            per_page: limit,
            current_page: page,
            last_page: Math.ceil(count / limit),
        },
    });
});

// @desc    Update a coupon (Owner)
// @route   PUT /api/v1/store/owner/coupons/:id
// @access  Private (Owner)
exports.updateCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const {
        code,
        discount_type,
        discount_value,
        minimum_spend,
        usage_limit_per_coupon,
        usage_limit_per_customer,
        valid_from,
        valid_until,
        applies_to_products,
        applies_to_categories,
        is_active,
    } = req.body;

    const store_id = req.store_id;
    const coupon = await Coupon.findByPk(id, store_id);

    if (!coupon) {
        return next(new ApiError('Coupon not found.', 404));
    }

    const processed_valid_from = valid_from ? new Date(valid_from) : null;
    const processed_valid_until = valid_until ? new Date(valid_until) : null;

    const updatedCoupon = await Coupon.update(id, {
        code,
        discount_type,
        discount_value,
        minimum_spend,
        usage_limit_per_coupon,
        usage_limit_per_customer,
        valid_from: processed_valid_from,
        valid_until: processed_valid_until,
        applies_to_products,
        applies_to_categories,
        is_active,
    }, store_id);

    res.status(200).json({
        success: true,
        message: 'Coupon updated successfully.',
        data: updatedCoupon,
    });
});

// @desc    Delete a coupon (Owner)
// @route   DELETE /api/v1/store/owner/coupons/:id
// @access  Private (Owner)
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const store_id = req.store_id;

    const coupon = await Coupon.findByPk(id, store_id);

    if (!coupon) {
        return next(new ApiError('Coupon not found.', 404));
    }

    await Coupon.destroy(id, store_id);

    res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully.',
    });
});