const pool = require('../../config/database');
const ApiError = require('../../utils/api_error');

// GET /api/v1/pages/:page_slug
exports.get_page_by_slug = async (req, res, next) => {
  try {
    const { page_slug } = req.params;
    const [rows] = await pool.query(
        'SELECT title, slug, content, meta_title, meta_description FROM pages WHERE store_id = ? AND slug = ?',
        [req.store_id, page_slug]
    );

    if (rows.length === 0) {
        return next(new ApiError(404, `Page with slug '${page_slug}' not found for this store.`));
    }

    res.status(200).json({
        status: 'success',
        data: {
            page: rows[0],
        },
    });
  } catch (error) {
    next(new ApiError(500, 'Error fetching page content.'));
  }
};
// GET /api/v1/pages
exports.get_all_pages = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT title, slug, content, meta_title, meta_description FROM pages WHERE store_id = ?',
      [req.store_id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        pages: rows,
      },
    });
  } catch (error) {
    next(new ApiError(500, 'Error fetching pages.'));
  }
};

// POST /api/v1/pages
exports.create_page = async (req, res, next) => {
  try {
    const { title, slug, content } = req.body;
    const [result] = await pool.query(
      'INSERT INTO pages (store_id, title, slug, content) VALUES (?, ?, ?, ?)',
      [req.store_id, title, slug, content]
    );

    res.status(201).json({
      status: 'success',
      data: {
        page: {
          id: result.insertId,
          title,
          slug,
          content,
        },
      },
    });
  } catch (error) {
    next(new ApiError(500, 'Error creating page.'));
  }
};

// PUT /api/v1/pages/:page_slug
exports.update_page = async (req, res, next) => {
  try {
    const { page_slug } = req.params;
    const { title, slug, content } = req.body;

    const [result] = await pool.query(
      'UPDATE pages SET title = ?, slug = ?, content = ? WHERE store_id = ? AND slug = ?',
      [title, slug, content, req.store_id, page_slug]
    );

    if (result.affectedRows === 0) {
      return next(new ApiError(404, `Page with slug '${page_slug}' not found for this store.`));
    }

    res.status(200).json({
      status: 'success',
      message: 'Page updated successfully.',
    });
  } catch (error) {
    next(new ApiError(500, 'Error updating page.'));
  }
};

// DELETE /api/v1/pages/:page_slug
exports.delete_page = async (req, res, next) => {
  try {
    const { page_slug } = req.params;
    const [result] = await pool.query(
      'DELETE FROM pages WHERE store_id = ? AND slug = ?',
      [req.store_id, page_slug]
    );

    if (result.affectedRows === 0) {
      return next(new ApiError(404, `Page with slug '${page_slug}' not found for this store.`));
    }

    res.status(204).send();
  } catch (error) {
    next(new ApiError(500, 'Error deleting page.'));
  }
};