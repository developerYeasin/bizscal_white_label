const User = require("../models/User");
const asyncHandler = require("../../utils/async_handler");
const ApiError = require("../../utils/api_error");

// Invite a new user
exports.inviteUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, role, permissions, password } = req.body;
    const store_id = req.user.store_id;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return next(new ApiError(400, "User with this email already exists"));
    }

    // For now, we'll just create the user directly.
    // In a real application, you would send an invitation email.
    const name = email.split("@")[0]; // or a default name
    // const password = Math.random().toString(36).slice(-8); // temporary password

    const userId = await User.create(
      store_id,
      name,
      email,
      password,
      role,
      permissions
    );

    res.status(201).json({
      success: true,
      message: "User invited successfully",
      data: { id: userId },
    });
  } catch (error) {
    next(error);
  }
});

// Get all users for the store
exports.getUsers = asyncHandler(async (req, res, next) => {
  try {
    const store_id = req.user.store_id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = await User.findByStoreId(store_id, page, limit);
    res.status(200).json({
      success: true,
      data: data.users,
      ...data.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// Get a single user by ID
exports.getUserById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const store_id = req.user.store_id;

    const user = await User.findById(id);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (user.store_id !== store_id) {
      return next(
        new ApiError(403, "You are not authorized to view this user")
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Update a user's role and permissions
exports.updateUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, permissions } = req.body;
    const store_id = req.user.store_id;

    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return next(new ApiError(404, "User not found"));
    }

    if (userToUpdate.store_id !== store_id) {
      return next(
        new ApiError(403, "You are not authorized to update this user")
      );
    }

    await User.update(id, { name, role, permissions });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Delete a user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const store_id = req.user.store_id;

    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      return next(new ApiError(404, "User not found"));
    }

    if (userToDelete.store_id !== store_id) {
      return next(
        new ApiError(403, "You are not authorized to delete this user")
      );
    }

    await User.delete(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
