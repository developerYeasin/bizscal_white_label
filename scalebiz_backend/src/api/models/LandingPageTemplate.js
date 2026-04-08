const pool = require('../../config/database');

class LandingPageTemplate {
  static async create(data) {
    const { name, description, version, status, access_level, category, features, preview_image_url, live_demo_url, template_config } = data;
    const [result] = await pool.query(
      `INSERT INTO landing_page_templates (name, description, version, status, access_level, category, features, preview_image_url, live_demo_url, template_config) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, version, status, access_level, category, JSON.stringify(features), preview_image_url, live_demo_url, JSON.stringify(template_config)]
    );
    return { id: result.insertId, ...data };
  }

  static async findAll() {
    const [rows] = await pool.query(`SELECT * FROM landing_page_templates`);
    return rows;
  }

  static async findByPk(id) {
    const [rows] = await pool.query(`SELECT * FROM landing_page_templates WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  static async update(id, data) {
    const { name, description, version, status, access_level, category, features, preview_image_url, live_demo_url, template_config } = data;
    const [result] = await pool.query(
      `UPDATE landing_page_templates SET name = ?, description = ?, version = ?, status = ?, access_level = ?, category = ?, features = ?, preview_image_url = ?, live_demo_url = ?, template_config = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, description, version, status, access_level, category, JSON.stringify(features), preview_image_url, live_demo_url, JSON.stringify(template_config), id]
    );
    return result.affectedRows > 0;
  }

  static async destroy(id) {
    const [result] = await pool.query(`DELETE FROM landing_page_templates WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = LandingPageTemplate;