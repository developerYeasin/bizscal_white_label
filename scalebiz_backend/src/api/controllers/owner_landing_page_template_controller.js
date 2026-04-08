const asyncHandler = require('../../utils/async_handler');
const LandingPageTemplate = require('../models/LandingPageTemplate');
const ApiError = require('../../utils/api_error');

// Get all landing page templates for an owner
exports.getAllOwnerLandingPageTemplates = asyncHandler(async (req, res) => {
  const landingPageTemplates = await LandingPageTemplate.findAll();
  res.status(200).json({
    status: true,
    message: 'Landing Page Templates retrieved successfully',
    data: landingPageTemplates,
  });
});

// Get a single landing page template by ID for an owner
exports.getOwnerLandingPageTemplateById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const landingPageTemplate = await LandingPageTemplate.findByPk(id);

  if (!landingPageTemplate) {
    throw new ApiError(404, 'Landing Page Template not found');
  }

  res.status(200).json({
    status: true,
    message: 'Landing Page Template retrieved successfully',
    data: landingPageTemplate,
  });
});