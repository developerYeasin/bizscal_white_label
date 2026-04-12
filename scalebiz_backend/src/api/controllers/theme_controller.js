const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");

// GET /api/v1/owner/themes - List all themes with their blocks
exports.get_all_themes = async (req, res, next) => {
  try {
    const [themes] = await pool.query(`
      SELECT
        t.*,
        (SELECT COUNT(*) FROM theme_blocks WHERE theme_id = t.id) as block_count
      FROM themes t
      ORDER BY t.id ASC
    `);

    res.status(200).json({
      status: "success",
      data: { themes },
    });
  } catch (error) {
    console.error("Error fetching themes:", error);
    next(new ApiError(500, "Failed to retrieve themes."));
  }
};

// GET /api/v1/owner/theme-blocks - List all theme blocks (for page builder)
exports.get_all_theme_blocks = async (req, res, next) => {
  try {
    const [blocks] = await pool.query(`
      SELECT tb.*, t.name as theme_name
      FROM theme_blocks tb
      JOIN themes t ON tb.theme_id = t.id
      ORDER BY tb.theme_id, tb.sort_order ASC
    `);

    // Parse JSON fields
    const parsedBlocks = blocks.map((block) => ({
      ...block,
      default_config:
        typeof block.default_config === "string"
          ? JSON.parse(block.default_config)
          : block.default_config,
      config_schema:
        typeof block.config_schema === "string"
          ? JSON.parse(block.config_schema)
          : block.config_schema,
    }));

    res.status(200).json({
      status: "success",
      data: { theme_blocks: parsedBlocks },
    });
  } catch (error) {
    console.error("Error fetching theme blocks:", error);
    next(new ApiError(500, "Failed to retrieve theme blocks."));
  }
};

// GET /api/v1/owner/themes/:id - Get single theme with all its blocks
exports.get_theme_detail = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch theme
    const [themeRows] = await pool.query("SELECT * FROM themes WHERE id = ?", [
      id,
    ]);

    if (themeRows.length === 0) {
      return next(new ApiError(404, "Theme not found."));
    }

    const theme = themeRows[0];

    // Fetch blocks for this theme
    const [blocks] = await pool.query(
      "SELECT * FROM theme_blocks WHERE theme_id = ? ORDER BY sort_order ASC",
      [id],
    );

    // Parse JSON fields
    if (theme.config)
      theme.config =
        typeof theme.config === "string"
          ? JSON.parse(theme.config)
          : theme.config;
    if (theme.blocks)
      theme.blocks =
        typeof theme.blocks === "string"
          ? JSON.parse(theme.blocks)
          : theme.blocks;
    if (theme.features)
      theme.features =
        typeof theme.features === "string"
          ? JSON.parse(theme.features)
          : theme.features;

    const parsedBlocks = blocks.map((block) => ({
      ...block,
      default_config:
        typeof block.default_config === "string"
          ? JSON.parse(block.default_config)
          : block.default_config,
      config_schema:
        typeof block.config_schema === "string"
          ? JSON.parse(block.config_schema)
          : block.config_schema,
    }));

    res.status(200).json({
      status: "success",
      data: {
        theme: {
          ...theme,
          available_blocks: parsedBlocks,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching theme detail:", error);
    next(new ApiError(500, "Failed to retrieve theme details."));
  }
};

// POST /api/v1/owner/themes/apply - Apply a theme to current store
exports.apply_theme = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { theme_id } = req.body;
    const store_id = req.store_id;

    // Validate theme exists
    const [themeRows] = await connection.query(
      "SELECT * FROM themes WHERE id = ?",
      [theme_id],
    );

    if (themeRows.length === 0) {
      await connection.rollback();
      return next(new ApiError(404, "Theme not found."));
    }

    const theme = themeRows[0];

    // Parse theme config
    const themeConfig =
      typeof theme.config === "string"
        ? JSON.parse(theme.config)
        : theme.config;

    // Update store's theme_id
    await connection.query("UPDATE stores SET theme_id = ? WHERE id = ?", [
      theme_id,
      store_id,
    ]);

    // Update store_theme_settings with theme's config values
    await connection.query(
      `
      UPDATE store_theme_settings
      SET
        theme_id = ?,
        primary_color = ?,
        secondary_color = ?,
        theme_mode = ?,
        buy_now_button_enabled = ?
      WHERE store_id = ?
    `,
      [
        theme_id,
        themeConfig.primary_color || "#6B46C1",
        themeConfig.secondary_color || "#FFFFFF",
        themeConfig.theme_mode || "Light",
        themeConfig.buy_now_button_enabled || 1,
        store_id,
      ],
    );

    // Fetch theme blocks to initialize landing page
    const [blocks] = await connection.query(
      "SELECT * FROM theme_blocks WHERE theme_id = ? ORDER BY sort_order ASC",
      [theme_id],
    );

    // Build initial landing page components from theme blocks
    const components = blocks.map((block) => ({
      id: Date.now() + Math.random(), // unique ID
      type: block.block_type,
      data: JSON.parse(block.default_config),
    }));

    // Update store_configurations.page_settings.landingPage with theme's default components
    await connection.query(
      `
      UPDATE store_configurations
      SET page_settings = JSON_SET(
        COALESCE(page_settings, '{}'),
        '$.landingPage.components', ?
      )
      WHERE store_id = ?
    `,
      [JSON.stringify(components), store_id],
    );

    await connection.commit();
    connection.release();

    res.status(200).json({
      status: "success",
      message: "Theme applied successfully.",
      data: {
        theme: {
          id: theme.id,
          name: theme.name,
          applied_at: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error applying theme:", error);
    next(new ApiError(500, "Failed to apply theme."));
  }
};

// GET /api/v1/owner/pages - List all custom pages for store
exports.get_all_pages = async (req, res, next) => {
  try {
    const store_id = req.store_id;
    const [rows] = await pool.query(
      "SELECT id, title, slug, status, sort_order, created_at, updated_at FROM pages WHERE store_id = ? ORDER BY sort_order ASC, updated_at DESC",
      [store_id],
    );

    res.status(200).json({
      status: "success",
      data: { pages: rows },
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    next(new ApiError(500, "Failed to retrieve pages."));
  }
};

// GET /api/v1/owner/pages/:id - Get single page
exports.get_page = async (req, res, next) => {
  try {
    const { id } = req.params;
    const store_id = req.store_id;

    const [rows] = await pool.query(
      "SELECT * FROM pages WHERE id = ? AND store_id = ?",
      [id, store_id],
    );

    if (rows.length === 0) {
      return next(new ApiError(404, "Page not found."));
    }

    const page = rows[0];
    // Parse content JSON if stored as string
    if (page.content && typeof page.content === "string") {
      try {
        page.content = JSON.parse(page.content);
      } catch (e) {
        // If not JSON, keep as is (legacy support)
      }
    }

    res.status(200).json({
      status: "success",
      data: { page },
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    next(new ApiError(500, "Failed to retrieve page."));
  }
};

// POST /api/v1/owner/pages - Create page
exports.create_page = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const store_id = req.store_id;

    if (!store_id) {
      await connection.rollback();
      return next(
        new ApiError(
          400,
          "User has no associated store. Please ensure your account is properly set up.",
        ),
      );
    }

    const { title, slug, content, meta_title, meta_description, status } =
      req.body;

    if (!title || !slug) {
      await connection.rollback();
      return next(new ApiError(400, "Title and slug are required."));
    }

    // Check slug uniqueness for this store
    const [existing] = await connection.query(
      "SELECT id FROM pages WHERE store_id = ? AND slug = ?",
      [store_id, slug],
    );

    if (existing.length > 0) {
      await connection.rollback();
      return next(new ApiError(400, "A page with this slug already exists."));
    }

    const [result] = await connection.query(
      `INSERT INTO pages (store_id, title, slug, content, meta_title, meta_description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        store_id,
        title,
        slug,
        JSON.stringify(content || { blocks: [] }),
        meta_title || title,
        meta_description || "",
        status || "draft",
      ],
    );

    // Get the newly created page
    const [newPage] = await connection.query(
      "SELECT * FROM pages WHERE id = ?",
      [result.insertId],
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      status: "success",
      message: "Page created successfully.",
      data: {
        page_id: result.insertId,
        page: newPage[0],
      },
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error creating page:", error.message || error);
    console.error("Stack:", error.stack);
    console.error("Request body:", JSON.stringify(req.body));
    console.error("Store ID:", req.store_id);
    next(new ApiError(500, "Failed to create page."));
  }
};

// PUT /api/v1/owner/pages/:id - Update page
exports.update_page = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const store_id = req.store_id;
    const { title, slug, content, meta_title, meta_description, status } =
      req.body;

    // Verify page exists and belongs to store
    const [existing] = await connection.query(
      "SELECT id FROM pages WHERE id = ? AND store_id = ?",
      [id, store_id],
    );

    if (existing.length === 0) {
      await connection.rollback();
      return next(new ApiError(404, "Page not found."));
    }

    // Check slug uniqueness if changing
    if (slug) {
      const [slugCheck] = await connection.query(
        "SELECT id FROM pages WHERE store_id = ? AND slug = ? AND id != ?",
        [store_id, slug, id],
      );

      if (slugCheck.length > 0) {
        await connection.rollback();
        return next(new ApiError(400, "A page with this slug already exists."));
      }
    }

    await connection.query(
      `UPDATE pages SET
        title = ?,
        slug = ?,
        content = ?,
        meta_title = ?,
        meta_description = ?,
        status = ?
       WHERE id = ? AND store_id = ?`,
      [
        title,
        slug,
        content ? JSON.stringify(content) : JSON.stringify({ blocks: [] }),
        meta_title || title,
        meta_description || "",
        status || "draft",
        id,
        store_id,
      ],
    );

    await connection.commit();
    connection.release();

    res.status(200).json({
      status: "success",
      message: "Page updated successfully.",
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error updating page:", error);
    next(new ApiError(500, "Failed to update page."));
  }
};

// DELETE /api/v1/owner/pages/:id - Delete page
exports.delete_page = async (req, res, next) => {
  try {
    const { id } = req.params;
    const store_id = req.store_id;

    const [result] = await pool.query(
      "DELETE FROM pages WHERE id = ? AND store_id = ?",
      [id, store_id],
    );

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "Page not found."));
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting page:", error);
    next(new ApiError(500, "Failed to delete page."));
  }
};

// GET /api/v1/store/pages/:slug - Get published page for storefront (public)
exports.get_public_page = async (req, res, next) => {
  try {
    const { slug } = req.params;
    console.log("slug >>", slug);
    // store_id is resolved by resolve_store middleware
    const store_id = req.store_id;

    const [rows] = await pool.query(
      "SELECT * FROM pages WHERE store_id = ? AND slug = ? AND status = 'published'",
      [store_id, slug],
    );

    if (rows.length === 0) {
      return next(new ApiError(404, "Page not found."));
    }

    const page = rows[0];
    if (page.content && typeof page.content === "string") {
      try {
        page.content = JSON.parse(page.content);
      } catch (e) {
        // ignore
      }
    }

    res.status(200).json({
      status: "success",
      data: { page },
    });
  } catch (error) {
    console.error("Error fetching public page:", error);
    next(new ApiError(500, "Failed to retrieve page."));
  }
};

// PUT /api/v1/owner/pages/reorder - Update page ordering
exports.reorder_pages = async (req, res, next) => {
  try {
    const store_id = req.store_id;
    const { orders } = req.body; // Expect array of { id, sort_order }

    if (!Array.isArray(orders)) {
      return next(new ApiError(400, "Invalid orders data. Expected an array."));
    }

    // Validate all IDs exist and belong to this store
    const pageIds = orders.map((o) => o.id);
    if (pageIds.length === 0) {
      return next(new ApiError(400, "No pages provided."));
    }

    // Fetch existing pages to verify ownership
    const [existing] = await pool.query(
      `SELECT id FROM pages WHERE store_id = ? AND id IN (?)`,
      [store_id, pageIds],
    );
    const existingIds = existing.map((p) => p.id);
    const invalidIds = pageIds.filter((id) => !existingIds.includes(id));
    if (invalidIds.length > 0) {
      return next(
        new ApiError(
          403,
          `Some pages do not belong to this store: ${invalidIds.join(", ")}`,
        ),
      );
    }

    // Update sort_order for each page
    for (const item of orders) {
      await pool.query(
        `UPDATE pages SET sort_order = ? WHERE id = ? AND store_id = ?`,
        [item.sort_order, item.id, store_id],
      );
    }

    res.status(200).json({
      status: "success",
      message: "Page order updated successfully.",
    });
  } catch (error) {
    console.error("Error updating page order:", error);
    next(new ApiError(500, "Failed to update page order."));
  }
};
