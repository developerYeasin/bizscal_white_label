const db = require('../../config/database');

class PromoCode {
  static async create(promoCode) {
    const { code = null, discount_type = null, discount_value = null, max_uses = null, expires_at = null } = promoCode;
    const formattedEndDate = expires_at ? new Date(expires_at).toISOString().slice(0, 19).replace('T', ' ') : null;
    const [result] = await db.query(
      'INSERT INTO promo_codes (code, discount_type, discount_value, max_uses, end_date, is_active, uses) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [code, discount_type, discount_value, max_uses, formattedEndDate, true, 0]
    );
    return { id: result.insertId, ...promoCode };
  }

  static async findAll(limit, offset, name = null) {
    let query = "SELECT * FROM promo_codes";
    const whereClauses = [];
    const params = [];

    if (name) {
      whereClauses.push("code LIKE ?");
      params.push(`%${name}%`);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getTotalPromoCodesCount(name = null) {
    let query = "SELECT COUNT(*) as count FROM promo_codes";
    const whereClauses = [];
    const params = [];

    if (name) {
      whereClauses.push("code LIKE ?");
      params.push(`%${name}%`);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    const [rows] = await db.query(query, params);
    return rows[0].count;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM promo_codes WHERE id = ?', [id]);
    return rows[0];
  }
  static async findByCode(code) {
    const [rows] = await db.query('SELECT * FROM promo_codes WHERE code = ?', [code]);
    return rows[0];
  }


  static async update(id, promoCode) {
    const fields = Object.keys(promoCode);
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClauses = [];
    const values = [];

    const allowedColumns = {
      code: 'code',
      discount_type: 'discount_type',
      discount_value: 'discount_value',
      max_uses: 'max_uses',
      expires_at: 'end_date',
      is_active: 'is_active'
    };

    for (const key of fields) {
      if (Object.prototype.hasOwnProperty.call(allowedColumns, key) && promoCode[key] !== undefined) {
        const column = allowedColumns[key];
        let value = promoCode[key];

        if (key === 'expires_at') {
          value = value ? new Date(value).toISOString().slice(0, 19).replace('T', ' ') : null;
        }
        
        setClauses.push(`${column} = ?`);
        values.push(value);
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id);
    }

    const query = `UPDATE promo_codes SET ${setClauses.join(', ')} WHERE id = ?`;
    values.push(id);

    await db.query(query, values);
    return this.findById(id);
  }

  static async remove(id) {
    await db.query('DELETE FROM promo_codes WHERE id = ?', [id]);
    return true;
  }
}

module.exports = PromoCode;