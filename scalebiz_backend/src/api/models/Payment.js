const db = require('../../config/database');

class Payment {
  static async create(payment) {
    const { user_id, subscription_id, promo_code_id, amount, payment_method, transaction_id, status, billing_start_date, billing_end_date } = payment;
    const [result] = await db.query(
      'INSERT INTO payments (user_id, subscription_id, promo_code_id, amount, payment_method, transaction_id, status, billing_start_date, billing_end_date, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [user_id, subscription_id, promo_code_id, amount, payment_method, transaction_id, status, billing_start_date, billing_end_date]
    );
    return { id: result.insertId, ...payment };
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(`
      SELECT 
        p.id as invoice_id,
        s.name as plan_name,
        p.amount,
        p.status,
        p.payment_method,
        p.billing_start_date,
        p.billing_end_date
      FROM payments p
      JOIN subscriptions s ON p.subscription_id = s.id
      WHERE p.user_id = ?
      ORDER BY p.payment_date DESC
    `, [userId]);
    return rows;
  }

  static async verifyPayment(transaction_id, status) {
    const [result] = await db.query(
        'UPDATE payments SET status = ? WHERE transaction_id = ?',
        [status, transaction_id]
    );
    return result.affectedRows > 0;
  }

  static async getCurrentSubscription(userId) {
    const [rows] = await db.query(`
        SELECT 
            s.name as plan_name,
            s.id as subscription_id,
            p.status,
            p.billing_start_date as start_date,
            p.billing_end_date as end_date
        FROM payments p
        JOIN subscriptions s ON p.subscription_id = s.id
        WHERE p.user_id = ? AND p.status = 'completed' AND p.billing_end_date >= NOW()
        ORDER BY p.billing_end_date DESC
        LIMIT 1
    `, [userId]);
    return rows[0];
  }
}

module.exports = Payment;