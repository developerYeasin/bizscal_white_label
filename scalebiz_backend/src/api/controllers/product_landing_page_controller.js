const asyncHandler = require("../../utils/async_handler");
const ProductLandingPage = require("../models/ProductLandingPage");
const Product = require("../models/Product");
const Store = require("../models/Store");
const LandingPageTemplate = require("../models/LandingPageTemplate");
const ApiError = require("../../utils/api_error");
const pool = require("../../config/database");

// Create a new product landing page
const createProductLandingPage = asyncHandler(async (req, res) => {
  const {
    store_id,
    product_id,
    template_id,
    page_title,
    page_description,
    slug,
    settings_json,
    is_active,
    footer_enable,
    header_enable,
  } = req.body;

  const store = await Store.findByPk(store_id);
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  const product = await Product.findByPk(product_id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const template = await LandingPageTemplate.findByPk(template_id);
  if (!template) {
    throw new ApiError(404, "Landing Page Template not found");
  }

  const productLandingPage = await ProductLandingPage.create({
    store_id,
    product_id,
    template_id,
    page_title,
    page_description,
    slug,
    settings_json,
    is_active,
    footer_enable,
    header_enable,
  });

  res.status(201).json({
    status: true,
    message: "Product Landing Page created successfully",
    data: productLandingPage,
  });
});

// Get all product landing pages
const getAllProductLandingPages = asyncHandler(async (req, res) => {
  const productLandingPages = await ProductLandingPage.findAll();

  res.status(200).json({
    status: true,
    message: "Product Landing Pages retrieved successfully",
    data: productLandingPages,
  });
});

// Get a single product landing page by ID
const getProductLandingPageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productLandingPage = await ProductLandingPage.findByPk(id);

  if (!productLandingPage) {
    throw new ApiError(404, "Product Landing Page not found");
  }

  const product = await Product.findByPk(productLandingPage.product_id);

  res.status(200).json({
    status: true,
    message: "Product Landing Page retrieved successfully",
    data: {
      ...productLandingPage,
      faqs: product ? product.faqs : null,
      right_col_banner: product ? product.right_col_banner : null,
      gallery_images: product ? product.gallery_images : null,
    },
  });
});

// Update a product landing page by ID
const updateProductLandingPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    store_id,
    product_id,
    template_id,
    page_title,
    page_description,
    slug,
    settings_json,
    is_active,
    footer_enable,
    header_enable,
  } = req.body;

  const productLandingPage = await ProductLandingPage.findByPk(id);
  if (!productLandingPage) {
    throw new ApiError(404, "Product Landing Page not found");
  }

  if (store_id) {
    const store = await Store.findByPk(store_id);
    if (!store) {
      throw new ApiError(404, "Store not found");
    }
  }

  if (product_id) {
    const product = await Product.findByPk(product_id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
  }

  if (template_id) {
    const template = await LandingPageTemplate.findByPk(template_id);
    if (!template) {
      throw new ApiError(404, "Landing Page Template not found");
    }
  }

  const updated = await ProductLandingPage.update(id, {
    store_id,
    product_id,
    template_id,
    page_title,
    page_description,
    slug,
    settings_json,
    is_active,
    footer_enable,
    header_enable,
  });

  if (!updated) {
    throw new ApiError(500, "Failed to update Product Landing Page");
  }

  res.status(200).json({
    status: true,
    message: "Product Landing Page updated successfully",
    data: productLandingPage,
  });
});

// Delete a product landing page by ID
const deleteProductLandingPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productLandingPage = await ProductLandingPage.findByPk(id);

  if (!productLandingPage) {
    throw new ApiError(404, "Product Landing Page not found");
  }

  const deleted = await ProductLandingPage.destroy(id);
  if (!deleted) {
    throw new ApiError(500, "Failed to delete Product Landing Page");
  }

  res.status(200).json({
    status: true,
    message: "Product Landing Page deleted successfully",
  });
});

// Get a single public product landing page by ID
const getPublicProductLandingPageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productLandingPage = await ProductLandingPage.findByPk(id);

  if (!productLandingPage) {
    throw new ApiError(404, "Product Landing Page not found");
  }

  const storeId = productLandingPage.store_id;
  const product = await Product.findByPk(productLandingPage.product_id);

  // Find the next product landing page ID
  const [nextProductLandingPageRows] = await pool.query(
    `SELECT id FROM product_landing_pages
     WHERE store_id = ? AND id > ? AND deleted_at IS NULL
     ORDER BY id ASC
     LIMIT 1`,
    [storeId, id]
  );
  const nextSingleProductId =
    nextProductLandingPageRows.length > 0
      ? nextProductLandingPageRows[0].id
      : null;

  // Find the previous product landing page ID
  const [previousProductLandingPageRows] = await pool.query(
    `SELECT id FROM product_landing_pages
     WHERE store_id = ? AND id < ? AND deleted_at IS NULL
     ORDER BY id DESC
     LIMIT 1`,
    [storeId, id]
  );
  const previousSingleProductId =
    previousProductLandingPageRows.length > 0
      ? previousProductLandingPageRows[0].id
      : null;

  res.status(200).json({
    status: true,
    message: "Product Landing Page retrieved successfully",
    data: {
      ...productLandingPage,
      faqs: product ? product.faqs : null,
      right_col_banner: product ? product.right_col_banner : null,
      gallery_images: product ? product.gallery_images : null,
      next_single_product_id: nextSingleProductId,
      previous_single_product_id: previousSingleProductId,
    },
  });
});

module.exports = {
  createProductLandingPage,
  getAllProductLandingPages,
  getProductLandingPageById,
  updateProductLandingPage,
  deleteProductLandingPage,
  getPublicProductLandingPageById,
};
