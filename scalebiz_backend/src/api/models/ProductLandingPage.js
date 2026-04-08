const pool = require('../../config/database');

class ProductLandingPage {
  static async create(data) {
    const { store_id, product_id, template_id, page_title, page_description, slug, settings_json, is_active, footer_enable, header_enable } = data;
    const [result] = await pool.query(
      `INSERT INTO product_landing_pages (store_id, product_id, template_id, page_title, page_description, slug, settings_json, is_active, footer_enable, header_enable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [store_id, product_id, template_id, page_title, page_description, slug, JSON.stringify(settings_json), is_active, footer_enable, header_enable]
    );
    return { id: result.insertId, ...data };
  }

  static async findAll() {
    const [rows] = await pool.query(
      `SELECT plp.*,
              plp.footer_enable, plp.header_enable,
               JSON_OBJECT('id', s.id, 'store_name', s.store_name) AS store,
               JSON_OBJECT(
                   'id', p.id, 'store_id', p.store_id, 'brand', p.brand, 'sku', p.sku, 'barcode', p.barcode,
                   'name', p.name, 'slug', p.slug, 'description', p.description, 'status', p.status,
                   'product_type', p.product_type, 'price', p.price, 'regular_price', p.regular_price,
                   'cost_price', p.cost_price, 'image_url', p.image_url, 'hover_image_url', p.hover_image_url,
                   'video_url', p.video_url, 'gender', p.gender, 'stock_quantity', p.stock_quantity,
                   'track_inventory', p.track_inventory, 'condition', p.condition, 'variants', p.variants,
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
        WHERE plp.deleted_at IS NULL`
    );
    const rowsWithParsedSettings = rows.map(row => ({
      ...row,
      settings_json: row.settings_json,
    }));
    return rowsWithParsedSettings;
  }

  static async findByPk(id) {
    const [rows] = await pool.query(
      `SELECT plp.*,
              plp.footer_enable, plp.header_enable,
               JSON_OBJECT('id', s.id, 'store_name', s.store_name) AS store,
               JSON_OBJECT(
                   'id', p.id, 'store_id', p.store_id, 'brand', p.brand, 'sku', p.sku, 'barcode', p.barcode,
                   'name', p.name, 'slug', p.slug, 'description', p.description, 'status', p.status,
                   'product_type', p.product_type, 'price', p.price, 'regular_price', p.regular_price,
                   'cost_price', p.cost_price, 'image_url', p.image_url, 'hover_image_url', p.hover_image_url,
                   'video_url', p.video_url, 'gender', p.gender, 'stock_quantity', p.stock_quantity,
                   'track_inventory', p.track_inventory, 'condition', p.condition, 'variants', p.variants,
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
        WHERE plp.id = ? AND plp.deleted_at IS NULL`,
      [id]
    );
    if (!rows[0]) return null;
    const row = rows[0];
    return {
      ...row,
      settings_json: row.settings_json,
    };
  }

  static async update(id, data) {
    console.log("Updating ProductLandingPage id:", id, "with data:", data);
    const fields = [];
    const values = [];

    for (const key in data) {
      if (data[key] !== undefined) { // Only include fields that are explicitly provided
        fields.push(`${key} = ?`);
        if (key === 'settings_json') {
          values.push(JSON.stringify(data[key]));
        } else {
          values.push(data[key]);
        }
      }
    }

    if (fields.length === 0) {
      return false; // No fields to update
    }

    values.push(id); // Add id for WHERE clause

    const [result] = await pool.query(
      `UPDATE product_landing_pages SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async destroy(id) {
    const [result] = await pool.query(
      `UPDATE product_landing_pages SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findOne(whereClause) {
    let query = `SELECT plp.*,
                        plp.footer_enable, plp.header_enable,
                        JSON_OBJECT('id', s.id, 'store_name', s.store_name) AS store,
                        JSON_OBJECT(
                            'id', p.id, 'store_id', p.store_id, 'brand', p.brand, 'sku', p.sku, 'barcode', p.barcode,
                            'name', p.name, 'slug', p.slug, 'description', p.description, 'status', p.status,
                            'product_type', p.product_type, 'price', p.price, 'regular_price', p.regular_price,
                            'cost_price', p.cost_price, 'image_url', p.image_url, 'hover_image_url', p.hover_image_url,
                            'video_url', p.video_url, 'gender', p.gender, 'stock_quantity', p.stock_quantity,
                            'track_inventory', p.track_inventory, 'condition', p.condition, 'variants', p.variants,
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
                 JOIN users u ON s.id = u.store_id -- Join with users table
                 WHERE plp.deleted_at IS NULL`;
    const values = [];

    if (whereClause.id) {
      query += ` AND plp.id = ?`;
      values.push(whereClause.id);
    }
    if (whereClause.store_id) {
      query += ` AND plp.store_id = ?`;
      values.push(whereClause.store_id);
    }
    if (whereClause.product_id) {
      query += ` AND plp.product_id = ?`;
      values.push(whereClause.product_id);
    }
    if (whereClause.template_id) {
      query += ` AND plp.template_id = ?`;
      values.push(whereClause.template_id);
    }
    if (whereClause.slug) {
      query += ` AND plp.slug = ?`;
      values.push(whereClause.slug);
    }
    if (whereClause.store && whereClause.store.where && whereClause.store.where.owner_id) {
      query += ` AND u.id = ?`; // Filter by user ID (owner_id)
      values.push(whereClause.store.where.owner_id);
    }

    const [rows] = await pool.query(query, values);
    if (!rows[0]) return null;
    const row = rows[0];
    return {
      ...row,
      settings_json: row.settings_json,
    };
  }

  static async findAllByStoreIds(storeIds) {
    if (!storeIds || storeIds.length === 0) {
      return [];
    }
    const placeholders = storeIds.map(() => '?').join(', ');
    const [rows] = await pool.query(
      `SELECT plp.*,
              plp.footer_enable, plp.header_enable,
              JSON_OBJECT('id', s.id, 'store_name', s.store_name) AS store,
              JSON_OBJECT(
                  'id', p.id, 'store_id', p.store_id, 'brand', p.brand, 'sku', p.sku, 'barcode', p.barcode,
                  'name', p.name, 'slug', p.slug, 'description', p.description, 'status', p.status,
                  'product_type', p.product_type, 'price', p.price, 'regular_price', p.regular_price,
                  'cost_price', p.cost_price, 'image_url', p.image_url, 'hover_image_url', p.hover_image_url,
                  'video_url', p.video_url, 'gender', p.gender, 'stock_quantity', p.stock_quantity,
                  'track_inventory', p.track_inventory, 'condition', p.condition, 'variants', p.variants,
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
       WHERE plp.store_id IN (${placeholders}) AND plp.deleted_at IS NULL`,
      storeIds
    );
    const rowsWithParsedSettings = rows.map(row => ({
      ...row,
      settings_json: row.settings_json,
    }));
    return rowsWithParsedSettings;
  }
}

module.exports = ProductLandingPage;