const asyncHandler = require("../../utils/async_handler");
const ContactSubmission = require("../models/ContactSubmission");
const { ApiError } = require("../../utils/api_error");

exports.getAllContactSubmissions = asyncHandler(async (req, res, next) => {
  const submissions = await ContactSubmission.findAll({
    order: [["created_at", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: submissions,
  });
});

exports.getContactSubmissionById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const submission = await ContactSubmission.findByPk(id);

  if (!submission) {
    return next(new ApiError(404, "Contact submission not found."));
  }

  res.status(200).json({
    success: true,
    data: submission,
  });
});

exports.createContactSubmission = asyncHandler(async (req, res, next) => {
  const { store_id, full_name, email, phone, subject, order_number, message, status } = req.body;

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
    status,
  });

  res.status(201).json({
    success: true,
    message: "Contact submission created successfully.",
    data: submission,
  });
});

exports.updateContactSubmission = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { store_id, full_name, email, phone, subject, order_number, message, status } = req.body;

  const submission = await ContactSubmission.findByPk(id);

  if (!submission) {
    return next(new ApiError(404, "Contact submission not found."));
  }

  submission.store_id = store_id || submission.store_id;
  submission.full_name = full_name || submission.full_name;
  submission.email = email || submission.email;
  submission.phone = phone || submission.phone;
  submission.subject = subject || submission.subject;
  submission.order_number = order_number || submission.order_number;
  submission.message = message || submission.message;
  submission.status = status || submission.status;

  await submission.save();

  res.status(200).json({
    success: true,
    message: "Contact submission updated successfully.",
    data: submission,
  });
});

exports.deleteContactSubmission = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const submission = await ContactSubmission.findByPk(id);

  if (!submission) {
    return next(new ApiError(404, "Contact submission not found."));
  }

  await submission.destroy();

  res.status(200).json({
    success: true,
    message: "Contact submission deleted successfully.",
  });
});
