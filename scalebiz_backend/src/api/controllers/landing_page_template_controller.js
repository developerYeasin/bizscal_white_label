const asyncHandler = require('../../utils/async_handler');
const LandingPageTemplate = require('../models/LandingPageTemplate');
const ApiError = require('../../utils/api_error');

// Create a new landing page template
exports.createLandingPageTemplate = asyncHandler(async (req, res) => {
  const { name, description, version, status, access_level, category, features, preview_image_url, live_demo_url, template_config } = req.body;

  const landingPageTemplate = await LandingPageTemplate.create({
    name,
    description,
    version,
    status,
    access_level,
    category,
    features,
    preview_image_url,
    live_demo_url,
    template_config,
  });

  res.status(201).json({
    status: true,
    message: 'Landing Page Template created successfully',
    data: landingPageTemplate,
  });
});

// Get all landing page templates
exports.getAllLandingPageTemplates = asyncHandler(async (req, res) => {
  const landingPageTemplates = await LandingPageTemplate.findAll();

  res.status(200).json({
    status: true,
    message: 'Landing Page Templates retrieved successfully',
    data: landingPageTemplates,
  });
});

// Get a single landing page template by ID
exports.getLandingPageTemplateById = asyncHandler(async (req, res) => {
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

// Update a landing page template by ID
exports.updateLandingPageTemplate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, version, status, access_level, category, features, preview_image_url, live_demo_url, template_config } = req.body;

  const landingPageTemplate = await LandingPageTemplate.findByPk(id);
  if (!landingPageTemplate) {
    throw new ApiError(404, 'Landing Page Template not found');
  }

  await landingPageTemplate.update({
    name,
    description,
    version,
    status,
    access_level,
    category,
    features,
    preview_image_url,
    live_demo_url,
    template_config,
  });

  res.status(200).json({
    status: true,
    message: 'Landing Page Template updated successfully',
    data: landingPageTemplate,
  });
});

// Delete a landing page template by ID
exports.deleteLandingPageTemplate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const landingPageTemplate = await LandingPageTemplate.findByPk(id);

  if (!landingPageTemplate) {
    throw new ApiError(404, 'Landing Page Template not found');
  }

  await landingPageTemplate.destroy();

  res.status(200).json({
    status: true,
    message: 'Landing Page Template deleted successfully',
  });
});