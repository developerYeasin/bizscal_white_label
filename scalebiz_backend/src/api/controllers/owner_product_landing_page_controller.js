const asyncHandler = require("../../utils/async_handler");
const ProductLandingPage = require("../models/ProductLandingPage");
const Product = require("../models/Product");
const Store = require("../models/Store");
const LandingPageTemplate = require("../models/LandingPageTemplate");
const ApiError = require("../../utils/api_error");
const pool = require("../../config/database");

// Create a new product landing page for an owner
exports.createOwnerProductLandingPage = asyncHandler(async (req, res) => {
  let {
    product_id,
    template_id,
    page_title,
    page_description,
    settings_json,
    is_active,
  } = req.body;
  const owner_id = req.user.id;
  const store_id = req.store_id || req.user.store_id;
  const store = await Store.findOne({ where: { id: store_id, owner_id } });

  if (!store) {
    throw new ApiError(404, "Store not found or not owned by current user");
  }

  const product = await Product.findOne({
    where: { id: product_id, store_id: store_id },
  });
  if (!product) {
    throw new ApiError(
      404,
      "Product not found or not associated with this store"
    );
  }

  // Generate a random 4 or 5 digit number and append to the slug for uniqueness
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generates a number between 10000 and 99999

  const productLandingPage = await ProductLandingPage.create({
    store_id: store_id,
    product_id,
    template_id,
    page_title,
    page_description,
    slug: page_title
      ? `${page_title}-${randomNumber}`
      : store_id + randomNumber,
    settings_json,
    is_active,
  });

  res.status(201).json({
    status: true,
    message: "Product Landing Page created successfully",
    data: productLandingPage,
  });
});

// Get all product landing pages for an owner
exports.getAllOwnerProductLandingPages = asyncHandler(async (req, res) => {
  const owner_id = req.user.id;

  // const query = `
  //   SELECT plp.*, s.store_name
  //   FROM product_landing_pages plp
  //   INNER JOIN stores s ON plp.store_id = s.id
  //   INNER JOIN users u ON s.id = u.store_id
  //   WHERE u.id = ?
  // `;
  const query = `SELECT plp.*,
              JSON_OBJECT('id', s.id, 'store_name', s.store_name) AS store,
              JSON_OBJECT(
                  'id', p.id, 'store_id', p.store_id, 'brand', p.brand, 'sku', p.sku, 'barcode', p.barcode,
                  'name', p.name, 'slug', p.slug, 'description', p.description, 'status', p.status,
                  'product_type', p.product_type, 'price', p.price, 'regular_price', p.regular_price,
                  'cost_price', p.cost_price, 'image_url', p.image_url, 'hover_image_url', p.hover_image_url,
                  'video_url', p.video_url, 'gender', p.gender, 'stock_quantity', p.stock_quantity,
                  'track_inventory', p.track_inventory, 'condition', p.condition, 'variants', JSON_UNQUOTE(p.variants),
                  'gallery_images', p.gallery_images,
                  'created_at', p.created_at, 'updated_at', p.updated_at
              ) AS product,
              JSON_OBJECT(
                  'id', lpt.id, 'name', lpt.name, 'description', lpt.description, 'version', lpt.version,
                  'status', lpt.status, 'access_level', lpt.access_level, 'category', lpt.category,
                  'features', lpt.features, 'preview_image_url', lpt.preview_image_url,
                  'live_demo_url', lpt.live_demo_url, 'template_config', lpt.template_config,
                  'created_at', lpt.created_at, 'updated_at', lpt.updated_at
              ) AS template
       FROM product_landing_pages plp
       JOIN stores s ON plp.store_id = s.id
       JOIN products p ON plp.product_id = p.id
       JOIN landing_page_templates lpt ON plp.template_id = lpt.id
       INNER JOIN users u ON s.id = u.store_id
       WHERE plp.deleted_at IS NULL AND u.id = ?`;
  const [productLandingPages] = await pool.query(query, [owner_id]);

  res.status(200).json({
    status: true,
    message: "Product Landing Pages retrieved successfully",
    data: productLandingPages,
  });
});

// Get a single product landing page by ID for an owner
exports.getOwnerProductLandingPageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const owner_id = req.user.id; // Assuming owner ID is available in req.user

  const productLandingPage = await ProductLandingPage.findByPk(id, {
    include: [
      { model: Store, where: { owner_id }, attributes: ["id", "store_name"] },
    ],
  });

  if (!productLandingPage) {
    throw new ApiError(
      404,
      "Product Landing Page not found or not owned by current user"
    );
  }

  res.status(200).json({
    status: true,
    message: "Product Landing Page retrieved successfully",
    data: productLandingPage,
  });
});

// Update a product landing page by ID for an owner
exports.updateOwnerProductLandingPage = asyncHandler(async (req, res) => {
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
  const owner_id = req.user.id; // Assuming owner ID is available in req.user
  console.log("req >> ", req.store_id);
  const productLandingPage = await ProductLandingPage.findOne({
    id: Number(id),
    store_id: req.store_id || req.user.store_id,
  });
  console.log("productLandingPage >> ", productLandingPage);
  if (!productLandingPage) {
    throw new ApiError(
      404,
      "Product Landing Page not found or not owned by current user"
    );
  }

  if (store_id) {
    const store = await Store.findOne({ where: { id: store_id, owner_id } });
    if (!store) {
      throw new ApiError(404, "Store not found or not owned by current user");
    }
  }

  if (product_id) {
    const product = await Product.findOne({
      where: { id: product_id, store_id: productLandingPage.store_id },
    });
    if (!product) {
      throw new ApiError(
        404,
        "Product not found or not associated with this store"
      );
    }
  }

  if (template_id) {
    const template = await LandingPageTemplate.findByPk(template_id);
    if (!template) {
      throw new ApiError(404, "Landing Page Template not found");
    }
  }

  const updateData = {
    store_id: store_id !== undefined ? store_id : productLandingPage.store_id,
    product_id:
      product_id !== undefined ? product_id : productLandingPage.product_id,
    template_id:
      template_id !== undefined ? template_id : productLandingPage.template_id,
    page_title:
      page_title !== undefined ? page_title : productLandingPage.page_title,
    page_description:
      page_description !== undefined
        ? page_description
        : productLandingPage.page_description,
    slug: slug !== undefined ? slug : productLandingPage.slug,
    settings_json:
      settings_json !== undefined
        ? settings_json
        : productLandingPage.settings_json,
    is_active:
      is_active !== undefined ? is_active : productLandingPage.is_active,
    footer_enable,
    header_enable,
  };

  const updated = await ProductLandingPage.update(id, updateData);

  if (!updated) {
    throw new ApiError(500, "Failed to update product landing page");
  }

  const updatedProductLandingPage = await ProductLandingPage.findOne({
    id,
    store: { where: { owner_id } },
  });

  res.status(200).json({
    status: true,
    message: "Product Landing Page updated successfully",
    data: updatedProductLandingPage,
  });
});

// Delete a product landing page by ID for an owner
exports.deleteOwnerProductLandingPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const owner_id = req.user.id;

  const checkQuery = `
    SELECT plp.id
    FROM product_landing_pages plp
    INNER JOIN stores s ON plp.store_id = s.id
    INNER JOIN users u ON s.id = u.store_id
    WHERE plp.id = ? AND u.id = ? AND plp.deleted_at IS NULL
  `;

  const [results] = await pool.query(checkQuery, [id, owner_id]);

  if (results.length === 0) {
    throw new ApiError(
      404,
      "Product Landing Page not found or not owned by current user"
    );
  }

  const deleteQuery =
    "UPDATE product_landing_pages SET deleted_at = NOW() WHERE id = ?";
  await pool.query(deleteQuery, [id]);

  res.status(200).json({
    status: true,
    message: "Product Landing Page deleted successfully",
  });
});
