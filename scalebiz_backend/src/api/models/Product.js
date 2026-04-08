const pool = require('../../config/database');

class Product {
  static async create(data) {
    const { store_id, brand, sku, barcode, name, slug, description, status, product_type, price, regular_price, cost_price, image_url, hover_image_url, video_url, gender, stock_quantity, track_inventory, condition, variants, offer_count_down, details, faqs, right_col_banner, gallery_images, is_stock_out } = data;
    const [result] = await pool.query(
      `INSERT INTO products (store_id, brand, sku, barcode, name, slug, description, status, product_type, price, regular_price, cost_price, image_url, hover_image_url, video_url, gender, stock_quantity, track_inventory, \`condition\`, variants, offer_count_down, details, faqs, right_col_banner, gallery_images, is_stock_out) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [store_id, brand, sku, barcode, name, slug, description, status, product_type, price, regular_price, cost_price, image_url, hover_image_url, video_url, gender, stock_quantity, track_inventory, condition, JSON.stringify(variants), offer_count_down, JSON.stringify(details), JSON.stringify(faqs), JSON.stringify(right_col_banner), JSON.stringify(gallery_images), is_stock_out]
    );
    return { id: result.insertId, ...data };
  }

  static async findAll() {
    const [rows] = await pool.query(`SELECT * FROM products`);
    return rows;
  }

  static async findByPk(id) {
    const [rows] = await pool.query(`SELECT * FROM products WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  static async findOne(whereClause) {
    let query = `SELECT * FROM products WHERE 1=1`;
    const values = [];

    if (whereClause.id) {
      query += ` AND id = ?`;
      values.push(whereClause.id);
    }
    if (whereClause.store_id) {
      query += ` AND store_id = ?`;
      values.push(whereClause.store_id);
    }
    if (whereClause.sku) {
      query += ` AND sku = ?`;
      values.push(whereClause.sku);
    }

    const [rows] = await pool.query(query, values);
    return rows[0] || null;
  }

  static async update(id, data) {
    const { store_id, brand, sku, barcode, name, slug, description, status, product_type, price, regular_price, cost_price, image_url, hover_image_url, video_url, gender, stock_quantity, track_inventory, condition, variants, offer_count_down, details, faqs, right_col_banner, gallery_images, is_stock_out } = data;
    const [result] = await pool.query(
      `UPDATE products SET store_id = ?, brand = ?, sku = ?, barcode = ?, name = ?, slug = ?, description = ?, status = ?, product_type = ?, price = ?, regular_price = ?, cost_price = ?, image_url = ?, hover_image_url = ?, video_url = ?, gender = ?, stock_quantity = ?, track_inventory = ?, \`condition\` = ?, variants = ?, offer_count_down = ?, details = ?, faqs = ?, right_col_banner = ?, gallery_images = ?, is_stock_out = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [store_id, brand, sku, barcode, name, slug, description, status, product_type, price, regular_price, cost_price, image_url, hover_image_url, video_url, gender, stock_quantity, track_inventory, condition, JSON.stringify(variants), offer_count_down, JSON.stringify(details), JSON.stringify(faqs), JSON.stringify(right_col_banner), JSON.stringify(gallery_images), is_stock_out, id]
    );
    return result.affectedRows > 0;
  }

  static async destroy(id) {
    const [result] = await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Product;