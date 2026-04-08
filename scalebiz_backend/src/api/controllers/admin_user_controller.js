const asyncHandler = require("../../utils/async_handler");
const ApiError = require("../../utils/api_error");
const pool = require("../../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin can create a new user (including other admins)
exports.createAdminUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, store_id } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "Name, email, password, and role are required");
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash, role, store_id) VALUES (?, ?, ?, ?, ?)",
    [name, email, password_hash, role, store_id]
  );

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user_id: result.insertId,
  });
});

// Admin Login
exports.adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const [users] = await pool.query(
    'SELECT id, name, email, password_hash, role, store_id, account_status FROM users WHERE email = ? AND role = "admin"',
    [email]
  );

  if (users.length === 0) {
    throw new ApiError(401, "Invalid credentials or not an admin");
  }

  const adminUser = users[0];

  const isPasswordValid = await bcrypt.compare(
    password,
    adminUser.password_hash
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { id: adminUser.id, role: adminUser.role, store_id: adminUser.store_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // Remove password_hash before sending response
  delete adminUser.password_hash;

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    token,
    user: adminUser,
  });
});

// Admin can get all users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const [users] = await pool.query(
    "SELECT id, name, email, role, store_id, account_status,subscription_id, subscription_status,subscription_start_date,subscription_end_date, created_at FROM users LIMIT ? OFFSET ?",
    [limit, offset]
  );

  const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM users");

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    limit,
    data: users,
  });
});

// Admin can get a user by ID
exports.getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const [user] = await pool.query(
    "SELECT id, name, email, role, store_id, account_status, created_at FROM users WHERE id = ?",
    [id]
  );

  if (user.length === 0) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    data: user[0],
  });
});

// Admin can update a user
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, role, store_id, account_status } = req.body;

  const [result] = await pool.query(
    "UPDATE users SET name = ?, email = ?, role = ?, store_id = ?, account_status = ? WHERE id = ?",
    [name, email, role, store_id, account_status, id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
});

// Admin can delete a user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
