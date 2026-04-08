const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");
const async_handler = require("../../utils/async_handler"); // Assuming this utility exists

// Helper function to generate a unique SKU
const generateSku = () => {
  const timestamp = Date.now().toString(36); // Convert timestamp to base 36
  const randomString = Math.random().toString(36).substring(2, 7); // Random 5 characters
  return `SKU-${timestamp}-${randomString}`.toUpperCase();
};

// @desc    Get all products for the authenticated owner's store
// @route   GET /api/v1/owner/products
// @access  Private (Owner)
exports.get_all_owner_products = async_handler(async (req, res, next) => {
  try {
    const store_id = req.store_id; // Assuming store_id is available from middleware

    const {
      category_ids,
      gender,
      min_price,
      max_price,
      sort_by = "display_order_asc",
      page = 1,
      limit = 10,
      title,
    } = req.query;

    let query = `
            SELECT
                p.id, p.store_id, p.brand, p.sku, p.barcode, p.name, p.slug, p.description, p.status, p.product_type, p.price, p.regular_price, p.cost_price, p.image_url, p.hover_image_url, p.video_url, p.gender, p.stock_quantity, p.track_inventory, p.created_at, p.updated_at, p.condition, p.variants, p.details, p.faqs, p.right_col_banner, p.gallery_images, p.offer_count_down, p.is_stock_out,
                GROUP_CONCAT(
                    c.id, '|||',
                    c.name, '|||',
                    c.slug, '|||',
                    IFNULL(c.image_url, ''), '|||',
                    IFNULL(c.parent_id, ''), '|||',
                    IFNULL(c.description, ''), '|||',
                    IFNULL(c.is_active, ''), '|||',
                    IFNULL(c.is_featured, ''), '|||',
                    IFNULL(c.sort_order, '')
                    SEPARATOR ';;;'
                ) AS category_details
            FROM
                products p
            LEFT JOIN
                product_categories pc ON p.id = pc.product_id
            LEFT JOIN
                categories c ON pc.category_id = c.id
        `;
    const params = [store_id];

    let whereClauses = ["p.store_id = ?"];

    if (category_ids) {
      const ids = category_ids.split(",").map((id) => parseInt(id, 10));
      whereClauses.push(`pc.category_id IN (${ids.map(() => "?").join(",")})`);
      params.push(...ids);
    }
    if (gender) {
      whereClauses.push("p.gender = ?");
      params.push(gender);
    }
    if (min_price) {
      whereClauses.push("p.price >= ?");
      params.push(min_price);
    }
    if (max_price) {
      whereClauses.push("p.price <= ?");
      params.push(max_price);
    }

    if (title) {
      whereClauses.push("(p.name LIKE ? OR c.name LIKE ?)");
      params.push(`%${title}%`, `%${title}%`);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    query += " GROUP BY p.id"; // Add GROUP BY clause

    // Sorting
    const sortMap = {
      price_asc: "p.price ASC",
      price_desc: "p.price DESC",
      name_asc: "p.name ASC",
      name_desc: "p.name DESC",
      created_at_desc: "p.created_at DESC",
      display_order_asc: "p.display_order ASC",
    };
    query += ` ORDER BY ${sortMap[sort_by] || "p.display_order ASC"}`;

    // Pagination
    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    // Query to get total count without limit and offset
    let countQuery = `
            SELECT COUNT(DISTINCT p.id) AS total_count
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
        `;
    if (whereClauses.length > 0) {
      countQuery += " WHERE " + whereClauses.join(" AND ");
    }

    const [countResult] = await pool.query(
      countQuery,
      params.slice(0, params.length - 2)
    ); // Exclude limit and offset for count query
    const total_count = countResult[0].total_count;
    const total_pages = Math.ceil(total_count / limit);

    const [rawProducts] = await pool.query(query, params);

    const products = rawProducts.map((product) => {
      const categories = [];
      if (product.category_details) {
        product.category_details.split(";;;").forEach((catDetail) => {
          const [
            id,
            name,
            slug,
            image_url,
            parent_id,
            description,
            is_active,
            is_featured,
            sort_order,
          ] = catDetail.split("|||");
          categories.push({
            id: Number(id),
            name,
            slug,
            image_url: image_url || null,
            parent_id: parent_id ? Number(parent_id) : null,
            description: description || null,
            is_active: Boolean(Number(is_active)),
            is_featured: Boolean(Number(is_featured)),
            sort_order: Number(sort_order),
          });
        });
      }
      delete product.category_details;
      return { ...product, categories };
    });

    res.status(200).json({
      status: "success",
      results: products.length,
      total_count,
      total_pages,
      current_page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("error >> ", error);
    next(new ApiError(500, "Error fetching products."));
  }
});

// @desc    Create a new product for the authenticated owner's store
// @route   POST /api/v1/owner/products
// @access  Private (Owner)
exports.create_owner_product = async_handler(async (req, res, next) => {
  const store_id = req.store_id;
  const {
    brand,
    sku: req_sku, // Rename sku from request body to avoid conflict
    barcode,
    name,
    slug,
    description,
    status,
    product_type,
    price,
    regular_price,
    cost_price,
    image_url,
    hover_image_url,
    video_url,
    gender,
    stock_quantity,
    track_inventory,
    condition,
    variants,
    category_ids,
    details,
    faqs,
    right_col_banner,
    gallery_images,
    is_stock_out,
  } = req.body;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const sku = req_sku || generateSku(); // Use provided SKU or generate one

    const [result] = await connection.query(
      "INSERT INTO products (store_id, brand, sku, barcode, name, slug, description, status, product_type, price, regular_price, cost_price, image_url, hover_image_url, video_url, gender, stock_quantity, track_inventory, `condition`, variants, details, faqs, right_col_banner, gallery_images, is_stock_out) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        store_id,
        brand,
        sku,
        barcode,
        name,
        slug,
        description,
        status,
        product_type,
        price,
        regular_price,
        cost_price,
        image_url,
        hover_image_url,
        video_url,
        gender,
        stock_quantity,
        track_inventory,
        condition,
        JSON.stringify(variants),
        JSON.stringify(details),
        JSON.stringify(faqs),
        JSON.stringify(right_col_banner),
        JSON.stringify(gallery_images),
        is_stock_out,
      ]
    );
    const productId = result.insertId;

    if (category_ids && category_ids.length > 0) {
      const productCategoryValues = category_ids.map((categoryId) => [
        productId,
        categoryId,
      ]);
      await connection.query(
        "INSERT INTO product_categories (product_id, category_id) VALUES ?",
        [productCategoryValues]
      );
    }

    await connection.commit();
    res.status(201).json({
      status: "success",
      data: {
        product: {
          id: productId,
          brand,
          sku, // Use the generated/provided SKU
          barcode,
          name,
          slug,
          description,
          status,
          product_type,
          price,
          regular_price,
          cost_price,
          image_url,
          hover_image_url,
          video_url,
          gender,
          stock_quantity,
          track_inventory,
          condition,
          variants,
          details,
          faqs,
          right_col_banner,
          gallery_images,
          category_ids,
        },
      },
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

// @desc    Get a single product by ID for the authenticated owner's store
// @route   GET /api/v1/owner/products/:product_id
// @access  Private (Owner)
exports.get_owner_product_by_id = async_handler(async (req, res, next) => {
  const store_id = req.store_id;
  const { product_id } = req.params;

  const query = `
        SELECT
            p.id, p.store_id, p.brand, p.sku, p.barcode, p.name, p.slug, p.description, p.status, p.product_type, p.price, p.regular_price, p.cost_price, p.image_url, p.hover_image_url, p.video_url, p.gender, p.stock_quantity, p.track_inventory, p.created_at, p.updated_at, p.condition, p.variants, p.details, p.faqs, p.right_col_banner, p.gallery_images, p.offer_count_down, p.is_stock_out,
            GROUP_CONCAT(
                c.id, '|||',
                c.name, '|||',
                c.slug, '|||',
                IFNULL(c.image_url, ''), '|||',
                IFNULL(c.parent_id, ''), '|||',
                IFNULL(c.description, ''), '|||',
                IFNULL(c.is_active, ''), '|||',
                IFNULL(c.is_featured, ''), '|||',
                IFNULL(c.sort_order, '')
                SEPARATOR ';;;'
            ) AS category_details
        FROM
            products p
        LEFT JOIN
            product_categories pc ON p.id = pc.product_id
        LEFT JOIN
            categories c ON pc.category_id = c.id
        WHERE
            p.id = ? AND p.store_id = ?
        GROUP BY p.id
    `;

  const getLadningPage = `SELECT id from product_landing_pages WHERE product_id = ? AND store_id = ?`;
  const [rawProducts] = await pool.query(query, [product_id, store_id]);
  const [landing_page] = await pool.query(getLadningPage, [
    product_id,
    store_id,
  ]);
  console.log("landing_page >>", landing_page);
  if (rawProducts.length === 0) {
    return next(
      new ApiError(404, "Product not found or does not belong to your store")
    );
  }

  const product = rawProducts.map((product) => {
    const categories = [];
    if (product.category_details) {
      product.category_details.split(";;;").forEach((catDetail) => {
        const [
          id,
          name,
          slug,
          image_url,
          parent_id,
          description,
          is_active,
          is_featured,
          sort_order,
        ] = catDetail.split("|||");
        categories.push({
          id: Number(id),
          name,
          slug,
          image_url: image_url || null,
          parent_id: parent_id ? Number(parent_id) : null,
          description: description || null,
          is_active: Boolean(Number(is_active)),
          is_featured: Boolean(Number(is_featured)),
          sort_order: Number(sort_order),
        });
      });
    }
    delete product.category_details;
    return {
      ...product,
      categories,
      landing_page_id: landing_page.length > 0 ? landing_page[0].id : null,
    };
  })[0]; // Get the first (and only) product

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

// @desc    Update a product by ID for the authenticated owner's store
// @route   PUT /api/v1/owner/products/:product_id
// @access  Private (Owner)
exports.update_owner_product = async_handler(async (req, res, next) => {
  const store_id = req.store_id;
  const { product_id } = req.params;
  const {
    brand,
    sku,
    barcode,
    name,
    slug,
    description,
    status,
    product_type,
    price,
    regular_price,
    cost_price,
    image_url,
    hover_image_url,
    video_url,
    gender,
    stock_quantity,
    track_inventory,
    condition,
    variants,
    category_ids,
    details,
    faqs,
    right_col_banner,
    gallery_images,
    is_stock_out,
  } = req.body;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const updateFields = [];
    const updateValues = [];

    if (brand !== undefined) {
      updateFields.push("brand = ?");
      updateValues.push(brand);
    }
    if (sku !== undefined) {
      updateFields.push("sku = ?");
      updateValues.push(sku);
    }
    if (barcode !== undefined) {
      updateFields.push("barcode = ?");
      updateValues.push(barcode);
    }
    if (name !== undefined) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (slug !== undefined) {
      updateFields.push("slug = ?");
      updateValues.push(slug);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(description);
    }
    if (status !== undefined) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }
    if (product_type !== undefined) {
      updateFields.push("product_type = ?");
      updateValues.push(product_type);
    }
    if (price !== undefined) {
      updateFields.push("price = ?");
      updateValues.push(price);
    }
    if (regular_price !== undefined) {
      updateFields.push("regular_price = ?");
      updateValues.push(regular_price);
    }
    if (cost_price !== undefined) {
      updateFields.push("cost_price = ?");
      updateValues.push(cost_price);
    }
    if (image_url !== undefined) {
      updateFields.push("image_url = ?");
      updateValues.push(image_url);
    }
    if (hover_image_url !== undefined) {
      updateFields.push("hover_image_url = ?");
      updateValues.push(hover_image_url);
    }
    if (video_url !== undefined) {
      updateFields.push("video_url = ?");
      updateValues.push(video_url);
    }
    if (gender !== undefined) {
      updateFields.push("gender = ?");
      updateValues.push(gender);
    }
    if (stock_quantity !== undefined) {
      updateFields.push("stock_quantity = ?");
      updateValues.push(stock_quantity);
    }
    if (track_inventory !== undefined) {
      updateFields.push("track_inventory = ?");
      updateValues.push(track_inventory);
    }
    if (condition !== undefined) {
      updateFields.push("`condition` = ?");
      updateValues.push(condition);
    }
    if (variants !== undefined) {
      updateFields.push("variants = ?");
      updateValues.push(JSON.stringify(variants));
    }
    if (details !== undefined) {
      updateFields.push("details = ?");
      updateValues.push(JSON.stringify(details));
    }
    if (faqs !== undefined) {
      updateFields.push("faqs = ?");
      updateValues.push(JSON.stringify(faqs));
    }
    if (right_col_banner !== undefined) {
      updateFields.push("right_col_banner = ?");
      updateValues.push(JSON.stringify(right_col_banner));
    }
    if (gallery_images !== undefined) {
      updateFields.push("gallery_images = ?");
      updateValues.push(JSON.stringify(gallery_images));
    }
    if (is_stock_out !== undefined) {
      updateFields.push("is_stock_out = ?");
      updateValues.push(is_stock_out);
    }

    if (updateFields.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No fields to update.",
      });
    }

    const updateQuery = `UPDATE products SET ${updateFields.join(
      ", "
    )} WHERE id = ? AND store_id = ?`;
    const [result] = await connection.query(updateQuery, [
      ...updateValues,
      product_id,
      store_id,
    ]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return next(
        new ApiError(404, "Product not found or does not belong to your store.")
      );
    }

    await connection.query(
      "DELETE FROM product_categories WHERE product_id = ?",
      [product_id]
    );

    if (category_ids && category_ids.length > 0) {
      const productCategoryValues = category_ids.map((categoryId) => [
        product_id,
        categoryId,
      ]);
      await connection.query(
        "INSERT INTO product_categories (product_id, category_id) VALUES ?",
        [productCategoryValues]
      );
    }

    await connection.commit();
    res.status(200).json({
      status: "success",
      message: "Product updated successfully.",
    });
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_BAD_NULL_ERROR") {
      return next(
        new ApiError(
          400,
          `Column '${error.sqlMessage.match(/'([^']*)'/)[1]}' cannot be null.`
        )
      );
    }
    throw error;
  } finally {
    connection.release();
  }
});

// @desc    Delete a product by ID for the authenticated owner's store
// @route   DELETE /api/v1/owner/products/:product_id
// @access  Private (Owner)
exports.delete_owner_product = async_handler(async (req, res, next) => {
  const store_id = req.store_id;
  const { product_id } = req.params;

  const [result] = await pool.query(
    "DELETE FROM products WHERE id = ? AND store_id = ?",
    [product_id, store_id]
  );

  if (result.affectedRows === 0) {
    return next(
      new ApiError(404, "Product not found or does not belong to your store.")
    );
  }

  res.status(204).send();
});

// @desc    Duplicate a product as a draft for the authenticated owner's store
// @route   POST /api/v1/owner/products/:product_id/duplicate
// @access  Private (Owner)
exports.duplicate_owner_product_as_draft = async_handler(
  async (req, res, next) => {
    const store_id = req.store_id;
    const { product_id } = req.params;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Fetch the original product
      const [originalProducts] = await connection.query(
        "SELECT * FROM products WHERE id = ? AND store_id = ?",
        [product_id, store_id]
      );

      if (originalProducts.length === 0) {
        await connection.rollback();
        return next(
          new ApiError(
            404,
            "Product not found or does not belong to your store."
          )
        );
      }

      const originalProduct = originalProducts[0];

      // Fetch original product categories
      const [originalCategories] = await connection.query(
        "SELECT category_id FROM product_categories WHERE product_id = ?",
        [product_id]
      );
      const category_ids = originalCategories.map((cat) => cat.category_id);

      // Create a new product object with 'draft' status and modified fields
      const newProduct = { ...originalProduct };
      delete newProduct.id; // Remove original ID
      newProduct.status = "draft"; // Set status to draft
      newProduct.created_at = new Date(); // Update timestamps
      newProduct.updated_at = new Date();
      newProduct.name = `${originalProduct.name} (Draft)`; // Append (Draft) to name
      newProduct.slug = `${originalProduct.slug}-draft-${Date.now()}`; // Generate a new unique slug
      newProduct.sku = generateSku(); // Generate a new SKU
      newProduct.barcode = null; // Clear barcode to avoid conflicts

      // Insert the new product
      const [result] = await connection.query(
        `INSERT INTO products (store_id, brand, sku, barcode, name, slug, description, status, product_type, price, regular_price, cost_price, image_url, hover_image_url, video_url, gender, stock_quantity, track_inventory, \`condition\`, variants, details, faqs, right_col_banner, gallery_images, is_stock_out, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newProduct.store_id,
          newProduct.brand,
          newProduct.sku,
          newProduct.barcode,
          newProduct.name,
          newProduct.slug,
          newProduct.description,
          newProduct.status,
          newProduct.product_type,
          newProduct.price,
          newProduct.regular_price,
          newProduct.cost_price,
          newProduct.image_url,
          newProduct.hover_image_url,
          newProduct.video_url,
          newProduct.gender,
          newProduct.stock_quantity,
          newProduct.track_inventory,
          newProduct.condition,
          newProduct.variants ? JSON.stringify(newProduct.variants) : null,
          newProduct.details ? JSON.stringify(newProduct.details) : null,
          newProduct.faqs ? JSON.stringify(newProduct.faqs) : null,
          newProduct.right_col_banner
            ? JSON.stringify(newProduct.right_col_banner)
            : null,
          newProduct.gallery_images
            ? JSON.stringify(newProduct.gallery_images)
            : null,
          newProduct.is_stock_out,
          newProduct.created_at,
          newProduct.updated_at,
        ]
      );
      const newProductId = result.insertId;

      // Insert product categories for the new product
      if (category_ids && category_ids.length > 0) {
        const productCategoryValues = category_ids.map((categoryId) => [
          newProductId,
          categoryId,
        ]);
        await connection.query(
          "INSERT INTO product_categories (product_id, category_id) VALUES ?",
          [productCategoryValues]
        );
      }

      await connection.commit();
      res.status(201).json({
        status: "success",
        message: "Product duplicated as draft successfully.",
        data: {
          product: {
            id: newProductId,
            ...newProduct,
            category_ids,
          },
        },
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error duplicating product:", error);
      next(new ApiError(500, "Error duplicating product."));
    } finally {
      connection.release();
    }
  }
);

// @desc    Get all products for the authenticated owner's store without pagination
// @route   GET /api/v1/owner/products/all
// @access  Private (Owner)
exports.get_all_owner_products_all = async_handler(async (req, res, next) => {
  try {
    const store_id = req.store_id; // Assuming store_id is available from middleware

    const {
      category_ids,
      gender,
      min_price,
      max_price,
      sort_by = "display_order_asc",
      title,
    } = req.query;

    let query = `
            SELECT
                p.id, p.store_id, p.brand, p.sku, p.barcode, p.name, p.slug, p.description, p.status, p.product_type, p.price, p.regular_price, p.cost_price, p.image_url, p.hover_image_url, p.video_url, p.gender, p.stock_quantity, p.track_inventory, p.created_at, p.updated_at, p.condition, p.variants, p.details, p.faqs, p.right_col_banner, p.gallery_images, p.offer_count_down, p.is_stock_out,
                GROUP_CONCAT(
                    c.id, '|||',
                    c.name, '|||',
                    c.slug, '|||',
                    IFNULL(c.image_url, ''), '|||',
                    IFNULL(c.parent_id, ''), '|||',
                    IFNULL(c.description, ''), '|||',
                    IFNULL(c.is_active, ''), '|||',
                    IFNULL(c.is_featured, ''), '|||',
                    IFNULL(c.sort_order, '')
                    SEPARATOR ';;;'
                ) AS category_details
            FROM
                products p
            LEFT JOIN
                product_categories pc ON p.id = pc.product_id
            LEFT JOIN
                categories c ON pc.category_id = c.id
        `;
    const params = [store_id];

    let whereClauses = ["p.store_id = ?"];

    if (category_ids) {
      const ids = category_ids.split(",").map((id) => parseInt(id, 10));
      whereClauses.push(`pc.category_id IN (${ids.map(() => "?").join(",")})`);
      params.push(...ids);
    }
    if (gender) {
      whereClauses.push("p.gender = ?");
      params.push(gender);
    }
    if (min_price) {
      whereClauses.push("p.price >= ?");
      params.push(min_price);
    }
    if (max_price) {
      whereClauses.push("p.price <= ?");
      params.push(max_price);
    }

    if (title) {
      whereClauses.push("(p.name LIKE ? OR c.name LIKE ?)");
      params.push(`%${title}%`, `%${title}%`);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    query += " GROUP BY p.id"; // Add GROUP BY clause

    // Sorting
    const sortMap = {
      price_asc: "p.price ASC",
      price_desc: "p.price DESC",
      name_asc: "p.name ASC",
      name_desc: "p.name DESC",
      created_at_desc: "p.created_at DESC",
      display_order_asc: "p.display_order ASC",
    };
    query += ` ORDER BY ${sortMap[sort_by] || "p.display_order ASC"}`;

    const [rawProducts] = await pool.query(query, params);

    const products = rawProducts.map((product) => {
      const categories = [];
      if (product.category_details) {
        product.category_details.split(";;;").forEach((catDetail) => {
          const [
            id,
            name,
            slug,
            image_url,
            parent_id,
            description,
            is_active,
            is_featured,
            sort_order,
          ] = catDetail.split("|||");
          categories.push({
            id: Number(id),
            name,
            slug,
            image_url: image_url || null,
            parent_id: parent_id ? Number(parent_id) : null,
            description: description || null,
            is_active: Boolean(Number(is_active)),
            is_featured: Boolean(Number(is_featured)),
            sort_order: Number(sort_order),
          });
        });
      }
      delete product.category_details;
      return { ...product, categories };
    });

    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("error >> ", error);
    next(new ApiError(500, "Error fetching products."));
  }
});

// @desc    Reorder products for the authenticated owner's store
// @route   PUT /api/v1/owner/products/reorder
// @access  Private (Owner)
exports.reorderProducts = async_handler(async (req, res, next) => {
  const { orderData } = req.body; // e.g., [{ id: 5, order: 0 }, { id: 2, order: 1 }]
  console.log("orderData >> ", orderData);
  if (!orderData || !Array.isArray(orderData) || orderData.length === 0) {
    return next(new ApiError("Invalid order data.", 400));
  }

  try {
    let caseStatement = "SET display_order = CASE id ";
    const ids = [];
    const params = [];

    orderData.forEach((item) => {
      caseStatement += "WHEN ? THEN ? ";
      params.push(item.id, item.order);
      ids.push(item.id);
    });

    caseStatement += "END";

    const idPlaceholders = ids.map(() => "?").join(",");
    const sql = `UPDATE products ${caseStatement} WHERE id IN (${idPlaceholders})`;

    const finalParams = [...params, ...ids];

    await pool.query(sql, finalParams);

    res.status(200).json({ message: "Order updated successfully." });
  } catch (err) {
    console.error("Error updating product order:", err);
    next(new ApiError("Server error.", 500));
  }
});
