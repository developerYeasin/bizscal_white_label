const pool = require('../../config/database');

async function createTable() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS coupons (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(100) NOT NULL UNIQUE,
        discount_type ENUM('percent', 'fixed') NOT NULL,
        discount_value DECIMAL(10,2) NOT NULL,
        minimum_spend DECIMAL(10,2) NULL,
        usage_limit_per_coupon INT UNSIGNED NULL,
        usage_limit_per_customer INT UNSIGNED NULL,
        times_used INT UNSIGNED NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        valid_from TIMESTAMP NULL,
        valid_until TIMESTAMP NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS coupon_products (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        coupon_id INT UNSIGNED NOT NULL,
        product_id BIGINT UNSIGNED NOT NULL,
        FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS coupon_categories (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        coupon_id INT UNSIGNED NOT NULL,
        category_id BIGINT UNSIGNED NOT NULL,
        FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
      );
    `;
    await pool.query(sql);
    console.log("Coupon tables created/checked successfully.");
  } catch (error) {
    console.error("Error creating coupon table:", error);
  }
}

// createTable();

module.exports = {
  getAll: async ({ limit, offset, store_id }) => {
    try {
      const whereClause = store_id ? 'WHERE c.store_id = ?' : '';
      const params = store_id ? [store_id] : [];

      const [[{ count }]] = await pool.query(`SELECT COUNT(*) as count FROM coupons c ${whereClause}`, params);

      const queryParams = store_id ? [store_id, limit, offset] : [limit, offset];
      const [rows] = await pool.query(`
        SELECT c.*,
               GROUP_CONCAT(DISTINCT cp.product_id) AS applies_to_products,
               GROUP_CONCAT(DISTINCT cc.category_id) AS applies_to_categories
        FROM coupons c
        LEFT JOIN coupon_products cp ON c.id = cp.coupon_id
        LEFT JOIN coupon_categories cc ON c.id = cc.coupon_id
        ${whereClause}
        GROUP BY c.id
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?
      `, queryParams);

      const processedRows = rows.map(coupon => ({
        ...coupon,
        applies_to_products: coupon.applies_to_products ? coupon.applies_to_products.split(',').map(Number) : [],
        applies_to_categories: coupon.applies_to_categories ? coupon.applies_to_categories.split(',').map(Number) : []
      }));

      return { count, rows: processedRows };
    } catch (error) {
      console.error("Error getting all coupons:", error);
      return { count: 0, rows: [] };
    }
  },
  findByPk: async (id, store_id = null) => {
    try {
      const whereClause = store_id ? 'AND store_id = ?' : '';
      const params = store_id ? [id, store_id] : [id];
      const [rows] = await pool.query(`SELECT * FROM coupons WHERE id = ? ${whereClause}`, params);
      return rows[0] || null;
    } catch (error) {
      console.error("Error finding coupon by pk:", error);
      return null;
    }
  },
  update: async (id, data, store_id = null) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      if (store_id) {
        const [rows] = await connection.query('SELECT * FROM coupons WHERE id = ? AND store_id = ?', [id, store_id]);
        if (rows.length === 0) {
          throw new Error('Coupon not found or you do not have permission to update it.');
        }
      }

      const { applies_to_products, applies_to_categories, ...couponData } = data;

      // Filter out undefined values to prevent setting columns to NULL unintentionally
      const updateData = Object.keys(couponData).reduce((acc, key) => {
        if (couponData[key] !== undefined) {
          acc[key] = couponData[key];
        }
        return acc;
      }, {});

      if (Object.keys(updateData).length > 0) {
        await connection.query('UPDATE coupons SET ? WHERE id = ?', [updateData, id]);
      }

      await connection.query('DELETE FROM coupon_products WHERE coupon_id = ?', [id]);
      if (applies_to_products && applies_to_products.length > 0) {
        const productValues = applies_to_products.map(productId => [id, productId]);
        await connection.query('INSERT INTO coupon_products (coupon_id, product_id) VALUES ?', [productValues]);
      }

      await connection.query('DELETE FROM coupon_categories WHERE coupon_id = ?', [id]);
      if (applies_to_categories && applies_to_categories.length > 0) {
        const categoryValues = applies_to_categories.map(categoryId => [id, categoryId]);
        await connection.query('INSERT INTO coupon_categories (coupon_id, category_id) VALUES ?', [categoryValues]);
      }

      await connection.commit();
      return { id, ...data };
    } catch (error) {
      await connection.rollback();
      console.error("Error updating coupon:", error);
      throw error;
    } finally {
      connection.release();
    }
  },
  destroy: async (id, store_id = null) => {
    try {
        if (store_id) {
            const [rows] = await pool.query('SELECT * FROM coupons WHERE id = ? AND store_id = ?', [id, store_id]);
            if (rows.length === 0) {
                throw new Error('Coupon not found or you do not have permission to delete it.');
            }
        }
      await pool.query('DELETE FROM coupons WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error("Error deleting coupon:", error);
      return false;
    }
  },
  getCoupon: async (code, store_id = null) => {
    try {
      const whereClause = store_id ? 'AND store_id = ?' : '';
      const params = store_id ? [code, store_id] : [code];
      const [rows] = await pool.query(`SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND valid_until > NOW() ${whereClause}`, params);
      return rows[0];
    } catch (error) {
      console.error("Error getting coupon:", error);
      return null;
    }
  },

  create: async ({
    code,
    discount_type,
    discount_value,
    minimum_spend,
    usage_limit_per_coupon,
    usage_limit_per_customer,
    valid_from,
    valid_until,
    applies_to_products,
    applies_to_categories,
    is_active = true,
    times_used = 0,
    store_id,
  }) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `INSERT INTO coupons (code, discount_type, discount_value, minimum_spend, usage_limit_per_coupon, usage_limit_per_customer, valid_from, valid_until, is_active, times_used, store_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          code,
          discount_type,
          discount_value,
          minimum_spend,
          usage_limit_per_coupon,
          usage_limit_per_customer,
          valid_from,
          valid_until,
          is_active,
          times_used,
          store_id,
        ]
      );

      const couponId = result.insertId;

      if (applies_to_products && applies_to_products.length > 0) {
        const productValues = applies_to_products.map(productId => [couponId, productId]);
        await connection.query(
          'INSERT INTO coupon_products (coupon_id, product_id) VALUES ?',
          [productValues]
        );
      }

      if (applies_to_categories && applies_to_categories.length > 0) {
        const categoryValues = applies_to_categories.map(categoryId => [couponId, categoryId]);
        await connection.query(
          'INSERT INTO coupon_categories (coupon_id, category_id) VALUES ?',
          [categoryValues]
        );
      }

      await connection.commit();
      return { id: couponId, code, discount_type, discount_value, minimum_spend, usage_limit_per_coupon, usage_limit_per_customer, valid_from, valid_until, is_active, times_used, store_id };
    } catch (error) {
      await connection.rollback();
      console.error("Error creating coupon:", error);
      throw error;
    } finally {
      connection.release();
    }
  },

  getCouponWithRestrictions: async (code, store_id = null) => {
    try {
      const whereClause = store_id ? 'AND c.store_id = ?' : '';
      const params = store_id ? [code, store_id] : [code];
      const [coupons] = await pool.query(
        `SELECT c.*,
                GROUP_CONCAT(DISTINCT cp.product_id) AS restricted_products,
                GROUP_CONCAT(DISTINCT cc.category_id) AS restricted_categories
         FROM coupons c
         LEFT JOIN coupon_products cp ON c.id = cp.coupon_id
         LEFT JOIN coupon_categories cc ON c.id = cc.coupon_id
         WHERE c.code = ? AND c.is_active = 1 AND c.valid_until > NOW() ${whereClause}
         GROUP BY c.id`,
        params
      );

      if (!coupons[0]) return null;

      const coupon = coupons[0];
      coupon.restricted_products = coupon.restricted_products ? coupon.restricted_products.split(',').map(Number) : [];
      coupon.restricted_categories = coupon.restricted_categories ? coupon.restricted_categories.split(',').map(Number) : [];

      return coupon;
    } catch (error) {
      console.error("Error getting coupon with restrictions:", error);
      return null;
    }
  }
};