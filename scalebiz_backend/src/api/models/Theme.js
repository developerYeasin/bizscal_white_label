const pool = require('../../config/database');

class Theme {
  static async create(data) {
    const { name, description, version, status, access_level, category, features, preview_image_url, live_demo_url } = data;
    const [result] = await pool.query(
      `INSERT INTO themes (name, description, version, status, access_level, category, features, preview_image_url, live_demo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, version, status, access_level, category, JSON.stringify(features), preview_image_url, live_demo_url]
    );
    return { id: result.insertId, ...data };
  }

  static async findAll() {
    const [rows] = await pool.query(`SELECT * FROM themes`);
    return rows;
  }

  static async findByPk(id) {
    const [rows] = await pool.query(`SELECT * FROM themes WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  static async update(id, data) {
    const { name, description, version, status, access_level, category, features, preview_image_url, live_demo_url } = data;
    const [result] = await pool.query(
      `UPDATE themes SET name = ?, description = ?, version = ?, status = ?, access_level = ?, category = ?, features = ?, preview_image_url = ?, live_demo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, description, version, status, access_level, category, JSON.stringify(features), preview_image_url, live_demo_url, id]
    );
    return result.affectedRows > 0;
  }

  static async destroy(id) {
    const [result] = await pool.query(`DELETE FROM themes WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Theme;