const pool = require('../../config/database');

class Store {
  static async create(data) {
    const { theme_id, hostname, store_name, logo_url, favicon_url, contact_email, country, currency_code, timezone, status, plan_id, trial_ends_at } = data;
    const [result] = await pool.query(
      `INSERT INTO stores (theme_id, hostname, store_name, logo_url, favicon_url, contact_email, country, currency_code, timezone, status, plan_id, trial_ends_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [theme_id, hostname, store_name, logo_url, favicon_url, contact_email, country, currency_code, timezone, status, plan_id, trial_ends_at]
    );
    return { id: result.insertId, ...data };
  }

  static async findAll() {
    const [rows] = await pool.query(`SELECT * FROM stores WHERE deleted_at IS NULL`);
    return rows;
  }

  static async findByPk(id) {
    const [rows] = await pool.query(`SELECT * FROM stores WHERE id = ? AND deleted_at IS NULL`, [id]);
    return rows[0] || null;
  }

  static async findOne(whereClause) {
    let query = `SELECT * FROM stores WHERE deleted_at IS NULL`;
    const values = [];

    if (whereClause.id) {
      query += ` AND id = ?`;
      values.push(whereClause.id);
    }
    if (whereClause.owner_id) {
      // Assuming 'owner_id' is a column in the 'stores' table for this context
      query += ` AND owner_id = ?`;
      values.push(whereClause.owner_id);
    }
    if (whereClause.hostname) {
      query += ` AND hostname = ?`;
      values.push(whereClause.hostname);
    }

    const [rows] = await pool.query(query, values);
    return rows[0] || null;
  }

  static async update(id, data) {
    const { theme_id, hostname, store_name, logo_url, favicon_url, contact_email, country, currency_code, timezone, status, plan_id, trial_ends_at } = data;
    const [result] = await pool.query(
      `UPDATE stores SET theme_id = ?, hostname = ?, store_name = ?, logo_url = ?, favicon_url = ?, contact_email = ?, country = ?, currency_code = ?, timezone = ?, status = ?, plan_id = ?, trial_ends_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [theme_id, hostname, store_name, logo_url, favicon_url, contact_email, country, currency_code, timezone, status, plan_id, trial_ends_at, id]
    );
    return result.affectedRows > 0;
  }

  static async destroy(id) {
    const [result] = await pool.query(
      `UPDATE stores SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Store;