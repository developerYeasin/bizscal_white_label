const asyncHandler = require("../../utils/async_handler");
const ContactSubmission = require("../models/ContactSubmission");
const { ApiError } = require("../../utils/api_error");

exports.submitContactForm = asyncHandler(async (req, res, next) => {
  const { store_id, full_name, email, phone, subject, order_number, message } = req.body;

  if (!store_id || !full_name || !email || !message) {
    return next(new ApiError(400, "Store ID, full name, email, and message are required."));
  }

  const submission = await ContactSubmission.create({
    store_id,
    full_name,
    email,
    phone,
    subject,
    order_number,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Contact form submitted successfully.",
    data: submission,
  });
});
