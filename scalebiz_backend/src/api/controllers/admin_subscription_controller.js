const Subscription = require("../models/Subscription");
const ApiError = require("../../utils/api_error");

// Create a new subscription plan
exports.createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
};

// Get all subscription plans
exports.getAllSubscriptions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name || null;
    const offset = (page - 1) * limit;

    const subscriptions = await Subscription.findAll(limit, offset, name);
    const total = await Subscription.getTotalSubscriptionsCount(name);

    res.status(200).json({
      success: true,
      data: subscriptions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log("error >> ", error);
    next(error);
  }
};

// Get a single subscription plan
exports.getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return next(new ApiError("Subscription not found", 404));
    }
    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};

// Update a subscription plan
exports.updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.update(req.params.id, req.body);
    if (!subscription) {
      return next(new ApiError("Subscription not found", 404));
    }
    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};

// Delete a subscription plan
exports.deleteSubscription = async (req, res, next) => {
  try {
    const success = await Subscription.remove(req.params.id);
    if (!success) {
      return next(new ApiError("Subscription not found", 404));
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
