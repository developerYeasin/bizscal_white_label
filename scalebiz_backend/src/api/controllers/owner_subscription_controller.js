const Subscription = require("../models/Subscription");
const Payment = require("../models/Payment");
const PromoCode = require("../models/PromoCode");
const asyncHandler = require("../../utils/async_handler");
const ApiError = require("../../utils/api_error");

// View all available subscription plans
exports.viewAvailableSubscriptions = asyncHandler(async (req, res, next) => {
  try {
    const subscriptions = await Subscription.findAllActive();
    res.status(200).json(subscriptions);
  } catch (error) {
    next(error);
  }
});

// Initiate a subscription payment
exports.initiateSubscription = asyncHandler(async (req, res, next) => {
  try {
    const { subscription_id, payment_method, promo_code } = req.body;
    const userId = req.user.id;

    const subscription = await Subscription.findById(subscription_id);
    if (!subscription) {
      return next(new ApiError("Subscription not found", 404));
    }

    let amount = subscription.price;
    let promoCodeId = null;

    if (promo_code) {
      const promo = await PromoCode.findByCode(promo_code);
      if (promo && promo.is_active && new Date(promo.end_date) > new Date()) {
        promoCodeId = promo.id;
        if (promo.discount_type === "percentage") {
          amount -= (amount * promo.discount_value) / 100;
        } else {
          amount -= promo.discount_value;
        }
      }
    }

    const transaction_id = `TXN_${Date.now()}`;

    const billing_start_date = new Date();
    const billing_end_date = new Date();
    billing_end_date.setDate(
      billing_end_date.getDate() + subscription.duration_days
    );

    await Payment.create({
      user_id: userId,
      subscription_id,
      promo_code_id: promoCodeId,
      amount,
      payment_method,
      transaction_id,
      status: "pending",
      billing_start_date,
      billing_end_date,
    });

    if (payment_method === "Stripe") {
      res.status(200).json({ payment_url: `https://checkout.stripe.com/` });
    } else {
      res
        .status(200)
        .json({
          transaction_id: transaction_id,
          payment_details: "Please complete the payment",
        });
    }
  } catch (error) {
    next(error);
  }
});

// Verify a payment
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  try {
    const { transaction_id, status } = req.body;
    const success = await Payment.verifyPayment(transaction_id, status);
    if (!success) {
      return next(new ApiError("Payment verification failed", 400));
    }
    res
      .status(200)
      .json({
        message: "Payment successful. Your subscription is now active.",
      });
  } catch (error) {
    next(error);
  }
});

// Get current subscription status
exports.getCurrentSubscription = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const subscription = await Payment.getCurrentSubscription(userId);
    if (!subscription) {
      return next(new ApiError("No active subscription found", 404));
    }
    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
});

// Get billing history
exports.getBillingHistory = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await Payment.findByUserId(userId);
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
});

// Cancel subscription
exports.cancelSubscription = asyncHandler(async (req, res, next) => {
  try {
    // This is a placeholder. In a real application, you would update the subscription
    // to not auto-renew. For now, we'll just return a success message.
    const userId = req.user.id;
    const subscription = await Payment.getCurrentSubscription(userId);
    if (!subscription) {
      return next(new ApiError("No active subscription to cancel", 404));
    }
    res
      .status(200)
      .json({
        message: `Your subscription has been cancelled and will not renew. You will have access until ${new Date(
          subscription.end_date
        ).toDateString()}.`,
      });
  } catch (error) {
    next(error);
  }
});
