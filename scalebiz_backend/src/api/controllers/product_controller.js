const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");

// GET /api/v1/products
exports.get_all_products = async (req, res, next) => {
  try {
    const {
      category_ids,
      gender,
      min_price,
      max_price,
      sort_by = "display_order_asc",
      page = 1,
      limit = 10,
      search, // text search in product name
      ids, // comma-separated product IDs
    } = req.query;

    let query = `
            SELECT
                p.id, p.store_id, p.brand, p.sku, p.barcode, p.name, p.slug, p.description, p.status, p.product_type, p.price, p.regular_price, p.cost_price, p.image_url, p.hover_image_url, p.video_url, p.gender, p.stock_quantity, p.track_inventory, p.created_at, p.updated_at, p.condition, p.variants, p.offer_count_down, p.details, p.faqs, p.right_col_banner, p.gallery_images, p.is_stock_out,
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
    const params = [req.store_id];

    let whereClauses = ["p.store_id = ?"];

    if (category_ids) {
      const ids = category_ids.split(",").map((id) => parseInt(id, 10)).filter(id => !isNaN(id));
      if (ids.length > 0) {
        whereClauses.push(`pc.category_id IN (${ids.map(() => "?").join(",")})`);
        params.push(...ids);
      }
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
    if (search) {
      whereClauses.push("p.name LIKE ?");
      params.push(`%${search}%`);
    }
    if (ids) {
      const productIds = ids.split(",").map((id) => parseInt(id, 10)).filter(id => !isNaN(id));
      if (productIds.length > 0) {
        whereClauses.push(`p.id IN (${productIds.map(() => "?").join(",")})`);
        params.push(...productIds);
      }
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
    // console.log("products >> ", products);

    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  } catch (error) {
    console.error("error >> ", error);
    next(new ApiError(500, "Error fetching products."));
  }
};

// GET /api/v1/products/:product_id
exports.get_product_by_id = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const [rawProducts] = await pool.query(
      `
            SELECT
                p.id, p.store_id, p.brand, p.sku, p.barcode, p.name, p.slug, p.description, p.status, p.product_type, p.price, p.regular_price, p.cost_price, p.image_url, p.hover_image_url, p.video_url, p.gender, p.stock_quantity, p.track_inventory, p.created_at, p.updated_at, p.condition, p.variants, p.offer_count_down, p.details, p.faqs, p.right_col_banner, p.gallery_images, p.is_stock_out,
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
            `,
      [product_id, req.store_id]
    );

    if (rawProducts.length === 0) {
      return next(new ApiError(404, "Product not found."));
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
      return { ...product, categories };
    })[0];

    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    console.log("error", error);
    next(new ApiError(500, "Error fetching product details."));
  }
};

// GET /api/v1/filter_options
exports.get_filter_options = async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      "SELECT id, name, slug FROM categories WHERE store_id = ? ORDER BY name ASC",
      [req.store_id]
    );

    const [priceRange] = await pool.query(
      "SELECT MIN(price) as min_price, MAX(price) as max_price FROM products WHERE store_id = ?",
      [req.store_id]
    );

    const [genders] = await pool.query(
      "SELECT DISTINCT gender FROM products WHERE store_id = ? AND gender IS NOT NULL",
      [req.store_id]
    );

    res.status(200).json({
      status: "success",
      data: {
        filters: {
          categories,
          price_range: priceRange[0],
          genders: genders.map((g) => g.gender),
        },
      },
    });
  } catch (error) {
    next(new ApiError(500, "Error fetching filter options."));
  }
};
// POST /api/v1/products
exports.create_product = async (req, res, next) => {
  try {
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
      offer_count_down,
      details,
      faqs,
      right_col_banner,
      gallery_images,
      is_stock_out,
    } = req.body;
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [result] = await connection.query(
        "INSERT INTO products (store_id, brand, sku, barcode, name, slug, description, status, product_type, price, regular_price, cost_price, image_url, hover_image_url, video_url, gender, stock_quantity, track_inventory, `condition`, variants, offer_count_down, details, faqs, right_col_banner, gallery_images, is_stock_out) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.store_id,
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
          offer_count_down,
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
            offer_count_down,
            details,
            faqs,
            right_col_banner,
            gallery_images,
          },
        },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Product creation error:", error); // Add logging here
    next(new ApiError(500, "Error creating product."));
  }
};

// PUT /api/v1/products/:product_id
exports.update_product = async (req, res, next) => {
  try {
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
      offer_count_down,
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
      if (offer_count_down !== undefined) {
        updateFields.push("offer_count_down = ?");
        updateValues.push(offer_count_down);
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
      await connection.query(updateQuery, [
        ...updateValues,
        product_id,
        req.store_id,
      ]);

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
  } catch (error) {
    console.log("error", error);
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(500, "Error updating product."));
  }
};

// DELETE /api/v1/products/:product_id
exports.delete_product = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM products WHERE id = ? AND store_id = ?",
      [product_id, req.store_id]
    );

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "Product not found."));
    }

    res.status(204).send();
  } catch (error) {
    next(new ApiError(500, "Error deleting product."));
  }
};
