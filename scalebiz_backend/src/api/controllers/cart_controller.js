const pool = require('../../config/database');
const ApiError = require('../../utils/api_error');

// Initialize cart if it doesn't exist on the session
const init_cart = (req) => {
  if (!req.session.cart) {
    req.session.cart = { items: [], total_quantity: 0, total_price: 0 };
  }
};

// Recalculate cart totals
const calculate_totals = (cart) => {
  cart.total_quantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.total_price = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);
};

// GET /api/v1/cart
exports.get_cart = (req, res, next) => {
  try {
    init_cart(req);
    res.status(200).json({
      status: 'success',
      data: { cart: req.session.cart },
    });
  } catch (error) {
    next(new ApiError(500, 'Failed to retrieve cart.'));
  }
};

// POST /api/v1/cart/items
exports.add_item_to_cart = async (req, res, next) => {
  init_cart(req);
  try {
    const { product_id, quantity = 1 } = req.body;
    
    // Check if product exists and belongs to the store
    const [productRows] = await pool.query(
        'SELECT id, name, price, image_url, sku FROM products WHERE id = ? AND store_id = ?',
        [product_id, req.store_id]
    );
    if (productRows.length === 0) {
        return next(new ApiError(404, 'Product not found.'));
    }
    const product = productRows[0];

    const existingItemIndex = req.session.cart.items.findIndex(item => item.product_id === product_id);
    if (existingItemIndex > -1) {
        req.session.cart.items[existingItemIndex].quantity += quantity;
    } else {
        req.session.cart.items.push({
            product_id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            sku: product.sku, // Add SKU to cart item
            quantity
        });
    }
    calculate_totals(req.session.cart);
    res.status(200).json({ status: 'success', data: { cart: req.session.cart } });

  } catch(error) {
    next(new ApiError(500, 'Could not add item to cart.'));
  }
};

// PUT /api/v1/cart/items/:item_id
exports.update_cart_item = (req, res, next) => {
  try {
    init_cart(req);
    const { item_id } = req.params;
    const { quantity } = req.body;
    const itemIndex = req.session.cart.items.findIndex(item => item.product_id == item_id);

    if (itemIndex > -1) {
      if (quantity > 0) {
          req.session.cart.items[itemIndex].quantity = quantity;
      } else {
          req.session.cart.items.splice(itemIndex, 1);
      }
      calculate_totals(req.session.cart);
    }
    res.status(200).json({ status: 'success', data: { cart: req.session.cart } });
  } catch (error) {
    next(new ApiError(500, 'Failed to update cart item.'));
  }
};

// DELETE /api/v1/cart/items/:item_id
exports.remove_cart_item = (req, res, next) => {
  try {
    init_cart(req);
    const { item_id } = req.params;
    req.session.cart.items = req.session.cart.items.filter(item => item.product_id != item_id);
    calculate_totals(req.session.cart);
    res.status(200).json({ status: 'success', data: { cart: req.session.cart } });
  } catch (error) {
    next(new ApiError(500, 'Failed to remove cart item.'));
  }
};

// DELETE /api/v1/cart
exports.clear_cart = (req, res, next) => {
  try {
    req.session.cart = { items: [], total_quantity: 0, total_price: 0 };
    res.status(204).send();
  } catch (error) {
    next(new ApiError(500, 'Failed to clear cart.'));
  }
};