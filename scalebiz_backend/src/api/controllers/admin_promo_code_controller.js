const PromoCode = require("../models/PromoCode");
const asyncHandler = require("../../utils/async_handler");
const ApiError = require("../../utils/api_error");

// Create a new promo code
exports.createPromoCode = asyncHandler(async (req, res, next) => {
  const promoCode = await PromoCode.create(req.body);
  res.status(201).json(promoCode);
});

// Get all promo codes
exports.getAllPromoCodes = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const name = req.query.name || null;
  const offset = (page - 1) * limit;

  const promoCodes = await PromoCode.findAll(limit, offset, name);
  const total = await PromoCode.getTotalPromoCodesCount(name);

  res.status(200).json({
    success: true,
    data: promoCodes,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// Get a single promo code
exports.getPromoCodeById = asyncHandler(async (req, res, next) => {
  const promoCode = await PromoCode.findById(req.params.id);
  if (!promoCode) {
    return next(new ApiError("Promo code not found", 404));
  }
  res.status(200).json(promoCode);
});

// Update a promo code
exports.updatePromoCode = asyncHandler(async (req, res, next) => {
  const promoCode = await PromoCode.update(req.params.id, req.body);
  if (!promoCode) {
    return next(new ApiError("Promo code not found", 404));
  }
  res.status(200).json(promoCode);
});

// Delete a promo code
exports.deletePromoCode = asyncHandler(async (req, res, next) => {
  const success = await PromoCode.remove(req.params.id);
  if (!success) {
    return next(new ApiError("Promo code not found", 404));
  }
  res.status(204).send();
});
