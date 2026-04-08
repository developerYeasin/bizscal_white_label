const pool = require("../../config/database");
const bcrypt = require("bcrypt");

class User {
  static async create(
    store_id,
    name,
    email,
    password,
    role = "user",
    permissions = [],
    pathao_token = null,
    pathao_refresh_token = null,
    pathao_token_expires_in = null
  ) {
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (store_id, name, email, password_hash, role, permissions, pathao_token, pathao_refresh_token, pathao_token_expires_in) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [store_id, name, email, password_hash, role, JSON.stringify(permissions), pathao_token, pathao_refresh_token, pathao_token_expires_in]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT id, store_id, name, email, role, permissions, pathao_token, pathao_refresh_token, pathao_token_expires_in FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.name) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.role) {
      fields.push('role = ?');
      values.push(data.role);
    }
    if (data.permissions) {
      fields.push('permissions = ?');
      values.push(JSON.stringify(data.permissions));
    }

    if (data.pathao_token) {
      fields.push('pathao_token = ?');
      values.push(data.pathao_token);
    }
    if (data.pathao_refresh_token) {
      fields.push('pathao_refresh_token = ?');
      values.push(data.pathao_refresh_token);
    }
    if (data.pathao_token_expires_in) {
      fields.push('pathao_token_expires_in = ?');
      values.push(data.pathao_token_expires_in);
    }

    if (fields.length === 0) {
      return;
    }

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(sql, values);
  }

  static async delete(id) {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
  }

  static async findByStoreId(store_id, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      "SELECT id, name, email, role,avatar_url, permissions FROM users WHERE store_id = ? LIMIT ? OFFSET ?",
      [store_id, limit, offset]
    );
    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) as total FROM users WHERE store_id = ?",
      [store_id]
    );
    
    return {
      users: rows,
      pagination: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updatePathaoTokens(userId, accessToken, refreshToken, expiresIn) {
    const [result] = await pool.query(
      "UPDATE users SET pathao_token = ?, pathao_refresh_token = ?, pathao_token_expires_in = ? WHERE id = ?",
      [accessToken, refreshToken, expiresIn, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;
