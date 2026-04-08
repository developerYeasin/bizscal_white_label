const db = require("../../config/database");

class Subscription {
  static async create(subscription) {
    const { name, price, duration_days, features, is_active } = subscription;
    const [result] = await db.query(
      "INSERT INTO subscriptions (name, price, duration_days, features, is_active) VALUES (?, ?, ?, ?, ?)",
      [
        name ?? null,
        price ?? null,
        duration_days ?? null,
        JSON.stringify(features ?? {}),
        is_active ?? true,
      ]
    );
    return { id: result.insertId, ...subscription };
  }

  static async findAll(limit, offset, name = null) {
    let query = "SELECT * FROM subscriptions";
    const whereClauses = [];
    const params = [];

    if (name) {
      whereClauses.push("name LIKE ?");
      params.push(`%${name}%`);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    rows.forEach((row) => {
      if (typeof row.features === "string") {
        row.features = JSON.parse(row.features);
      }
    });
    return rows;
  }

  static async getTotalSubscriptionsCount(name = null) {
    let query = "SELECT COUNT(*) as count FROM subscriptions";
    const whereClauses = [];
    const params = [];

    if (name) {
      whereClauses.push("name LIKE ?");
      params.push(`%${name}%`);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    const [rows] = await db.query(query, params);
    return rows[0].count;
  }

  static async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM subscriptions WHERE id = ?",
      [id]
    );
    if (rows.length > 0) {
      const subscription = rows[0];
      if (typeof subscription.features === "string") {
        subscription.features = JSON.parse(subscription.features);
      }
      return subscription;
    }
    return null;
  }

  static async update(id, subscription) {
    const existingSubscription = await this.findById(id);
    if (!existingSubscription) {
      return new Error("Subscription not found");
    }

    const updatedSubscription = { ...existingSubscription, ...subscription };
    const {
      name,
      price,
      duration_days,
      features,
      is_active,
      adjective,
      real_price,
    } = updatedSubscription;

    await db.query(
      "UPDATE subscriptions SET name = ?, price = ?, duration_days = ?, features = ?, is_active = ?, adjective = ?, real_price = ? WHERE id = ?",
      [
        name,
        price,
        duration_days,
        JSON.stringify(features),
        is_active,
        adjective,
        real_price,
        id,
      ]
    );
    return { id, ...updatedSubscription };
  }

  static async remove(id) {
    await db.query("DELETE FROM subscriptions WHERE id = ?", [id]);
    return true;
  }

  static async findAllActive() {
    const [rows] = await db.query(
      "SELECT id, name, price, real_price,adjective, duration_days, features FROM subscriptions WHERE is_active = true"
    );
    rows.forEach((row) => {
      if (typeof row.features === "string") {
        row.features = JSON.parse(row.features);
      }
    });
    return rows;
  }
}

module.exports = Subscription;
