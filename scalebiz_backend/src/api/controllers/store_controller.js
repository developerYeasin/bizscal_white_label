const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");
const xmlbuilder = require("xmlbuilder");

// GET /api/v1/store_configuration
// exports.get_store_configuration = async (req, res, next) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT
//         sc.id,
//         s.theme_id,
//         s.hostname,
//         s.store_name,
//         s.logo_url,
//         s.favicon_url,
//         sc.theme_settings,
//         sc.layout_settings,
//         sc.delivery_settings,
//         sc.page_settings
//       FROM stores s
//       LEFT JOIN store_configurations sc ON s.id = sc.store_id
//       WHERE s.id = ?`,
//       [req.store_id]
//     );
//     if (rows.length === 0) {
//       return next(new ApiError(404, "Store configuration not found."));
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         configuration: rows[0],
//       },
//     });
//   } catch (error) {
//     next(new ApiError(500, "Error fetching store configuration."));
//   }
// };
exports.get_store_configuration = async (req, res, next) => {
  try {
    // --- Query 1: Get the main store and configuration details ---
    const [configRows] = await pool.query(
      `SELECT
        sc.id,
        sc.store_id,
        s.theme_id,
        s.hostname,
        s.store_name,
        s.logo_url,
        s.favicon_url,
        sc.layout_settings,
        sc.integrations,
        sc.delivery_settings,
        sc.payment_settings,
        sc.page_settings,
        sc.fraud_prevention,
        sc.rbc_buttons
      FROM stores s
      LEFT JOIN store_configurations sc ON s.id = sc.store_id
      WHERE s.id = ?`,
      [req.store_id]
    );

    if (configRows.length === 0) {
      return next(new ApiError(404, "Store configuration not found."));
    }

    const configuration = configRows[0];

    if (configuration.fraud_prevention) {
      configuration.fraud_prevention = configuration.fraud_prevention;
    }
    if (configuration.rbc_buttons && typeof configuration.rbc_buttons === 'string') {
        try {
            configuration.rbc_buttons = JSON.parse(configuration.rbc_buttons);
        } catch (error) {
            console.error("Failed to parse rbc_buttons JSON in get_store_configuration:", error);
        }
    }

    // --- Query 2: Get the theme settings ---
    // ⚠️ IMPORTANT: Replace 'your_key_column' and 'your_value_column' below!
    const [themeSettingsRows] = await pool.query(
      `SELECT *
       FROM store_theme_settings 
       WHERE store_id = ?`,
      [req.store_id]
    );

    configuration.theme_settings = themeSettingsRows[0];
    res.status(200).json({
      status: "success",
      data: {
        configuration: configuration,
      },
    });
  } catch (error) {
    console.error("Error fetching store configuration:", error);
    next(new ApiError(500, "Error fetching store configuration."));
  }
};
// GET /api/v1/store_configuration/integrations
exports.get_store_integrations = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        sc.integrations
      FROM stores s
      LEFT JOIN store_configurations sc ON s.id = sc.store_id
      WHERE s.id = ?`,
      [req.store_id]
    );

    if (rows.length === 0 || !rows[0].integrations) {
      return next(new ApiError(404, "Store integrations not found."));
    }

    res.status(200).json({
      status: "success",
      integrations: rows[0].integrations,
    });
  } catch (error) {
    console.error("Error fetching store integrations:", error);
    next(new ApiError(500, "Error fetching store integrations."));
  }
};
// PUT /api/v1/store_configuration
exports.update_store_configuration = async (req, res, next) => {
  try {
    console.log("req.body >> ", req.body);
    const {
      store_name,
      logo_url,
      layout_settings,
      localization_settings,
      payment_settings,
      integrations,
      notification_settings,
      delivery_settings,
      page_settings,
      theme_settings,
      theme_id,
      favicon_url,
      fraud_prevention,
      rbc_buttons,
    } = req.body;
    const store_id = req.store_id;

    const storeFields = {
      store_name,
      logo_url,
      theme_id,
      favicon_url,
    };
    const configFields = {
      layout_settings,
      localization_settings,
      payment_settings,
      integrations,
      notification_settings,
      delivery_settings,
      page_settings,
      fraud_prevention,
      rbc_buttons,
    };

    const storeEntries = Object.entries(storeFields).filter(
      ([, value]) => value !== undefined
    );
    const configEntries = Object.entries(configFields).filter(
      ([, value]) => value !== undefined
    );

    if (storeEntries.length === 0 && configEntries.length === 0) {
      return next(new ApiError(400, "No fields to update."));
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      if (storeEntries.length > 0) {
        const storeSetClause = storeEntries
          .map(([key]) => `${key} = ?`)
          .join(", ");
        const storeValues = storeEntries.map(([, value]) => value);
        await connection.query(
          `UPDATE stores SET ${storeSetClause} WHERE id = ?`,
          [...storeValues, store_id]
        );
      }

      if (configEntries.length > 0) {
        const configSetClause = configEntries
          .map(([key]) => `${key} = ?`)
          .join(", ");
        const configValues = configEntries.map(([, value]) =>
          typeof value === "object" ? JSON.stringify(value) : value
        );
        await connection.query(
          `UPDATE store_configurations SET ${configSetClause} WHERE store_id = ?`,
          [...configValues, store_id]
        );
      }

      // Update store_theme_settings if theme_settings are provided
      if (theme_settings) {
        const allowedThemeFields = [
          "theme_id",
          "primary_color",
          "secondary_color",
          "accent_color",
          "text_color",
          "typography",
          "button_style",
          "announcement_bar",
          "product_card_style",
          "theme_mode",
          "buy_now_button_enabled",
        ];

        const updatableThemeSettings = {};
        for (const key of allowedThemeFields) {
          if (theme_settings[key] !== undefined) {
            // Ensure JSON fields are stringified if they come as objects
            if (
              ["typography", "button_style", "announcement_bar", "product_card_style"].includes(key) &&
              typeof theme_settings[key] === "object" &&
              theme_settings[key] !== null
            ) {
              updatableThemeSettings[key] = JSON.stringify(theme_settings[key]);
            } else if (
              ["product_card_style"].includes(key) &&
              typeof theme_settings[key] === "string"
            ) {
               // Handle case where it's passed as a simple string but expected as JSON
               // If it's just 'default', maybe it needs to be '{"style":"default"}'?
               // Looking at the error, it says 'Invalid JSON text', so it probably expects a JSON string like '"{...}"' or '{"...":"..."}'
               // Let's assume it should be treated as a JSON string.
               try {
                 JSON.parse(theme_settings[key]);
                 updatableThemeSettings[key] = theme_settings[key];
               } catch (e) {
                 updatableThemeSettings[key] = JSON.stringify(theme_settings[key]);
               }
            } else {
              updatableThemeSettings[key] = theme_settings[key];
            }
          }
        }

        const themeSettingsEntries = Object.entries(
          updatableThemeSettings
        ).filter(([, value]) => value !== undefined);

        if (themeSettingsEntries.length > 0) {
          const themeSetClause = themeSettingsEntries
            .map(([key]) => `${key} = ?`)
            .join(", ");
          const themeValues = themeSettingsEntries.map(([, value]) =>
            typeof value === "object" ? JSON.stringify(value) : value
          );
          await connection.query(
            `UPDATE store_theme_settings SET ${themeSetClause} WHERE store_id = ?`,
            [...themeValues, store_id]
          );
        }
      }

      await connection.commit();
      res.status(200).json({
        status: "success",
        message: "Store configuration updated successfully.",
      });
    } catch (error) {
      console.log("error >> ", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.log("error >> ", error);
    next(new ApiError(500, "Error updating store configuration."));
  }
};

// PUT /api/v1/store_hostname/:store_id
exports.update_hostname = async (req, res, next) => {
  try {
    const { hostname } = req.body;
    const store_id = req.store_id;

    if (!hostname) {
      return next(new ApiError(400, "Hostname is required."));
    }

    // Check if the hostname already exists for another store
    const [existingHostname] = await pool.query(
      `SELECT id FROM stores WHERE hostname = ? AND id != ?`,
      [hostname, store_id]
    );

    if (existingHostname.length > 0) {
      return next(new ApiError(400, "Hostname already exists for another store."));
    }

    // Update the hostname for the current store
    await pool.query(`UPDATE stores SET hostname = ? WHERE id = ?`,
      [hostname, store_id]
    );

    res.status(200).json({
      status: "success",
      message: "Hostname updated successfully.",
    });
  } catch (error) {
    console.error("Error updating hostname:", error);
    next(new ApiError(500, "Error updating hostname."));
  }
};
// POST /api/v1/stores
exports.create_store = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      store_name,
      business_type,
      country,
      shop_address,
      shop_email,
      shop_phone_number,
      shop_details,
      topbar_announcement,
    } = req.body;

    // Generate a unique hostname from store name
    const generateHostname = (name) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    };

    const hostname = generateHostname(store_name);
    const theme_id = 1; // Default theme ID

    // Create the store with required and optional fields
    const [storeResult] = await connection.query(
      `INSERT INTO stores
        (store_name, theme_id, hostname, country, contact_email,
         business_type, address, phone_number, shop_details, topbar_announcement)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        store_name,
        theme_id,
        hostname,
        country || null,
        shop_email || null,
        business_type || null,
        shop_address || null,
        shop_phone_number || null,
        shop_details || null,
        topbar_announcement || null,
      ]
    );

    const store_id = storeResult.insertId;

    const defaultLandingPage = {
      policies: {},
      landingPage: {
        components: [
          {
            id: 1760266910721,
            data: {
              title: "All Products",
              cardType: "default",
              subtitle: "Catchy subtitle goes here.",
              productsPerView: 4,
            },
            type: "allProducts",
          },
        ],
      },
    };

    const paymentSettings = {
      note: "",
      cod_enabled: true,
    };

    // Create default store configuration
    await connection.query(
      "INSERT INTO store_configurations (store_id, page_settings, payment_settings) VALUES (?, ?, ?)",
      [
        store_id,
        JSON.stringify(defaultLandingPage),
        JSON.stringify(paymentSettings),
      ]
    );

    // Create default store theme settings
    await connection.query(
      "INSERT INTO store_theme_settings (store_id, theme_id) VALUES (?, ?)",
      [store_id, theme_id]
    );

    // Create default store landing page settings
    await connection.query(
      "INSERT INTO store_landing_page_settings (store_id, landing_page_template_id) VALUES (?, ?)",
      [store_id, 1]
    );

    await connection.query("UPDATE users SET store_id = ? WHERE id = ?", [
      store_id,
      req.user.id,
    ]);

    await connection.commit();

    res.status(201).json({
      status: "success",
      message: "Store created successfully.",
      data: { store_id, hostname },
    });
  } catch (error) {
    console.log("error >> ", error);
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      return next(new ApiError(400, "Hostname already exists."));
    }
    next(new ApiError(500, "Failed to create store."));
  } finally {
    connection.release();
  }
};

// DELETE /api/v1/stores/:store_id
exports.delete_store = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { store_id } = req.params;

    // Note: You should have cascading deletes in your database schema for this to work cleanly.
    // If not, you'll need to delete from child tables first (store_configurations, products, etc.)
    const [result] = await connection.query("DELETE FROM stores WHERE id = ?", [
      store_id,
    ]);

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "Store not found."));
    }

    await connection.commit();

    res.status(204).send();
  } catch (error) {
    await connection.rollback();
    next(new ApiError(500, "Failed to delete store."));
  } finally {
    connection.release();
  }
};

// GET /api/v1/stores/:storeId/products
exports.get_store_products = async (req, res, next) => {
  try {
    const storeId = req.store_id;
    const { title } = req.query;

    let query = `
      SELECT
        p.id, p.store_id, p.brand, p.sku, p.barcode, p.name, p.slug, p.description, p.status, p.product_type, p.price, p.regular_price, p.cost_price, p.image_url, p.hover_image_url, p.video_url, p.gender, p.stock_quantity, p.track_inventory, p.created_at, p.updated_at, p.condition, p.variants, p.offer_count_down, p.gallery_images,
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

    const queryParams = [];
    let whereClauses = [];

    if (storeId) {
      whereClauses.push(`p.store_id = ?`);
      queryParams.push(storeId);
    }

    if (title) {
      whereClauses.push(`(p.name LIKE ? OR c.name LIKE ?)`);
      queryParams.push(`%${title}%`, `%${title}%`);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ` + whereClauses.join(" AND ");
    }

    query += ` GROUP BY p.id ORDER BY p.display_order`;

    const [products] = await pool.query(query, queryParams);

    const formattedProducts = products.map((product) => {
      return {
        ...product,
        category_details: product.category_details
          ? product.category_details.split(";;;").map((detail) => {
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
              ] = detail.split("|||");
              return {
                id,
                name,
                slug,
                image_url,
                parent_id,
                description,
                is_active,
                is_featured,
                sort_order,
              };
            })
          : [],
      };
    });

    res.status(200).json({
      status: "success",
      data: {
        results: formattedProducts.length,
        products: formattedProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching store products:", error);
    next(new ApiError(500, "Error fetching store products."));
  }
};

// GET /api/v1/stores/:storeId/sitemap.xml
exports.generate_sitemap = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const baseUrl = "http://localhost:4000"; // Use the provided base_url

    // Fetch store details to get hostname or base path
    const [storeRows] = await pool.query(
      `SELECT hostname FROM stores WHERE id = ?`,
      [storeId]
    );

    if (storeRows.length === 0) {
      return next(new ApiError(404, "Store not found."));
    }

    const storeHostname = storeRows[0].hostname || `merchant/${storeId}`; // Fallback if hostname is not set

    const rootUrl = `${storeHostname}`; // Construct the base URL for the sitemap entries

    const sitemap = xmlbuilder.create("urlset", { encoding: "UTF-8" });
    sitemap.att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

    const now = new Date().toISOString(); // Current timestamp for lastmod

    // Add static pages
    const staticPages = [
      { loc: `${rootUrl}/`, changefreq: "daily", priority: "1.0" },
      { loc: `${rootUrl}/products`, changefreq: "daily", priority: "0.8" },
      { loc: `${rootUrl}/categories`, changefreq: "daily", priority: "0.8" },
      { loc: `${rootUrl}/about-us`, changefreq: "weekly", priority: "0.5" },
      {
        loc: `${rootUrl}/privacy-policy`,
        changefreq: "weekly",
        priority: "0.5",
      },
      {
        loc: `${rootUrl}/terms-and-conditions`,
        changefreq: "weekly",
        priority: "0.5",
      },
      {
        loc: `${rootUrl}/return-and-cancellation-policy`,
        changefreq: "weekly",
        priority: "0.5",
      },
    ];

    staticPages.forEach((page) => {
      sitemap
        .ele("url")
        .ele("loc", page.loc)
        .up()
        .ele("lastmod", now)
        .up()
        .ele("changefreq", page.changefreq)
        .up()
        .ele("priority", page.priority);
    });

    // Fetch products for the store
    const [productRows] = await pool.query(
      `SELECT id, updated_at FROM products WHERE store_id = ?`,
      [storeId]
    );

    productRows.forEach((product) => {
      sitemap
        .ele("url")
        .ele("loc", `${rootUrl}/products/${product.id}`)
        .up()
        .ele(
          "lastmod",
          product.updated_at ? new Date(product.updated_at).toISOString() : now
        )
        .up()
        .ele("changefreq", "weekly")
        .up()
        .ele("priority", "0.7");
    });

    const xml = sitemap.end({ pretty: true });

    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    next(new ApiError(500, "Error generating sitemap."));
  }
};

// GET /api/v1/stores/:storeId/facebook-feed.xml
exports.generate_facebook_feed = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const baseUrl = "http://localhost:4000"; // Use the provided base_url

    // Fetch store details
    const [storeRows] = await pool.query(
      `SELECT store_name, hostname FROM stores WHERE id = ?`,
      [storeId]
    );

    if (storeRows.length === 0) {
      return next(new ApiError(404, "Store not found."));
    }

    const storeName = storeRows[0].store_name || "Default Store";
    const storeHostname = storeRows[0].hostname || `merchant/${storeId}`;
    const storeLink = `${storeHostname}`;

    const rss = xmlbuilder.create("rss", { encoding: "UTF-8" });
    rss.att("version", "2.0");
    rss.att("xmlns:g", "http://base.google.com/ns/1.0");

    const channel = rss.ele("channel");
    channel.ele("title").cdata(storeName);
    channel.ele("link", storeLink);
    channel.ele("description").cdata(`Product feed for ${storeName}`);
    channel.ele("g:favicon_url"); // Placeholder as per example

    // Fetch products for the store
    const [productRows] = await pool.query(
      `SELECT
        p.id,
        p.name AS title,
        p.description,
        p.price,
        p.price,
        p.image_url,
        p.brand,
        p.condition,
        p.stock_quantity,
        p.status
      FROM products p
      WHERE p.store_id = ?`,
      [storeId]
    );

    productRows.forEach((product) => {
      const item = channel.ele("item");
      item.ele("g:id").cdata(product.id.toString());
      item.ele("g:title").cdata(product.title || "");
      item.ele("g:description").cdata(product.description || "");
      item.ele("g:link", `${storeLink}/products/${product.id}`);
      item.ele("g:image_link", product.image_url || "");
      item.ele("g:price").cdata(`${product.price} BDT`); // Assuming BDT currency
      item.ele("g:sale_price").cdata(`${product.price || product.price} BDT`);
      item.ele("g:condition").cdata(product.condition || "new");
      item.ele("g:availability").cdata(product.stock_quantity || "in stock");
      item.ele("g:brand").cdata(product.brand || storeName);
      item.ele("g:status").cdata(product.status || "active");
      item.ele("g:rich_text_description").cdata(""); // Placeholder as per example
    });

    const xml = rss.end({ pretty: true });

    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Error generating Facebook feed:", error);
    next(new ApiError(500, "Error generating Facebook feed."));
  }
};

exports.generate_tiktok_feed = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    // Fetch store details
    const [storeRows] = await pool.query(
      `SELECT store_name, hostname FROM stores WHERE id = ?`,
      [storeId]
    );

    if (storeRows.length === 0) {
      return next(new ApiError(404, "Store not found."));
    }

    const storeName = storeRows[0].store_name || "Default Store";
    const storeHostname = storeRows[0].hostname || `merchant/${storeId}`;
    const storeLink = `${storeHostname}`;

    const rss = xmlbuilder.create("rss", { encoding: "utf-8" });
    rss.att("version", "2.0");
    rss.att("xmlns:g", "http://base.google.com/ns/1.0");

    const channel = rss.ele("channel");
    channel.ele("title").cdata(`TikTok Product Feed - ${storeName}`);
    channel.ele("link", storeLink);
    channel
      .ele("description")
      .cdata(`Product feed for TikTok Shop - ${storeName}`);

    const [productRows] = await pool.query(
      `SELECT
        p.id,
        p.name AS video_name,
        p.video_url AS video_link,
        p.description,
        p.brand,
        p.condition,
        p.stock_quantity,
        p.variants,
        GROUP_CONCAT(c.name) AS category
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.store_id = ?
      GROUP BY p.id`,
      [storeId]
    );

    productRows.forEach((product) => {
      const item = channel.ele("item");
      item.ele("g:id").cdata(product.id.toString());
      item.ele("g:video_name").cdata(product.video_name || "");
      item.ele("g:video_link").cdata(product.video_link || "");

      let sku_ids = "";
      if (product.variants) {
        try {
          const variants = product.variants;
          if (Array.isArray(variants)) {
            sku_ids = variants.map((v) => v.id).join(",");
          }
        } catch (e) {
          console.error("Error parsing variants for product", product.id, e);
        }
      }
      item.ele("g:sku_id_list").cdata(sku_ids);

      item.ele("g:category").cdata(product.category || "");
      item.ele("g:brand").cdata(product.brand || "");
      item.ele("g:creator").cdata(product.creator || "");
      item.ele("g:video_type").cdata(product.video_type || "product_showcase");
      item.ele("g:description").cdata(product.description || "");
      item.ele("g:landing_page_url").cdata(product.landing_page_url || "");
    });

    const xml = rss.end({ pretty: true });

    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Error generating TikTok feed:", error);
    next(new ApiError(500, "Error generating TikTok feed."));
  }
};
