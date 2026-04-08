const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");

// Helper function to generate a slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
};

// POST /api/v1/categories
exports.create_category = async (req, res, next) => {
  try {
    const {
      name,
      description,
      parent_id,
      image_url,
      is_active,
      is_featured,
      sort_order,
    } = req.body;
    const slug = generateSlug(name);

    const [result] = await pool.query(
      "INSERT INTO categories (store_id, name, slug, description, parent_id, image_url, is_active, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.store_id,
        name,
        slug,
        description,
        parent_id || null,
        image_url || null,
        is_active,
        is_featured,
        sort_order,
      ]
    );

    res.status(201).json({
      status: "success",
      data: {
        category: {
          id: result.insertId,
          name,
          slug,
          description,
          parent_id,
          image_url,
          is_active,
          is_featured,
          sort_order,
        },
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return next(new ApiError(409, "Category with this slug already exists."));
    }
    next(new ApiError(500, "Error creating category."));
  }
};

// GET /api/v1/categories
// Helper function to build a hierarchical category tree
const buildCategoryTree = (categories, parentId = null) => {
  const nestedCategories = [];
  categories
    .filter((category) => category.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
    .forEach((category) => {
      const children = buildCategoryTree(categories, category.id);
      if (children.length > 0) {
        category.sub_categories = children;
      }
      nestedCategories.push(category);
    });
  return nestedCategories;
};

// GET /api/v1/categories
exports.get_all_categories_pagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9999;
    const offset = (page - 1) * limit;

    const [allCategories] = await pool.query(
      "SELECT * FROM categories WHERE store_id = ? AND deleted_at IS NULL ORDER BY sort_order ASC, name ASC LIMIT ? OFFSET ?",
      [req.store_id, limit, offset]
    );

    const [totalCategories] = await pool.query(
      "SELECT COUNT(*) AS total FROM categories WHERE store_id = ? AND deleted_at IS NULL",
      [req.store_id]
    );

    const total = totalCategories[0].total;
    const pages = Math.ceil(total / limit);

    const nestedCategories = allCategories;

    res.status(200).json({
      status: "success",
      results: nestedCategories.length,
      total,
      pages,
      page,
      limit,
      data: { categories: nestedCategories },
    });
  } catch (error) {
    next(new ApiError(500, "Error fetching categories."));
  }
};

// GET /api/v1/owner/categories/all
exports.get_all_categories = async (req, res, next) => {
  try {
    const [allCategories] = await pool.query(
      "SELECT * FROM categories WHERE store_id = ? AND deleted_at IS NULL ORDER BY sort_order ASC, name ASC",
      [req.store_id]
    );

    const nestedCategories = allCategories;

    res.status(200).json({
      status: "success",
      results: nestedCategories.length,
      data: { categories: nestedCategories },
    });
  } catch (error) {
    next(new ApiError(500, "Error fetching categories."));
  }
};
exports.get_categories = async (req, res, next) => {
  try {
    const [allCategories] = await pool.query(
      "SELECT * FROM categories WHERE store_id = ? AND deleted_at IS NULL ORDER BY sort_order ASC, name ASC",
      [req.store_id]
    );

    const nestedCategories = buildCategoryTree(allCategories);

    res.status(200).json({
      status: "success",
      results: nestedCategories.length,
      data: { categories: nestedCategories },
    });
  } catch (error) {
    next(new ApiError(500, "Error fetching categories."));
  }
};

// GET /api/v1/categories/:category_id
exports.get_category_by_id = async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM categories WHERE id = ? AND store_id = ? AND deleted_at IS NULL",
      [category_id, req.store_id]
    );

    if (rows.length === 0) {
      return next(new ApiError(404, "Category not found."));
    }

    res.status(200).json({
      status: "success",
      data: { category: rows[0] },
    });
  } catch (error) {
    next(new ApiError(500, "Error fetching category details."));
  }
};

// PUT /api/v1/categories/:category_id
exports.update_category = async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const {
      name,
      description,
      parent_id,
      image_url,
      is_active,
      is_featured,
      sort_order,
    } = req.body;
    const slug = name ? generateSlug(name) : undefined; // Only generate slug if name is provided

    let updateFields = [];
    const params = [];

    if (name !== undefined) {
      updateFields.push("name = ?");
      params.push(name);
    }
    if (slug !== undefined) {
      updateFields.push("slug = ?");
      params.push(slug);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      params.push(description);
    }
    if (parent_id !== undefined) {
      updateFields.push("parent_id = ?");
      params.push(parent_id || null);
    }
    if (image_url !== undefined) {
      updateFields.push("image_url = ?");
      params.push(image_url || null);
    }
    if (is_active !== undefined) {
      updateFields.push("is_active = ?");
      params.push(is_active);
    }
    if (is_featured !== undefined) {
      updateFields.push("is_featured = ?");
      params.push(is_featured);
    }
    if (sort_order !== undefined) {
      updateFields.push("sort_order = ?");
      params.push(sort_order);
    }

    if (updateFields.length === 0) {
      return next(new ApiError(400, "No fields to update."));
    }

    params.push(category_id, req.store_id);

    const [result] = await pool.query(
      `UPDATE categories SET ${updateFields.join(
        ", "
      )}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND store_id = ? AND deleted_at IS NULL`,
      params
    );

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "Category not found or no changes made."));
    }

    res.status(200).json({
      status: "success",
      message: "Category updated successfully.",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return next(new ApiError(409, "Category with this slug already exists."));
    }
    next(new ApiError(500, "Error updating category."));
  }
};

// DELETE /api/v1/categories/:category_id (Soft Delete)
exports.delete_category = async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const [result] = await pool.query(
      "UPDATE categories SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND store_id = ? AND deleted_at IS NULL",
      [category_id, req.store_id]
    );

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "Category not found or already deleted."));
    }

    res.status(204).send();
  } catch (error) {
    next(new ApiError(500, "Error deleting category."));
  }
};

// @desc    Duplicate a category as a draft for the authenticated owner's store
// @route   POST /api/v1/owner/categories/:category_id/duplicate
// @access  Private (Owner)
exports.duplicate_category_as_draft = async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const store_id = req.store_id;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Fetch the original category
      const [originalCategories] = await connection.query(
        "SELECT * FROM categories WHERE id = ? AND store_id = ? AND deleted_at IS NULL",
        [category_id, store_id]
      );

      if (originalCategories.length === 0) {
        await connection.rollback();
        return next(
          new ApiError(
            404,
            "Category not found or does not belong to your store."
          )
        );
      }

      const originalCategory = originalCategories[0];

      // Create a new category object with 'draft' status and modified fields
      const newCategory = { ...originalCategory
      };
      delete newCategory.id; // Remove original ID
      newCategory.is_active = 0; // Set status to draft (assuming 0 means draft/inactive)
      newCategory.created_at = new Date(); // Update timestamps
      newCategory.updated_at = new Date();
      newCategory.name = `${originalCategory.name} (Draft)`; // Append (Draft) to name
      newCategory.slug = `${originalCategory.slug}-draft-${Date.now()}`; // Generate a new unique slug
      newCategory.store_id = store_id; // Ensure the new category is linked to the owner's store

      // Insert the new category
      const columns = Object.keys(newCategory).join(", ");
      const placeholders = Object.keys(newCategory).map(() => "?").join(", ");
      const values = Object.values(newCategory);

      const [result] = await connection.query(
        `INSERT INTO categories (${columns}) VALUES (${placeholders})`,
        values
      );
      const newCategoryId = result.insertId;

      await connection.commit();
      res.status(201).json({
        status: "success",
        message: "Category duplicated as draft successfully.",
        data: {
          category: {
            id: newCategoryId,
            ...newCategory,
          },
        },
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error duplicating category:", error);
      next(new ApiError(500, "Error duplicating category."));
    } finally {
      connection.release();
    }
  } catch (error) {
    next(new ApiError(500, "Error duplicating category."));
  }
};
