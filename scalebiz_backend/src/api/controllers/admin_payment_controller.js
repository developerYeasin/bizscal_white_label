const asyncHandler = require('../../utils/async_handler');
const Payment = require('../models/Payment');
const db = require('../../config/database');

class AdminPaymentController {
  static async getAllPayments(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [totalPayments] = await db.query('SELECT COUNT(*) as count FROM payments');
    const total = totalPayments[0].count;

    const [payments] = await db.query(`
      SELECT 
        p.id, 
        u.email as user_email, 
        s.name as subscription_plan, 
        pc.code as promo_code, 
        p.amount, 
        p.payment_method, 
        p.transaction_id, 
        p.status, 
        p.billing_start_date, 
        p.billing_end_date, 
        p.payment_date
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN subscriptions s ON p.subscription_id = s.id
      LEFT JOIN promo_codes pc ON p.promo_code_id = pc.id
      ORDER BY p.payment_date DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    res.status(200).json({
      success: true,
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  static async getPaymentById(req, res) {
    const { id } = req.params;
    const [payment] = await db.query(`
      SELECT 
        p.id, 
        u.email as user_email, 
        s.name as subscription_plan, 
        pc.code as promo_code, 
        p.amount, 
        p.payment_method, 
        p.transaction_id, 
        p.status, 
        p.billing_start_date, 
        p.billing_end_date, 
        p.payment_date
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN subscriptions s ON p.subscription_id = s.id
      LEFT JOIN promo_codes pc ON p.promo_code_id = pc.id
      WHERE p.id = ?
    `, [id]);

    if (!payment.length) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, data: payment[0] });
  }

  static async updatePayment(req, res) {
    const { id } = req.params;
    const updates = req.body;
    const fields = [];
    const values = [];

    const allowedFields = ['user_id', 'subscription_id', 'promo_code_id', 'amount', 'payment_method', 'transaction_id', 'status', 'billing_start_date', 'billing_end_date'];

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const query = `UPDATE payments SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, message: 'Payment updated successfully' });
  }

  static async deletePayment(req, res) {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM payments WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, message: 'Payment deleted successfully' });
  }
}

module.exports = AdminPaymentController;