const asyncHandler = require("../../utils/async_handler");
const ContactSubmission = require("../models/ContactSubmission");
const { ApiError } = require("../../utils/api_error");

exports.getContactSubmissions = asyncHandler(async (req, res, next) => {
  const { store_id } = req.query; // Assuming store_id is passed in params

  const submissions = await ContactSubmission.findAll(store_id);

  res.status(200).json({
    success: true,
    data: submissions,
  });
});

exports.getContactSubmissionById = asyncHandler(async (req, res, next) => {
  const { store_id, id } = req.params;

  const submission = await ContactSubmission.findOne({
    where: { id, store_id },
  });

  if (!submission) {
    return next(new ApiError(404, "Contact submission not found."));
  }

  res.status(200).json({
    success: true,
    data: submission,
  });
});

exports.updateContactSubmissionStatus = asyncHandler(async (req, res, next) => {
  const { store_id, id } = req.params;
  const { status } = req.body;

  if (!status || !["unread", "in-progress", "resolved"].includes(status)) {
    return next(new ApiError(400, "Invalid status provided."));
  }

  const submission = await ContactSubmission.findOne({
    where: { id, store_id },
  });

  if (!submission) {
    return next(new ApiError(404, "Contact submission not found."));
  }

  submission.status = status;
  await submission.save();

  res.status(200).json({
    success: true,
    message: "Contact submission status updated successfully.",
    data: submission,
  });
});
