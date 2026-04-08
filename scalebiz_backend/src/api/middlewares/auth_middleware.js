const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) {
      return next(
        new ApiError(401, "You are not logged in. Please log in to get access.")
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      decoded.id,
    ]);

    if (rows.length === 0) {
      return next(
        new ApiError(
          401,
          "The user belonging to this token does no longer exist."
        )
      );
    }

    // Grant access to protected route
    req.user = rows[0];
    req.store_id = rows[0].store_id;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid token. Please log in again."));
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "User not authenticated."));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You do not have permission to perform this action.")
      );
    }
    next();
  };
};

const protect_owner = async (req, res, next) => {
  const allowedRoles = ["owner", "manager", "moderator"];
  if (req.user && allowedRoles.includes(req.user.role)) {
    const [rows] = await pool.query("SELECT * FROM stores WHERE id = ?", [
      req.user.store_id,
    ]);

    if (rows.length === 0) {
      req.store = {};
    }

    req.store = rows[0];
    next();
  } else {
    next(
      new ApiError(403, "You do not have permission to perform this action.")
    );
  }
};

const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions) {
      return next(
        new ApiError(403, "You do not have permission to perform this action.")
      );
    }

    const permissions = JSON.parse(req.user.permissions);
    if (!permissions.includes(permission)) {
      return next(
        new ApiError(403, "You do not have permission to perform this action.")
      );
    }
    next();
  };
};

module.exports = { protect, protect_owner, authorize, hasPermission };
