const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");

const sign_token = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// POST /api/v1/auth/register
exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      email,
      password,
      phone_number,
      avatar_url,
      preferred_language,
      timezone,
    } = req.body;
    const password_hash = await bcrypt.hash(password, 12);

    const [newUser] = await pool.query(
      "INSERT INTO users (store_id, name, email, password_hash, phone_number, avatar_url, preferred_language, timezone, email_verified_at, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)",
      [
        req.store_id,
        name,
        email,
        password_hash,
        phone_number,
        avatar_url,
        preferred_language,
        timezone,
        "user",
      ]
    );

    const token = sign_token(newUser.insertId);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: newUser.insertId,
          name,
          email,
          phone_number,
          avatar_url,
          preferred_language,
          timezone,
        },
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return next(new ApiError(400, "Email already exists for this store."));
    }
    next(new ApiError(500, "Could not register user."));
  }
};

// POST /api/v1/auth/owner/register
exports.owner_register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      email,
      password,
      phone_number,
      avatar_url,
      preferred_language,
      timezone,
    } = req.body;

    const [user] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    const [phone_user] = await pool.query(
      "SELECT id FROM users WHERE phone_number = ?",
      [phone_number]
    );
    if (user.length > 0 || phone_user.length > 0) {
      return next(new ApiError(400, "Email already exists."));
    }

    const password_hash = await bcrypt.hash(password, 12);

    const [newUser] = await pool.query(
      "INSERT INTO users (store_id, name, email, password_hash, phone_number, avatar_url, preferred_language, timezone, email_verified_at, role) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)",
      [
        name,
        email,
        password_hash,
        phone_number,
        avatar_url,
        preferred_language,
        timezone,
        "owner",
      ]
    );

    const token = sign_token(newUser.insertId);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: newUser.insertId,
          name,
          email,
          phone_number,
          avatar_url,
          preferred_language,
          timezone,
          role: "owner",
        },
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return next(new ApiError(400, "Email already exists."));
    }
    console.error("Owner registration error:", error); // Log the error
    next(new ApiError(500, "Could not register owner."));
  }
};

// POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      "SELECT id, store_id, password_hash FROM users WHERE email = ? AND store_id = ?",
      [email, req.store_id]
    );
    console.log("User found:", rows);
    if (rows.length === 0) {
      console.log("Login failed: User not found for email:", email);
      return next(new ApiError(401, "Incorrect email or password."));
    }

    const password_matches = await bcrypt.compare(
      password,
      rows[0].password_hash
    );
    console.log("Password match result:", password_matches);

    if (!password_matches) {
      console.log("Login failed: Password does not match for user:", email);
      return next(new ApiError(401, "Incorrect email or password."));
    }

    const token = sign_token(rows[0].id);
    const last_login_ip = req.ip;
    await pool.query(
      "UPDATE users SET last_login_at = CURRENT_TIMESTAMP, last_login_ip = ? WHERE id = ?",
      [last_login_ip, rows[0].id]
    );
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: rows[0].id,
          store_id: rows[0].store_id,
        },
      },
    });
  } catch (error) {
    next(new ApiError(500, "Login failed."));
  }
};

// POST /api/v1/auth/owner/login
exports.owner_login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      "SELECT id, store_id, password_hash, role, email FROM users WHERE email = ? AND role IN (?)",
      [email, ["owner", "manager", "moderator"]]
    );

    if (rows.length === 0) {
      return next(new ApiError(401, "Incorrect email or password."));
    }

    const password_matches = await bcrypt.compare(
      password,
      rows[0].password_hash
    );

    if (!password_matches) {
      return next(new ApiError(401, "Incorrect email or password."));
    }

    const token = sign_token(rows[0].id);
    const last_login_ip = req.ip;
    await pool.query(
      "UPDATE users SET last_login_at = CURRENT_TIMESTAMP, last_login_ip = ? WHERE id = ?",
      [last_login_ip, rows[0].id]
    );
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: rows[0].id,
          email: rows[0].email,
          role: rows[0].role,
          store_id: rows[0].store_id,
        },
      },
    });
  } catch (error) {
    console.error("Owner login error:", error);
    next(new ApiError(500, "Login failed."));
  }
};

// GET /api/v1/auth/me
exports.get_me = async (req, res, next) => {
  // The `protect` middleware already attached the user to `req.user`
  const { password_hash, ...user_data } = req.user;
  res.status(200).json({
    status: "success",
    data: {
      user: user_data,
    },
  });
};

// GET /api/v1/auth/owner/me
exports.owner_get_me = async (req, res, next) => {
  const allowedRoles = ["owner", "manager", "moderator"];
  if (!allowedRoles.includes(req.user.role)) {
    return next(
      new ApiError(
        403,
        "Access denied. You do not have permission to access this resource."
      )
    );
  }
  const { password_hash, ...owner_data } = req.user;
  res.status(200).json({
    status: "success",
    data: {
      owner: owner_data,
    },
  });
};

// POST /api/v1/auth/logout
exports.logout = (req, res) => {
  // On the client, you should destroy the token.
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully." });
};

// POST /api/v1/auth/owner/logout
exports.owner_logout = (req, res) => {
  // On the client, you should destroy the token.
  res
    .status(200)
    .json({ status: "success", message: "Owner logged out successfully." });
};
// GET /api/v1/users
exports.get_all_users = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE store_id = ?",
      [req.store_id]
    );
    res.status(200).json({ status: "success", data: { users } });
  } catch (error) {
    next(new ApiError(500, "Failed to retrieve users."));
  }
};

// GET /api/v1/users/:user_id
exports.get_user_by_id = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const [rows] = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ? AND store_id = ?",
      [user_id, req.store_id]
    );
    if (rows.length === 0) {
      return next(new ApiError(404, "User not found."));
    }
    res.status(200).json({ status: "success", data: { user: rows[0] } });
  } catch (error) {
    next(new ApiError(500, "Failed to retrieve user."));
  }
};

// PUT /api/v1/users/:user_id
exports.update_user = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { name, email } = req.body;

    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ? AND store_id = ?",
      [name, email, user_id, req.store_id]
    );

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "User not found."));
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully.",
    });
  } catch (error) {
    next(new ApiError(500, "Error updating user."));
  }
};

// PUT /api/v1/auth/me
exports.update_me = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      email,
      phone_number,
      avatar_url,
      preferred_language,
      timezone,
    } = req.body;
    const user_id = req.user.id;

    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }
    if (email) {
      fields.push("email = ?");
      values.push(email);
    }
    if (phone_number) {
      fields.push("phone_number = ?");
      values.push(phone_number);
    }
    if (avatar_url) {
      fields.push("avatar_url = ?");
      values.push(avatar_url);
    }
    if (preferred_language) {
      fields.push("preferred_language = ?");
      values.push(preferred_language);
    }
    if (timezone) {
      fields.push("timezone = ?");
      values.push(timezone);
    }

    if (fields.length === 0) {
      return next(new ApiError(400, "No fields provided for update."));
    }

    const query = `UPDATE users SET ${fields.join(
      ", "
    )} WHERE id = ? AND store_id = ?`;
    values.push(user_id, req.store_id);

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "User not found or no changes made."));
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully.",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return next(new ApiError(400, "Email already exists for this store."));
    }
    next(new ApiError(500, "Error updating profile."));
  }
};

// PUT /api/v1/auth/owner/me
exports.owner_update_me = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      email,
      phone_number,
      avatar_url,
      preferred_language,
      timezone,
    } = req.body;
    const owner_id = req.user.id;

    const allowedRoles = ["owner", "manager", "moderator"];
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "Access denied. You do not have permission to update this profile."
        )
      );
    }

    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }
    if (email) {
      fields.push("email = ?");
      values.push(email);
    }
    if (phone_number) {
      fields.push("phone_number = ?");
      values.push(phone_number);
    }
    if (avatar_url) {
      fields.push("avatar_url = ?");
      values.push(avatar_url);
    }
    if (preferred_language) {
      fields.push("preferred_language = ?");
      values.push(preferred_language);
    }
    if (timezone) {
      fields.push("timezone = ?");
      values.push(timezone);
    }

    if (fields.length === 0) {
      return next(new ApiError(400, "No fields provided for update."));
    }

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(owner_id);

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "Owner not found or no changes made."));
    }

    res.status(200).json({
      status: "success",
      message: "Owner profile updated successfully.",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return next(new ApiError(400, "Email already exists."));
    }
    console.error("Owner profile update error:", error);
    next(new ApiError(500, "Error updating owner profile."));
  }
};

// PATCH /api/v1/auth/update-password
exports.update_password = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { current_password, new_password } = req.body;
    const user_id = req.user.id;

    const [rows] = await pool.query(
      "SELECT password_hash FROM users WHERE id = ? AND store_id = ?",
      [user_id, req.store_id]
    );

    if (rows.length === 0) {
      return next(new ApiError(404, "User not found."));
    }

    const password_matches = await bcrypt.compare(
      current_password,
      rows[0].password_hash
    );

    if (!password_matches) {
      return next(new ApiError(401, "Current password is incorrect."));
    }

    const new_password_hash = await bcrypt.hash(new_password, 12);

    await pool.query(
      "UPDATE users SET password_hash = ? WHERE id = ? AND store_id = ?",
      [new_password_hash, user_id, req.store_id]
    );

    res.status(200).json({
      status: "success",
      message: "Password updated successfully.",
    });
  } catch (error) {
    next(new ApiError(500, "Error updating password."));
  }
};

// PATCH /api/v1/auth/owner/update-password
exports.owner_update_password = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { current_password, new_password } = req.body;
    const owner_id = req.user.id;

    const allowedRoles = ["owner", "manager", "moderator"];
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "Access denied. You do not have permission to update the password."
        )
      );
    }

    const [rows] = await pool.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [owner_id]
    );

    if (rows.length === 0) {
      return next(new ApiError(404, "Owner not found."));
    }

    const password_matches = await bcrypt.compare(
      current_password,
      rows[0].password_hash
    );

    if (!password_matches) {
      return next(new ApiError(401, "Current password is incorrect."));
    }

    const new_password_hash = await bcrypt.hash(new_password, 12);

    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [
      new_password_hash,
      owner_id,
    ]);

    res.status(200).json({
      status: "success",
      message: "Owner password updated successfully.",
    });
  } catch (error) {
    console.error("Owner password update error:", error);
    next(new ApiError(500, "Error updating owner password."));
  }
};

// DELETE /api/v1/users/:user_id
exports.delete_user = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM users WHERE id = ? AND store_id = ?",
      [user_id, req.store_id]
    );

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "User not found."));
    }

    res.status(204).send();
  } catch (error) {
    next(new ApiError(500, "Error deleting user."));
  }
};

// POST /api/v1/auth/reset-password
exports.resetPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1. Find the user by email
    const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return next(new ApiError(404, "User not found."));
    }
    const user = users[0];

    // 2. Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Hash the code before saving it to the DB
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    await pool.query(
      "UPDATE users SET password_reset_token = ?, password_reset_expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE id = ?",
      [hashedResetCode, user.id]
    );

    // 4. Send email to user with the code
    const message = `Your password reset code is: ${resetCode}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`;

    try {
      await sendEmail({
        to: email,
        subject: 'Your Password Reset Code',
        text: message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Password reset code sent to your email.',
      });
    } catch (err) {
      await pool.query(
        "UPDATE users SET password_reset_token = NULL, password_reset_expires_at = NULL WHERE id = ?",
        [user.id]
      );
      return next(
        new ApiError(500, 'There was an error sending the email. Try again later!')
      );
    }
  } catch (error) {
    console.log("error", error);
    next(new ApiError(500, "Error requesting password reset."));
  }
};

// POST /api/v1/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;

    // 1. Hash the incoming code
    const hashedCode = crypto
      .createHash("sha256")
      .update(String(code))
      .digest("hex");

    // 2. Find user by email and hashed code, and check if the code is not expired
    const [users] = await pool.query(
      "SELECT id FROM users WHERE email = ? AND password_reset_token = ? AND password_reset_expires_at > NOW()",
      [email, hashedCode]
    );

    if (users.length === 0) {
      return next(new ApiError(400, "Invalid or expired reset code."));
    }

    const user = users[0];

    // 3. Hash the new password
    const password_hash = await bcrypt.hash(password, 12);

    // 4. Update user password and clear reset token fields
    await pool.query(
      "UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires_at = NULL WHERE id = ?",
      [password_hash, user.id]
    );

    res
      .status(200)
      .json({ status: "success", message: "Password reset successfully." });
  } catch (error) {
    console.log("error", error);
    next(new ApiError(500, "Error resetting password."));
  }
};

// POST /api/v1/auth/test-email
exports.sendTestEmail = async (req, res, next) => {
  try {
    await sendEmail({
      to: 'swiftsolutiondigitalhub@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email from Nodemailer.',
      html: '<h1>Test Email</h1><p>This is a test email from Nodemailer.</p>',
    });

    res.status(200).json({
      status: 'success',
      message: 'Test email sent successfully.',
    });
  } catch (error) {
    next(new ApiError(500, 'Error sending test email.'));
  }
};
