const pool = require("../../config/database");

class ContactSubmission {
  static async create(data) {
    const {
      store_id,
      full_name,
      email,
      phone,
      subject,
      order_number,
      message,
      status,
    } = data;
    const [result] = await pool.query(
      `INSERT INTO contact_submissions (store_id, full_name, email, phone, subject, order_number, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        store_id,
        full_name,
        email,
        phone,
        subject,
        order_number,
        message,
        status || "unread",
      ],
    );
    return { id: result.insertId, ...data };
  }

  static async findAll(store_id) {
    const [rows] = await pool.query(
      `SELECT * FROM contact_submissions WHERE id = ${store_id} ORDER BY created_at DESC`,
    );
    return rows;
  }

  static async findByPk(id) {
    const [rows] = await pool.query(
      `SELECT * FROM contact_submissions WHERE id = ?`,
      [id],
    );
    return rows[0] || null;
  }

  static async findOne(whereClause) {
    let query = `SELECT * FROM contact_submissions WHERE 1=1`;
    const values = [];

    if (whereClause.id) {
      query += ` AND id = ${whereClause.id}`;
    }
    if (whereClause.store_id) {
      query += ` AND store_id = ${whereClause.store_id}`;
    }

    const [rows] = await pool.query(query);

    return rows[0] || null;
  }

  static async update(id, data) {
    const {
      store_id,
      full_name,
      email,
      phone,
      subject,
      order_number,
      message,
      status,
    } = data;
    const [result] = await pool.query(
      `UPDATE contact_submissions SET store_id = ?, full_name = ?, email = ?, phone = ?, subject = ?, order_number = ?, message = ?, status = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        store_id,
        full_name,
        email,
        phone,
        subject,
        order_number,
        message,
        status,
        id,
      ],
    );
    return result.affectedRows > 0;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.query(
      `UPDATE contact_submissions SET status = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id],
    );
    return result.affectedRows > 0;
  }

  static async destroy(id) {
    const [result] = await pool.query(
      `DELETE FROM contact_submissions WHERE id = ?`,
      [id],
    );
    return result.affectedRows > 0;
  }
}

module.exports = ContactSubmission;
