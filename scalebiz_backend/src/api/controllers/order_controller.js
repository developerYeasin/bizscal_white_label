const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");
const Coupon = require("../models/Coupon");
const bcrypt = require("bcryptjs");
const { Parser } = require("json2csv");

// POST /api/v1/orders
// exports.create_order = async (req, res, next) => {
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();

//     const {
//       customer_email,
//       customer_phone,
//       shipping_address,
//       billing_address,
//       shipping_method,
//       payment_method,
//       customer_notes,
//       shipping_cost = 0,
//       tax_amount = 0,
//       discount_amount = 0,
//       user_id, // Allow user_id to be passed in the body
//       order_items, // New: Allow order_items to be passed directly
//     } = req.body;
//     let { user } = req; // Make user mutable
//     let final_user_id = user_id;

//     // 1. Determine final_user_id
//     if (!final_user_id && customer_email) {
//       // Check if user exists with this email for the current store
//       const [existingUserRows] = await connection.query(
//         "SELECT id FROM users WHERE email = ? AND store_id = ?",
//         [customer_email, req.store_id]
//       );

//       if (existingUserRows.length > 0) {
//         final_user_id = existingUserRows[0].id;
//       } else {
//         // Create a new user if not found
//         const { v4: uuidv4 } = await import("uuid");
//         const generated_password = uuidv4(); // Generate a random password
//         const password_hash = await bcrypt.hash(generated_password, 12);
//         const default_name = customer_email.split("@")[0]; // Use part of email as default name

//         const [newUserResult] = await connection.query(
//           "INSERT INTO users (store_id, name, email, password_hash, phone_number, email_verified_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
//           [
//             req.store_id,
//             default_name,
//             customer_email,
//             password_hash,
//             customer_phone,
//           ]
//         );
//         final_user_id = newUserResult.insertId;
//       }
//     } else if (!final_user_id && user && user.id) {
//       // Fallback to authenticated user if no user_id or customer_email provided
//       final_user_id = user.id;
//     } else if (!final_user_id) {
//       // If no user_id, customer_email, or authenticated user, then it's an error
//       return next(
//         new ApiError(400, "User information is required to create an order.")
//       );
//     }

//     // 2. Determine currentCart
//     let currentCart;
//     let isSessionCart = true; // Assume session cart by default

//     if (order_items && order_items.length > 0) {
//       // If order_items are provided in the body, use them
//       currentCart = { items: [], total_quantity: 0, total_price: 0 };
//       isSessionCart = false;

//       for (const item of order_items) {
//         const [productRows] = await connection.query(
//           "SELECT id, name, sku, price, stock_quantity, track_inventory FROM products WHERE id = ? AND store_id = ?",
//           [item.product_id, req.store_id]
//         );

//         if (productRows.length === 0) {
//           return next(
//             new ApiError(404, `Product with ID ${item.product_id} not found.`)
//           );
//         }

//         const product = productRows[0];

//         if (product.track_inventory && product.stock_quantity < item.quantity) {
//           return next(
//             new ApiError(
//               400,
//               `Insufficient stock for product ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`
//             )
//           );
//         }

//         currentCart.items.push({
//           product_id: product.id,
//           name: product.name,
//           sku: product.sku,
//           quantity: item.quantity,
//           price: product.price,
//         });
//         currentCart.total_quantity += item.quantity;
//         currentCart.total_price += product.price * item.quantity;
//       }
//     } else if (req.session.cart && req.session.cart.items.length > 0) {
//       // Fallback to session cart if no order_items in body
//       currentCart = req.session.cart;
//     } else {
//       // If neither order_items nor session cart has items
//       return next(new ApiError(400, "Cannot create order from an empty cart."));
//     }

//     const order_number = `ORD-${Date.now()}-${Math.random()
//       .toString(36)
//       .substr(2, 9)
//       .toUpperCase()}`;
//     const total_amount =
//       parseFloat(currentCart.total_price) +
//       parseFloat(shipping_cost) +
//       parseFloat(tax_amount) -
//       parseFloat(discount_amount);
//     const subtotal_amount = parseFloat(currentCart.total_price);

//     // Create the order
//     const [orderResult] = await connection.query(
//       `INSERT INTO orders (
//                 user_id, store_id, order_number, total_amount, subtotal_amount, shipping_cost, tax_amount, discount_amount,
//                 status, payment_status, customer_email, customer_phone, shipping_address, billing_address,
//                 shipping_method, payment_method, customer_notes
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         final_user_id,
//         req.store_id,
//         order_number,
//         total_amount,
//         subtotal_amount,
//         shipping_cost,
//         tax_amount,
//         discount_amount,
//         "pending", // Default status
//         "pending", // Default payment_status
//         customer_email,
//         customer_phone,
//         JSON.stringify(shipping_address),
//         JSON.stringify(billing_address),
//         shipping_method,
//         payment_method,
//         customer_notes,
//       ]
//     );
//     const order_id = orderResult.insertId;

//     // Create order items
//     const orderItemsToInsert = currentCart.items.map((item) => [
//       order_id,
//       item.product_id,
//       item.name, // product_name_at_purchase
//       item.sku, // sku_at_purchase
//       item.quantity,
//       item.price, // price_at_purchase
//       (item.quantity * item.price).toFixed(2), // line_item_total
//     ]);
//     await connection.query(
//       `INSERT INTO order_items (
//                 order_id, product_id, product_name_at_purchase, sku_at_purchase, quantity, price_at_purchase, line_item_total
//             ) VALUES ?`,
//       [orderItemsToInsert]
//     );

//     // Decrease product stock here
//     for (const item of currentCart.items) {
//       await connection.query(
//         "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND track_inventory = TRUE",
//         [item.quantity, item.product_id]
//       );
//     }

//     await connection.commit();

//     // Clear the cart only if it originated from the session
//     if (isSessionCart) {
//       req.session.cart = { items: [], total_quantity: 0, total_price: 0 };
//     }

//     res.status(201).json({
//       status: "success",
//       message: "Order created successfully.",
//       data: { order_id },
//     });
//   } catch (error) {
//     await connection.rollback();
//     console.error("Order creation error:", error); // Add logging for debugging
//     next(new ApiError(500, "Failed to create order."));
//   } finally {
//     connection.release();
//   }
// };
// PUT /api/v1/orders/:order_id - Update an order (incomplete or finalize)
exports.update_customer_order = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { order_id } = req.params; // Get order_id from params
    const {
      customer_email,
      customer_phone,
      customer_name: body_customer_name,
      shipping_address,
      billing_address,
      shipping_method,
      payment_method,
      customer_notes,
      shipping_cost,
      tax_amount,
      coupon_code,
      order_items, // For updating order items
      customer_ip_address,
      user_agent,
      utm_source,
      cancellation_reason,
      shipping_tracking_number,
      fulfilled_at,
      is_fraud,
      finalize_order = false, // New flag to finalize the order
    } = req.body;
    let discount_amount = 0; // Initialize discount_amount
    let final_user_id = req.user ? req.user.id : null; // Use authenticated user if available

    // 1. Verify order exists and its status (only incomplete can be updated/finalized here)
    const [existingOrderRows] = await connection.query(
      "SELECT id, status, user_id, customer_id, shipping_cost, tax_amount, discount_amount, subtotal_amount, total_amount FROM orders WHERE id = ? AND store_id = ?",
      [order_id, req.store_id]
    );

    if (existingOrderRows.length === 0) {
      throw new ApiError(404, "Order not found for update.");
    }

    const existingOrder = existingOrderRows[0];

    if (existingOrder.status !== "incomplete") {
      throw new ApiError(
        400,
        `Cannot update an order with status '${existingOrder.status}'. Only 'incomplete' orders can be updated or finalized via this endpoint.`
      );
    }

    // 2. Determine customer_id
    let customer_id = existingOrder.customer_id; // Start with existing customer_id
    const customer_name = body_customer_name || customer_email?.split("@")[0] || "Guest";

    if (customer_email || customer_phone) {
      const findQuery = customer_email
        ? "SELECT id FROM customers WHERE store_id = ? AND email = ?"
        : "SELECT id FROM customers WHERE store_id = ? AND phone = ?";
      const findParams = customer_email
        ? [req.store_id, customer_email]
        : [req.store_id, customer_phone];

      const [existingCustomer] = await connection.query(findQuery, findParams);

      if (existingCustomer.length > 0) {
        customer_id = existingCustomer[0].id;
      } else if (customer_email || customer_phone) {
        const [newCustomerResult] = await connection.query(
          "INSERT INTO customers (store_id, name, email, phone, billing_address, district, address, street, city, state, zip, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            req.store_id,
            customer_name,
            customer_email,
            customer_phone,
            billing_address ? JSON.stringify(billing_address) : null,
            shipping_address?.district || null,
            shipping_address?.address || null,
            shipping_address?.street || null,
            shipping_address?.city || null,
            shipping_address?.state || null,
            shipping_address?.zip || null,
            shipping_address?.country || null,
          ]
        );
        customer_id = newCustomerResult.insertId;
      }
    }

    // 3. Process order items and calculate subtotal/total
    let currentCart = { items: [], total_quantity: 0, total_price: 0 };
    if (order_items && order_items.length > 0) {
      // Delete existing order items to re-insert
      await connection.query("DELETE FROM order_items WHERE order_id = ?", [order_id]);

      const orderItemsToInsert = [];
      for (const item of order_items) {
        const [productRows] = await connection.query(
          "SELECT id, name, sku, price, stock_quantity, track_inventory, variants FROM products WHERE id = ? AND store_id = ?",
          [item.product_id, req.store_id]
        );

        if (productRows.length === 0) {
          console.warn(`Product with ID ${item.product_id} not found for order update, skipping.`);
          continue;
        }
        const product = productRows[0];

        // Stock check only if finalizing the order
        if (finalize_order && product.track_inventory && product.stock_quantity > 0 && product.stock_quantity < item.quantity) {
          throw new ApiError(400, `Insufficient stock for product ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`);
        }

        const line_item_total = (item.quantity * product.price).toFixed(2);
        orderItemsToInsert.push([
          order_id,
          product.id,
          product.name,
          product.sku,
          item.variants ? JSON.stringify(item.variants) : null,
          item.selected_variants ? JSON.stringify(item.selected_variants) : null,
          item.quantity,
          product.price,
          line_item_total,
        ]);
        currentCart.total_quantity += item.quantity;
        currentCart.total_price += parseFloat(line_item_total);
      }

      if (orderItemsToInsert.length > 0) {
        await connection.query(
          `INSERT INTO order_items (
              order_id, product_id, product_name_at_purchase, sku_at_purchase, variants, selected_variants, quantity, price_at_purchase, line_item_total
          ) VALUES ?`,
          [orderItemsToInsert]
        );
      }
    }

    // Coupon code validation and application (re-calculate if coupon_code provided or items changed)
    let current_discount_amount = discount_amount;
    if (coupon_code) {
      const coupon = await Coupon.getCouponWithRestrictions(coupon_code);

      if (!coupon) {
        throw new ApiError(400, "Invalid or expired coupon code.");
      }

      if (!coupon.is_active || (coupon.valid_until && new Date(coupon.valid_until) < new Date())) {
        throw new ApiError(400, "Coupon is not active or has expired.");
      }

      if (coupon.usage_limit_per_coupon !== null && coupon.times_used >= coupon.usage_limit_per_coupon) {
        throw new ApiError(400, "Coupon usage limit reached.");
      }

      if (coupon.usage_limit_per_customer !== null) {
        const [customerCouponUsage] = await connection.query(
          "SELECT COUNT(*) AS usage_count FROM orders WHERE customer_id = ? AND coupon_code = ? AND id != ?", // Exclude current order for check
          [customer_id, coupon_code, order_id]
        );
        if (customerCouponUsage[0].usage_count >= coupon.usage_limit_per_customer) {
          throw new ApiError(400, "You have reached the usage limit for this coupon.");
        }
      }

      if (coupon.minimum_spend && currentCart.total_price < coupon.minimum_spend) {
        throw new ApiError(400, `Minimum spend of ${coupon.minimum_spend} not met for this coupon. Current cart total: ${currentCart.total_price}.`);
      }

      // Fetch categories for products in the cart (if needed for restrictions)
      if (coupon.restricted_products && coupon.restricted_products.length > 0) {
        const cartProductIds = currentCart.items.map(item => item.product_id);
        const isProductApplicable = cartProductIds.some(productId => coupon.restricted_products.includes(Number(productId)));
        if (!isProductApplicable) {
          throw new ApiError(400, "Coupon is not applicable to any product in your cart.");
        }
      }

      if (coupon.restricted_categories && coupon.restricted_categories.length > 0) {
        const productIdsInCart = currentCart.items.map(item => item.product_id);
        const [productCategories] = await connection.query(
          `SELECT DISTINCT pc.category_id FROM product_categories pc WHERE pc.product_id IN (?)`,
          [productIdsInCart]
        );
        const cartCategoryIds = productCategories.map(row => row.category_id);
        const isCategoryApplicable = cartCategoryIds.some(categoryId => coupon.restricted_categories.includes(Number(categoryId)));
        if (!isCategoryApplicable) {
          throw new ApiError(400, "Coupon is not applicable to any category in your cart.");
        }
      }

      if (coupon.discount_type === "fixed") {
        current_discount_amount = coupon.discount_value;
      } else if (coupon.discount_type === "percent") {
        current_discount_amount = (currentCart.total_price * coupon.discount_value) / 100;
      }
      if (current_discount_amount > currentCart.total_price) {
        current_discount_amount = currentCart.total_price;
      }
    } else if (discount_amount === undefined) { // If coupon_code is explicitly null or not provided, and discount_amount is also not provided, reset it.
        current_discount_amount = 0;
    }

    // Use provided amounts or existing ones if not provided
    const finalShippingCost = shipping_cost !== undefined ? shipping_cost : existingOrder.shipping_cost;
    const finalTaxAmount = tax_amount !== undefined ? tax_amount : existingOrder.tax_amount;
    const finalDiscountAmount = current_discount_amount; // Use the re-calculated or provided discount

    const finalSubtotalAmount = currentCart.total_price; // Always recalculate based on current items
    const finalTotalAmount = parseFloat(finalSubtotalAmount) +
      parseFloat(finalShippingCost) +
      parseFloat(finalTaxAmount) -
      parseFloat(finalDiscountAmount);


    // 4. Build dynamic UPDATE query for 'orders' table
    const updateFields = [];
    const updateParams = [];

    updateFields.push("user_id = ?");
    updateParams.push(final_user_id); // Always update user_id if an authenticated user exists

    updateFields.push("customer_id = ?");
    updateParams.push(customer_id);

    if (customer_email !== undefined) {
      updateFields.push("customer_email = ?");
      updateParams.push(customer_email);
    }
    if (customer_phone !== undefined) {
      updateFields.push("customer_phone = ?");
      updateParams.push(customer_phone);
    }
    if (shipping_address !== undefined) {
      updateFields.push("shipping_address = ?");
      updateParams.push(JSON.stringify(shipping_address));
    }
    if (billing_address !== undefined) {
      updateFields.push("billing_address = ?");
      updateParams.push(JSON.stringify(billing_address));
    }
    if (shipping_method !== undefined) {
      updateFields.push("shipping_method = ?");
      updateParams.push(shipping_method);
    }
    if (payment_method !== undefined) {
      updateFields.push("payment_method = ?");
      updateParams.push(payment_method);
    }
    if (customer_notes !== undefined) {
      updateFields.push("customer_notes = ?");
      updateParams.push(customer_notes);
    }
    // Always update these calculated fields
    updateFields.push("total_amount = ?");
    updateParams.push(finalTotalAmount);
    updateFields.push("subtotal_amount = ?");
    updateParams.push(finalSubtotalAmount);
    updateFields.push("shipping_cost = ?");
    updateParams.push(finalShippingCost);
    updateFields.push("tax_amount = ?");
    updateParams.push(finalTaxAmount);
    updateFields.push("discount_amount = ?");
    updateParams.push(finalDiscountAmount);

    if (coupon_code !== undefined) {
      updateFields.push("coupon_code = ?");
      updateParams.push(coupon_code);
    }

    // Update status based on finalize_order flag
    const newStatus = finalize_order ? "pending" : "incomplete";
    updateFields.push("status = ?");
    updateParams.push(newStatus);

    // Payment status logic (if finalizing)
    if (finalize_order && payment_method !== undefined) {
      updateFields.push("payment_status = ?");
      updateParams.push("pending"); // Assume pending payment on finalization with a method
    }

    if (customer_ip_address !== undefined) {
      updateFields.push("customer_ip_address = ?");
      updateParams.push(customer_ip_address);
    }
    if (user_agent !== undefined) {
      updateFields.push("user_agent = ?");
      updateParams.push(user_agent);
    }
    if (utm_source !== undefined) {
      updateFields.push("utm_source = ?");
      updateParams.push(utm_source);
    }
    if (cancellation_reason !== undefined) {
      updateFields.push("cancellation_reason = ?");
      updateParams.push(cancellation_reason);
    }
    if (shipping_tracking_number !== undefined) {
      updateFields.push("shipping_tracking_number = ?");
      updateParams.push(shipping_tracking_number);
    }
    if (fulfilled_at !== undefined) {
      updateFields.push("fulfilled_at = ?");
      updateParams.push(fulfilled_at);
    }
    if (is_fraud !== undefined) {
      updateFields.push("is_fraud = ?");
      updateParams.push(is_fraud);
    }

    updateFields.push("updated_at = CURRENT_TIMESTAMP");

    const updateQuery = `UPDATE orders SET ${updateFields.join(", ")} WHERE id = ? AND store_id = ?`;
    const [result] = await connection.query(updateQuery, [...updateParams, order_id, req.store_id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return next(new ApiError(404, "Order not found or no changes made."));
    }

    // 5. Update customer stats if finalizing the order
    if (finalize_order) {
      await connection.query(
        `UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ?, last_order_date = CURRENT_TIMESTAMP WHERE id = ?`,
        [finalTotalAmount, customer_id]
      );
      // Deduct product stock only on finalization
      for (const item of currentCart.items) {
        await connection.query(
          "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND track_inventory = TRUE",
          [item.quantity, item.product_id]
        );
      }
    }

    await connection.commit();

    res.status(200).json({
      status: "success",
      message: finalize_order ? "Order finalized successfully." : "Incomplete order updated successfully.",
      data: { order_id },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Order update/finalization error:", error);
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Failed to update/finalize order.")
    );
  } finally {
    connection.release();
  }
};

// POST /api/v1/orders/incomplete - Create an incomplete order
exports.create_customer_incomplete_order = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      customer_email,
      customer_phone,
      customer_name,
      shipping_address,
      order_items, // Optional: if some items are already in the cart
      customer_ip_address,
      user_agent,
      utm_source,
    } = req.body;

    if (!customer_phone) {
      throw new ApiError(400, "Either customer_email or customer_phone is required for an incomplete order.");
    }

    // Find or Create a Customer record
    let customer_id;
    const findQuery = customer_email
      ? "SELECT id FROM customers WHERE store_id = ? AND email = ?"
      : "SELECT id FROM customers WHERE store_id = ? AND phone = ?";
    const findParams = customer_email
      ? [req.store_id, customer_email]
      : [req.store_id, customer_phone];

    const [existingCustomer] = await connection.query(findQuery, findParams);

    if (existingCustomer.length > 0) {
      customer_id = existingCustomer[0].id;
    } else {
      const [newCustomerResult] = await connection.query(
        "INSERT INTO customers (store_id, name, email, phone, billing_address, district, address, street, city, state, zip, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.store_id,
          customer_name || customer_email.split("@")[0], // Default name if not provided
          customer_email,
          customer_phone,
          shipping_address ? JSON.stringify(shipping_address) : null,
          shipping_address?.district || null,
          shipping_address?.address || null,
          shipping_address?.street || null,
          shipping_address?.city || null,
          shipping_address?.state || null,
          shipping_address?.zip || null,
          shipping_address?.country || null,
        ]
      );
      customer_id = newCustomerResult.insertId;
    }

    const order_number = `INC-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create the incomplete order with minimal details
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
          customer_id, store_id, order_number, total_amount, subtotal_amount, shipping_cost, tax_amount, discount_amount,
          status, payment_status, customer_email, customer_phone, shipping_address, customer_ip_address, user_agent, utm_source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        req.store_id,
        order_number,
        0, // total_amount
        0, // subtotal_amount
        0, // shipping_cost
        0, // tax_amount
        0, // discount_amount
        "incomplete", // Set status as incomplete
        "unpaid", // payment_status
        customer_email,
        customer_phone,
        JSON.stringify(shipping_address || {}),
        customer_ip_address || req.ip,
        user_agent || req.headers["user-agent"],
        utm_source,
      ]
    );
    const order_id = orderResult.insertId;

    // Save order items if provided
    if (order_items && order_items.length > 0) {
      const orderItemsToInsert = [];
      for (const item of order_items) {
        const [productRows] = await connection.query(
          "SELECT id, name, sku, price, variants FROM products WHERE id = ? AND store_id = ?",
          [item.product_id, req.store_id]
        );

        if (productRows.length === 0) {
          console.warn(`Product with ID ${item.product_id} not found for incomplete order, skipping.`);
          continue; // Skip this item but continue with others
        }
        const product = productRows[0];

        orderItemsToInsert.push([
          order_id,
          product.id,
          product.name,
          product.sku,
          item.variants ? JSON.stringify(item.variants) : null,
          item.selected_variants ? JSON.stringify(item.selected_variants) : null,
          item.quantity,
          product.price,
          (item.quantity * product.price).toFixed(2),
        ]);
      }

      if (orderItemsToInsert.length > 0) {
        await connection.query(
          `INSERT INTO order_items (
              order_id, product_id, product_name_at_purchase, sku_at_purchase, variants, selected_variants, quantity, price_at_purchase, line_item_total
          ) VALUES ?`,
          [orderItemsToInsert]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      status: "success",
      message: "Incomplete order saved successfully.",
      data: { order_id, order_number },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Incomplete order saving error:", error);
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Failed to save incomplete order.")
    );
  } finally {
    connection.release();
  }
};

exports.createOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      customer_email,
      customer_phone,
      shipping_address,
      billing_address,
      shipping_method,
      payment_method,
      customer_notes,
      shipping_cost = 0,
      tax_amount = 0,
      order_items, // order_items are required for this API
      customer_ip_address, // New field
      user_agent, // New field
      utm_source, // New field
      coupon_code, // New field
      cancellation_reason, // New field
      shipping_tracking_number, // New field
      fulfilled_at, // New field
      is_fraud, // New field
    } = req.body;
    let discount_amount = 0; // Initialize discount_amount

    // Ensure order_items are provided
    if (!order_items || order_items.length === 0) {
      return next(
        new ApiError(400, "Order items are required to create an order.")
      );
    }

    // The user creating the order is the authenticated owner
    const final_user_id = req.user.id;

    // Default customer name from email if no name is in the body
    const customer_name =
      req.body.customer_name || customer_email.split("@")[0];

    // Find or Create a Customer record
    let customer_id;
    const findQuery = customer_email
      ? "SELECT id FROM customers WHERE store_id = ? AND email = ?"
      : "SELECT id FROM customers WHERE store_id = ? AND phone = ?";
    const findParams = customer_email
      ? [req.store_id, customer_email]
      : [req.store_id, customer_phone];

    const [existingCustomer] = await connection.query(findQuery, findParams);

    if (existingCustomer.length > 0) {
      customer_id = existingCustomer[0].id;
    } else {
      const [newCustomerResult] = await connection.query(
        "INSERT INTO customers (store_id, name, email, phone, billing_address, district, address, street, city, state, zip, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.store_id,
          customer_name,
          customer_email,
          customer_phone,
          billing_address ? JSON.stringify(billing_address) : null,
          shipping_address.district || null,
          shipping_address.address || null,
          shipping_address.street || null,
          shipping_address.city || null,
          shipping_address.state || null,
          shipping_address.zip || null,
          shipping_address.country || null,
        ]
      );
      customer_id = newCustomerResult.insertId;
    }

    // Determine currentCart from order_items
    let currentCart = { items: [], total_quantity: 0, total_price: 0 };
    for (const item of order_items) {
      const [productRows] = await connection.query(
        "SELECT id, name, sku, price, stock_quantity, track_inventory FROM products WHERE id = ? AND store_id = ?",
        [item.product_id, req.store_id]
      );

      if (productRows.length === 0) {
        throw new ApiError(
          404,
          `Product with ID ${item.product_id} not found.`
        );
      }

      const product = productRows[0];

      if (
        product.track_inventory &&
        product.stock_quantity > 0 &&
        product.stock_quantity < item.quantity
      ) {
        throw new ApiError(
          400,
          `Insufficient stock for product ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`
        );
      }

      currentCart.items.push({
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        price: product.price,
      });
      currentCart.total_quantity += item.quantity;
      currentCart.total_price += product.price * item.quantity;
    }

    // Coupon code validation and application
    let applied_discount_amount = 0;
    if (coupon_code) {
      const coupon = await Coupon.getCouponWithRestrictions(coupon_code);

      if (!coupon) {
        throw new ApiError(400, "Invalid or expired coupon code.");
      }

      // Check if coupon is active
      if (!coupon.is_active) {
        throw new ApiError(400, "Coupon is not active.");
      }

      // Check if coupon has expired
      if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
        throw new ApiError(400, "Coupon has expired.");
      }

      // Check usage limit per coupon
      if (
        coupon.usage_limit_per_coupon !== null &&
        coupon.times_used >= coupon.usage_limit_per_coupon
      ) {
        throw new ApiError(400, "Coupon usage limit reached.");
      }

      // Check usage limit per customer (requires fetching customer's past orders with this coupon)
      if (coupon.usage_limit_per_customer !== null) {
        const [customerCouponUsage] = await connection.query(
          "SELECT COUNT(*) AS usage_count FROM orders WHERE customer_id = ? AND coupon_code = ?",
          [customer_id, coupon_code]
        );
        if (
          customerCouponUsage[0].usage_count >= coupon.usage_limit_per_customer
        ) {
          throw new ApiError(
            400,
            "You have reached the usage limit for this coupon."
          );
        }
      }

      // Check minimum spend
      if (
        coupon.minimum_spend &&
        currentCart.total_price < coupon.minimum_spend
      ) {
        throw new ApiError(
          400,
          `Minimum spend of ${coupon.minimum_spend} not met for this coupon. Current cart total: ${currentCart.total_price}.`
        );
      }

      // Check product restrictions
      if (coupon.restricted_products && coupon.restricted_products.length > 0) {
        const cartProductIds = currentCart.items.map((item) => item.product_id);
        const isProductApplicable = cartProductIds.some((productId) =>
          coupon.restricted_products.includes(Number(productId))
        );
        if (!isProductApplicable) {
          throw new ApiError(
            400,
            "Coupon is not applicable to any product in your cart."
          );
        }
      }

      // Check category restrictions
      if (
        coupon.restricted_categories &&
        coupon.restricted_categories.length > 0
      ) {
        // Fetch categories for products in the cart
        const productIdsInCart = currentCart.items.map(
          (item) => item.product_id
        );
        const [productCategories] = await connection.query(
          `SELECT DISTINCT pc.category_id FROM product_categories pc WHERE pc.product_id IN (?)`,
          [productIdsInCart]
        );
        console.log("productCategories >>", productCategories);
        const cartCategoryIds = productCategories.map((row) => row.category_id);

        const isCategoryApplicable = cartCategoryIds.some((categoryId) =>
          coupon.restricted_categories.includes(Number(categoryId))
        );

        if (!isCategoryApplicable) {
          throw new ApiError(
            400,
            "Coupon is not applicable to any category in your cart."
          );
        }
      }

      // Calculate discount
      if (coupon.discount_type === "fixed") {
        applied_discount_amount = coupon.discount_value;
      } else if (coupon.discount_type === "percent") {
        applied_discount_amount =
          (currentCart.total_price * coupon.discount_value) / 100;
      }

      // Ensure discount doesn't exceed total price
      if (applied_discount_amount > currentCart.total_price) {
        applied_discount_amount = currentCart.total_price;
      }

      // Increment coupon usage count
      await connection.query(
        "UPDATE coupons SET times_used = times_used + 1 WHERE id = ?",
        [coupon.id]
      );
    }
    discount_amount = applied_discount_amount; // Override the initial discount_amount with the applied coupon discount

    // Calculate amounts
    const order_number = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
    const subtotal_amount = parseFloat(currentCart.total_price);
    const total_amount =
      subtotal_amount +
      parseFloat(shipping_cost) +
      parseFloat(tax_amount) -
      parseFloat(discount_amount);

    // Create the order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
          user_id, customer_id, store_id, order_number, total_amount, subtotal_amount, shipping_cost, tax_amount, discount_amount,
          status, payment_status, customer_email, customer_phone, shipping_address, billing_address,
          shipping_method, payment_method, customer_notes, customer_ip_address, user_agent, utm_source, coupon_code,
          cancellation_reason, shipping_tracking_number, fulfilled_at, is_fraud
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        final_user_id,
        customer_id,
        req.store_id,
        order_number,
        total_amount,
        subtotal_amount,
        shipping_cost,
        tax_amount,
        discount_amount,
        "pending", // Default status
        "pending", // Default payment_status
        customer_email,
        customer_phone,
        JSON.stringify(shipping_address),
        JSON.stringify(billing_address),
        shipping_method,
        payment_method,
        customer_notes,
        customer_ip_address || req.ip, // Use provided IP or request IP
        user_agent || req.headers["user-agent"], // Use provided user agent or request header
        utm_source,
        coupon_code,
        cancellation_reason,
        shipping_tracking_number,
        fulfilled_at,
        is_fraud || 0, // Default to 0 if not provided
      ]
    );
    const order_id = orderResult.insertId;

    // Create order items
    const orderItemsToInsert = currentCart.items.map((item) => [
      order_id,
      item.product_id,
      item.name, // product_name_at_purchase
      item.sku, // sku_at_purchase
      item.variants ? JSON.stringify(item.variants) : null,
      item.selected_variants ? JSON.stringify(item.selected_variants) : null, // New field: selected_variants
      item.quantity,
      item.price, // price_at_purchase
      (item.quantity * item.price).toFixed(2), // line_item_total
    ]);
    await connection.query(
      `INSERT INTO order_items (
          order_id, product_id, product_name_at_purchase, sku_at_purchase, variants, selected_variants, quantity, price_at_purchase, line_item_total
      ) VALUES ?`,
      [orderItemsToInsert]
    );

    // Decrease product stock
    for (const item of currentCart.items) {
      await connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND track_inventory = TRUE",
        [item.quantity, item.product_id]
      );
    }

    // Update customer stats
    await connection.query(
      `UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ?, last_order_date = CURRENT_TIMESTAMP WHERE id = ?`,
      [total_amount, customer_id]
    );

    await connection.commit();

    res.status(201).json({
      status: "success",
      message: "Order created successfully.",
      data: { order_id },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Order creation error:", error);
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Failed to create order.")
    );
  } finally {
    connection.release();
  }
};

// GET /api/v1/orders
exports.get_all_orders = async (req, res, next) => {
  try {
    const [orders] = await pool.query(
      "SELECT id, total_amount, status, created_at FROM orders WHERE user_id = ? AND store_id = ? ORDER BY created_at DESC",
      [req.user.id, req.store_id]
    );
    res.status(200).json({ status: "success", data: { orders } });
  } catch (error) {
    next(new ApiError(500, "Failed to retrieve orders."));
  }
};

// GET /api/v1/orders/:order_id
exports.get_order_by_id = async (req, res, next) => {
  try {
    const { order_id } = req.params;

    // const [orderRows] = await pool.query(
    //   "SELECT * FROM orders WHERE id = ? AND store_id = ?",
    //   [order_id, req.store_id]
    // );
    const [orderRows] = await pool.query(
      "SELECT *, is_fraud FROM orders WHERE id = ?",
      [order_id]
    );
    if (orderRows.length === 0) {
      return next(new ApiError(404, "Order not found."));
    }

    const [itemRows] = await pool.query(
      `SELECT
                oi.product_id,
                oi.product_name_at_purchase AS name,
                oi.sku_at_purchase AS sku,
                oi.variants,
                oi.selected_variants,
                oi.quantity,
                oi.price_at_purchase,
                oi.line_item_total,
                p.image_url,
                p.variants
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?`,
      [order_id]
    );

    const order = { ...orderRows[0], items: itemRows };

    // Parse JSON fields
    if (order.shipping_address) {
      order.shipping_address = JSON.parse(order.shipping_address);
    }
    if (order.billing_address) {
      order.billing_address = JSON.parse(order.billing_address);
    }

    res.status(200).json({ status: "success", data: { order } });
  } catch (error) {
    console.error("Error fetching order details:", error);
    next(new ApiError(500, "Failed to retrieve order details."));
  }
};
// PUT /api/v1/orders/:order_id
exports.update_order_status = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const [result] = await pool.query(
      "UPDATE orders SET status = ? WHERE id = ? AND store_id = ?",
      [status, order_id, req.store_id]
    );

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "Order not found."));
    }

    res.status(200).json({
      status: "success",
      message: "Order status updated successfully.",
    });
  } catch (error) {
    next(new ApiError(500, "Error updating order status."));
  }
};

// PUT /api/v1/orders/bulk-update-status
exports.bulk_update_order_status = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { updates } = req.body; // Array of { order_id, status } objects

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return next(new ApiError(400, "No updates provided."));
    }

    const updatePromises = updates.map(async (update) => {
      const { order_id, status } = update;
      if (!order_id || !status) {
        throw new ApiError(
          400,
          "Each update must contain order_id and status."
        );
      }
      const [result] = await connection.query(
        "UPDATE orders SET status = ? WHERE id = ? AND store_id = ?",
        [status, order_id, req.store_id]
      );
      if (result.affectedRows === 0) {
        console.warn(`Order ${order_id} not found or not updated.`);
        return {
          order_id,
          success: false,
          message: "Order not found or no changes made.",
        };
      }
      return { order_id, success: true, message: "Status updated." };
    });

    const results = await Promise.all(updatePromises);

    await connection.commit();

    res.status(200).json({
      status: "success",
      message: "Bulk order status update processed.",
      data: { results },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Bulk order status update error:", error);
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Failed to bulk update order statuses.")
    );
  } finally {
    connection.release();
  }
};

// PUT /api/v1/owner/orders/:order_id - Update an order by ID for store owner
exports.updateOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { order_id } = req.params;
    const {
      user_id,
      customer_id,
      customer_email,
      customer_phone,
      customer_ip_address,
      user_agent,
      utm_source,
      order_number,
      total_amount,
      subtotal_amount,
      shipping_cost,
      tax_amount,
      discount_amount,
      coupon_code,
      status,
      cancellation_reason,
      shipping_address,
      billing_address,
      shipping_method,
      shipping_tracking_number,
      fulfilled_at,
      payment_method,
      payment_status,
      customer_notes,
      order_items, // For updating order items
      is_fraud, // New field
    } = req.body;

    // Build the UPDATE query dynamically for the 'orders' table
    const updateFields = [];
    const updateParams = [];

    if (user_id !== undefined) {
      updateFields.push("user_id = ?");
      updateParams.push(user_id);
    }
    if (customer_id !== undefined) {
      updateFields.push("customer_id = ?");
      updateParams.push(customer_id);
    }
    if (customer_email !== undefined) {
      updateFields.push("customer_email = ?");
      updateParams.push(customer_email);
    }
    if (customer_phone !== undefined) {
      updateFields.push("customer_phone = ?");
      updateParams.push(customer_phone);
    }
    if (customer_ip_address !== undefined) {
      updateFields.push("customer_ip_address = ?");
      updateParams.push(customer_ip_address);
    }
    if (user_agent !== undefined) {
      updateFields.push("user_agent = ?");
      updateParams.push(user_agent);
    }
    if (utm_source !== undefined) {
      updateFields.push("utm_source = ?");
      updateParams.push(utm_source);
    }
    if (order_number !== undefined) {
      updateFields.push("order_number = ?");
      updateParams.push(order_number);
    }
    if (total_amount !== undefined) {
      updateFields.push("total_amount = ?");
      updateParams.push(total_amount);
    }
    if (subtotal_amount !== undefined) {
      updateFields.push("subtotal_amount = ?");
      updateParams.push(subtotal_amount);
    }
    if (shipping_cost !== undefined) {
      updateFields.push("shipping_cost = ?");
      updateParams.push(shipping_cost);
    }
    if (tax_amount !== undefined) {
      updateFields.push("tax_amount = ?");
      updateParams.push(tax_amount);
    }
    if (discount_amount !== undefined) {
      updateFields.push("discount_amount = ?");
      updateParams.push(discount_amount);
    }
    if (coupon_code !== undefined) {
      updateFields.push("coupon_code = ?");
      updateParams.push(coupon_code);
    }
    if (status !== undefined) {
      updateFields.push("status = ?");
      updateParams.push(status);
    }
    if (cancellation_reason !== undefined) {
      updateFields.push("cancellation_reason = ?");
      updateParams.push(cancellation_reason);
    }
    if (shipping_address !== undefined) {
      updateFields.push("shipping_address = ?");
      updateParams.push(JSON.stringify(shipping_address));
    }
    if (billing_address !== undefined) {
      updateFields.push("billing_address = ?");
      updateParams.push(JSON.stringify(billing_address));
    }
    if (shipping_method !== undefined) {
      updateFields.push("shipping_method = ?");
      updateParams.push(shipping_method);
    }
    if (shipping_tracking_number !== undefined) {
      updateFields.push("shipping_tracking_number = ?");
      updateParams.push(shipping_tracking_number);
    }
    if (fulfilled_at !== undefined) {
      updateFields.push("fulfilled_at = ?");
      updateParams.push(fulfilled_at);
    }
    if (payment_method !== undefined) {
      updateFields.push("payment_method = ?");
      updateParams.push(payment_method);
    }
    if (payment_status !== undefined) {
      updateFields.push("payment_status = ?");
      updateParams.push(payment_status);
    }
    if (customer_notes !== undefined) {
      updateFields.push("customer_notes = ?");
      updateParams.push(customer_notes);
    }
    if (is_fraud !== undefined) {
      updateFields.push("is_fraud = ?");
      updateParams.push(is_fraud);
    }

    // Always update updated_at timestamp
    updateFields.push("updated_at = CURRENT_TIMESTAMP");

    if (updateFields.length > 0) {
      const updateQuery = `UPDATE orders SET ${updateFields.join(
        ", "
      )} WHERE id = ? AND store_id = ?`;
      const [result] = await connection.query(updateQuery, [
        ...updateParams,
        order_id,
        req.store_id,
      ]);

      if (result.affectedRows === 0) {
        await connection.rollback();
        return next(new ApiError(404, "Order not found or no changes made."));
      }
    }

    // Handle order_items updates (if provided)
    if (order_items && order_items.length > 0) {
      // For simplicity, we'll delete existing items and re-insert.
      // A more robust solution would involve checking for existing items and updating them.
      await connection.query("DELETE FROM order_items WHERE order_id = ?", [
        order_id,
      ]);

      const orderItemsToInsert = order_items.map((item) => [
        order_id,
        item.product_id,
        item.name,
        item.sku_at_purchase,
        item.variants ? JSON.stringify(item.variants) : null,
        item.selected_variants ? JSON.stringify(item.selected_variants) : null,
        item.quantity,
        item.price_at_purchase,
        item.line_item_total,
      ]);
      await connection.query(
        `INSERT INTO order_items (
            order_id, product_id, product_name_at_purchase, sku_at_purchase, variants, selected_variants, quantity, price_at_purchase, line_item_total
        ) VALUES ?`,
        [orderItemsToInsert]
      );
    }

    await connection.commit();

    res.status(200).json({
      status: "success",
      message: "Order updated successfully.",
      data: { order_id },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Order update error:", error);
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Failed to update order.")
    );
  } finally {
    connection.release();
  }
};

// DELETE /api/v1/orders/:order_id
exports.delete_order = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM orders WHERE id = ? AND store_id = ?",
      [order_id, req.store_id]
    );

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "Order not found."));
    }

    res.status(204).send();
  } catch (error) {
    next(new ApiError(500, "Error deleting order."));
  }
};

// GET /api/v1/store/orders - Get all orders for a store with pagination
// exports.get_all_store_orders = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;

//     // Get total count for pagination
//     const [totalCountRows] = await pool.query(
//       "SELECT COUNT(*) AS total_count FROM orders WHERE store_id = ?",
//       [req.store_id]
//     );
//     const total_count = totalCountRows[0].total_count;

//     // Fetch paginated orders with user details
//     const [rawOrders] = await pool.query(
//       `
//             SELECT
//                 o.id, o.user_id, o.store_id, o.order_number, o.total_amount, o.subtotal_amount, o.shipping_cost, o.tax_amount, o.discount_amount,
//                 o.status, o.payment_status, o.customer_email, o.customer_phone, o.shipping_address, o.billing_address,
//                 o.shipping_method, o.payment_method, o.customer_notes, o.created_at, o.updated_at,
//                 u.name AS user_name, u.email AS user_email, u.phone_number AS user_phone
//             FROM
//                 orders o
//             LEFT JOIN
//                 users u ON o.user_id = u.id
//             WHERE
//                 o.store_id = ?
//             ORDER BY
//                 o.created_at DESC
//             LIMIT ? OFFSET ?
//             `,
//       [req.store_id, parseInt(limit, 10), parseInt(offset, 10)]
//     );

//     if (rawOrders.length === 0) {
//       return res.status(200).json({
//         status: "success",
//         results: 0,
//         total_count: 0,
//         page: parseInt(page, 10),
//         limit: parseInt(limit, 10),
//         data: { orders: [] },
//       });
//     }

//     const orderIds = rawOrders.map((order) => order.id);

//     // Fetch all order items for the fetched orders
//     const [rawOrderItems] = await pool.query(
//       `
//             SELECT
//                 oi.order_id,
//                 oi.product_id,
//                 oi.product_name_at_purchase AS name,
//                 oi.sku_at_purchase AS sku,
//                 oi.quantity,
//                 oi.price_at_purchase,
//                 oi.line_item_total,
//                 p.image_url
//             FROM
//                 order_items oi
//             LEFT JOIN
//                 products p ON oi.product_id = p.id
//             WHERE
//                 oi.order_id IN (?)
//             `,
//       [orderIds]
//     );

//     // Map order items to their respective orders
//     const ordersMap = new Map(
//       rawOrders.map((order) => [
//         order.id,
//         {
//           ...order,
//           shipping_address: order.shipping_address
//             ? JSON.parse(order.shipping_address)
//             : null,
//           billing_address: order.billing_address
//             ? JSON.parse(order.billing_address)
//             : null,
//           items: [],
//         },
//       ])
//     );

//     rawOrderItems.forEach((item) => {
//       if (ordersMap.has(item.order_id)) {
//         ordersMap.get(item.order_id).items.push(item);
//       }
//     });

//     const orders = Array.from(ordersMap.values());

//     res.status(200).json({
//       status: "success",
//       results: orders.length,
//       total_count,
//       page: parseInt(page, 10),
//       limit: parseInt(limit, 10),
//       data: { orders },
//     });
//   } catch (error) {
//     console.error("Error fetching all store orders:", error);
//     next(new ApiError(500, "Failed to retrieve store orders."));
//   }
// };

// GET /api/v1/store/orders/:order_id - Get a single order for a store owner
exports.get_store_order_by_id = async (req, res, next) => {
  try {
    const { order_id } = req.params;

    // Fetch order details with user details
    const [orderRows] = await pool.query(
      `
            SELECT
                o.id, o.user_id, o.customer_id, o.customer_email, o.customer_phone, o.customer_ip_address, o.user_agent, o.utm_source,
                o.store_id, o.order_number, o.total_amount, o.subtotal_amount, o.shipping_cost, o.tax_amount, o.discount_amount,
                o.coupon_code, o.status, o.cancellation_reason, o.shipping_address, o.billing_address, o.shipping_method,
                o.shipping_tracking_number, o.fulfilled_at, o.payment_method, o.payment_status, o.customer_notes, o.is_fraud,
                o.created_at, o.updated_at,
                u.name AS user_name, u.email AS user_email, u.phone_number AS user_phone
            FROM
                orders o
            LEFT JOIN
                users u ON o.user_id = u.id
            WHERE
                o.id = ? AND o.store_id = ?
            `,
      [order_id, req.store_id]
    );

    if (orderRows.length === 0) {
      return next(new ApiError(404, "Order not found for this store."));
    }

    const order = { ...orderRows[0] };

    // Fetch order items for this order
    const [itemRows] = await pool.query(
      `
            SELECT
                oi.product_id,
                oi.product_name_at_purchase AS name,
                oi.sku_at_purchase AS sku,
                oi.variants,
                oi.selected_variants,
                oi.quantity,
                oi.price_at_purchase,
                oi.line_item_total,
                p.image_url,
                p.variants
            FROM
                order_items oi
            LEFT JOIN
                products p ON oi.product_id = p.id
            WHERE
                oi.order_id = ?
            `,
      [order_id]
    );

    order.items = itemRows;

    // Parse JSON fields
    if (order.shipping_address) {
      order.shipping_address = JSON.parse(order.shipping_address);
    }
    if (order.billing_address) {
      order.billing_address = JSON.parse(order.billing_address);
    }

    res.status(200).json({ status: "success", data: { order } });
  } catch (error) {
    console.error("Error fetching store order by ID:", error);
    next(new ApiError(500, "Failed to retrieve order details for this store."));
  }
};

// GET /api/v1/orders/status-counts
exports.get_order_status_counts = async (req, res, next) => {
  try {
    console.log("req.store_id >>", req.store_id);

    // Check if orders table exists first
    const [tables] = await pool.query(
      "SHOW TABLES LIKE 'orders'"
    );

    if (tables.length === 0) {
      // Orders table doesn't exist yet, return empty counts
      return res.status(200).json({
        status: "success",
        data: {
          counts: {},
        },
      });
    }

    const [rows] = await pool.query(
      "SELECT status, COUNT(*) AS count FROM orders WHERE store_id = ? GROUP BY status",
      [req.store_id]
    );

    const counts = {};
    rows.forEach((row) => {
      counts[row.status] = row.count;
    });

    res.status(200).json({
      status: "success",
      data: {
        counts: counts,
      },
    });
  } catch (error) {
    console.error("Error fetching order status counts:", error);
    // Return empty counts instead of 500 to prevent dashboard crash
    res.status(200).json({
      status: "success",
      data: {
        counts: {},
      },
    });
  }
};

// GET /api/v1/store/orders/summary
exports.get_order_summary = async (req, res, next) => {
  try {
    const { period = "today" } = req.query; // Default to today
    let dateFilterClause = "";

    // Set the date filtering logic based on the period
    switch (period) {
      case "today":
        dateFilterClause = "AND DATE(created_at) = CURDATE()";
        break;
      case "this_week":
        dateFilterClause =
          "AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)";
        break;
      case "this_month":
        dateFilterClause =
          "AND YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())";
        break;
      case "all_time":
      default:
        dateFilterClause = ""; // No date filter for all_time
        break;
    }

    const query = `
        SELECT
            COUNT(id) AS total_orders_confirmed,
            COALESCE(SUM(total_amount), 0) AS total_amount,
            COUNT(DISTINCT user_id) AS total_customers_served
        FROM
            orders
        WHERE
            store_id = ? AND status = 'confirmed'
            ${dateFilterClause}
    `;

    const [summaryRows] = await pool.query(query, [req.store_id]);

    const summary = {
      total_orders_confirmed: summaryRows[0].total_orders_confirmed || 0,
      total_amount: parseFloat(summaryRows[0].total_amount).toFixed(2),
      total_customers_served: summaryRows[0].total_customers_served || 0,
    };

    res.status(200).json({
      status: "success",
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching order summary:", error);
    next(new ApiError(500, "Failed to retrieve order summary."));
  }
};

// GET /api/v1/store/orders - Get all orders for a store with pagination, filter, and search
exports.get_all_store_orders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClauses = ["o.store_id = ?"];
    let queryParams = [req.store_id];

    // Add status filter if provided
    if (status) {
      whereClauses.push("o.status = ?");
      queryParams.push(status);
    }

    // Add search filter if provided
    if (search) {
      whereClauses.push(
        "(o.order_number LIKE ? OR o.customer_email LIKE ? OR u.name LIKE ? OR o.customer_phone LIKE ?)"
      );
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

    // 1. Get total count for pagination with filters applied
    const countQuery = `SELECT COUNT(o.id) AS total_count FROM orders o LEFT JOIN users u ON o.user_id = u.id ${whereSql}`;
    const [totalCountRows] = await pool.query(countQuery, queryParams);
    const total_count = totalCountRows[0].total_count;

    // 2. Fetch paginated orders with user details and filters
    const dataQuery = `
        SELECT
            o.id, o.user_id, o.customer_id, o.customer_email, o.customer_phone, o.customer_ip_address, o.user_agent, o.utm_source,
            o.store_id, o.order_number, o.total_amount, o.subtotal_amount, o.shipping_cost, o.tax_amount, o.discount_amount,
            o.coupon_code, o.status, o.cancellation_reason, o.shipping_address, o.billing_address, o.shipping_method,
            o.shipping_tracking_number, o.fulfilled_at, o.payment_method, o.payment_status, o.customer_notes, o.is_fraud,
            o.created_at, o.updated_at,
            u.name AS user_name, u.email AS user_email, u.phone_number AS user_phone
        FROM
            orders o
        LEFT JOIN
            users u ON o.user_id = u.id
        ${whereSql}
        ORDER BY
            o.created_at DESC
        LIMIT ? OFFSET ?
    `;

    const [rawOrders] = await pool.query(dataQuery, [
      ...queryParams,
      parseInt(limit, 10),
      parseInt(offset, 10),
    ]);

    if (rawOrders.length === 0) {
      return res.status(200).json({
        status: "success",
        results: 0,
        total_count: 0,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        data: { orders: [] },
      });
    }

    // This part for fetching items remains the same as your original code
    const orderIds = rawOrders.map((order) => order.id);
    const [rawOrderItems] = await pool.query(
      `
            SELECT
                oi.order_id, oi.product_id, oi.product_name_at_purchase AS name, oi.sku_at_purchase AS sku, oi.variants, oi.selected_variants,
                oi.quantity, oi.price_at_purchase, oi.line_item_total, p.image_url, p.variants
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id IN (?)
            `,
      [orderIds]
    );

    const ordersMap = new Map(
      rawOrders.map((order) => [
        order.id,
        {
          ...order,
          shipping_address: order.shipping_address
            ? (() => {
                try {
                  return JSON.parse(order.shipping_address);
                } catch (e) {
                  console.error(`Failed to parse shipping_address for order ${order.id}:`, e);
                  return null;
                }
              })()
            : null,
          billing_address: order.billing_address
            ? (() => {
                try {
                  return JSON.parse(order.billing_address);
                } catch (e) {
                  console.error(`Failed to parse billing_address for order ${order.id}:`, e);
                  return null;
                }
              })()
            : null,
          items: [],
        },
      ])
    );

    rawOrderItems.forEach((item) => {
      if (ordersMap.has(item.order_id)) {
        ordersMap.get(item.order_id).items.push(item);
      }
    });

    const orders = Array.from(ordersMap.values());

    res.status(200).json({
      status: "success",
      results: orders.length,
      total_count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      data: { orders },
    });
  } catch (error) {
    console.error("Error fetching all store orders:", error);
    next(new ApiError(500, "Failed to retrieve store orders."));
  }
};

// GET /api/v1/store/orders/export
exports.export_store_orders = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    let whereClauses = ["o.store_id = ?"];
    let queryParams = [req.store_id];

    // Reuse the same filter and search logic
    if (status) {
      whereClauses.push("o.status = ?");
      queryParams.push(status);
    }
    if (search) {
      whereClauses.push(
        "(o.order_number LIKE ? OR o.customer_email LIKE ? OR u.name LIKE ? OR o.customer_phone LIKE ?)"
      );
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

    // Fetch ALL matching orders, no pagination (LIMIT/OFFSET)
    const query = `
        SELECT
            o.order_number,
            o.created_at,
            u.name AS customer_name,
            o.customer_email,
            o.customer_phone,
            o.total_amount,
            o.status,
            o.payment_status,
            o.shipping_method,
            o.payment_method
        FROM
            orders o
        LEFT JOIN
            users u ON o.user_id = u.id
        ${whereSql}
        ORDER BY
            o.created_at DESC
    `;

    const [ordersToExport] = await pool.query(query, queryParams);

    if (ordersToExport.length === 0) {
      return next(
        new ApiError(404, "No orders found to export with the given criteria.")
      );
    }

    // Define the fields for the CSV file
    const fields = [
      "order_number",
      "created_at",
      "customer_name",
      "customer_email",
      "customer_phone",
      "total_amount",
      "status",
      "payment_status",
      "shipping_method",
      "payment_method",
    ];
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(ordersToExport);

    const fileName = `orders-export-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    res.header("Content-Type", "text/csv");
    res.attachment(fileName);
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting store orders:", error);
    next(new ApiError(500, "Failed to export store orders."));
  }
};
// GET /api/v1/store/customers
exports.get_all_store_customers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClauses = ["store_id = ?"];
    let queryParams = [req.store_id];

    // Add search filter if provided
    if (search) {
      whereClauses.push(
        "(name LIKE ? OR email LIKE ? OR phone LIKE ? OR district LIKE ?)"
      );
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

    // Get total count for pagination
    const countQuery = `SELECT COUNT(id) AS total_count FROM customers ${whereSql}`;
    const [totalCountRows] = await pool.query(countQuery, queryParams);
    const total_count = totalCountRows[0].total_count;

    // Fetch paginated customers
    // SELECT id, name, email, phone, district, total_orders, total_spent, last_order_date, created_at
    const dataQuery = `
        SELECT *
        FROM customers
        ${whereSql}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `;

    const [customers] = await pool.query(dataQuery, [
      ...queryParams,
      parseInt(limit, 10),
      parseInt(offset, 10),
    ]);

    res.status(200).json({
      status: "success",
      results: customers.length,
      total_count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      data: { customers },
    });
  } catch (error) {
    console.error("Error fetching store customers:", error);
    next(new ApiError(500, "Failed to retrieve store customers."));
  }
};
