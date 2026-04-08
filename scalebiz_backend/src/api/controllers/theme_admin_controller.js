const pool = require('../../config/database');
const ApiError = require('../../utils/api_error');

class ThemeAdminController {
  // Get all themes with their blocks count
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = (page - 1) * limit;

      const [themes] = await pool.query(
        `SELECT * FROM themes ORDER BY id ASC LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM themes`);

      // Get block counts for each theme
      const themesWithCounts = await Promise.all(
        themes.map(async (theme) => {
          const [[{ count }]] = await pool.query(
            'SELECT COUNT(*) as count FROM theme_blocks WHERE theme_id = ?',
            [theme.id]
          );
          return {
            ...theme,
            block_count: count,
            // Parse JSON fields
            config: typeof theme.config === 'string' ? JSON.parse(theme.config) : theme.config,
            features: typeof theme.features === 'string' ? JSON.parse(theme.features) : theme.features,
          };
        })
      );

      res.status(200).json({
        success: true,
        count: themesWithCounts.length,
        total,
        page,
        limit,
        data: themesWithCounts,
      });
    } catch (error) {
      console.error('Error fetching themes:', error);
      next(error);
    }
  }

  // Get single theme with its blocks
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const [themeRows] = await pool.query(
        'SELECT * FROM themes WHERE id = ?',
        [id]
      );

      if (themeRows.length === 0) {
        return next(new ApiError(404, 'Theme not found'));
      }

      const theme = themeRows[0];
      // Parse JSON fields
      if (theme.config && typeof theme.config === 'string') {
        theme.config = JSON.parse(theme.config);
      }
      if (theme.features && typeof theme.features === 'string') {
        theme.features = JSON.parse(theme.features);
      }

      // Get blocks for this theme
      const [blocks] = await pool.query(
        'SELECT * FROM theme_blocks WHERE theme_id = ? ORDER BY sort_order ASC',
        [id]
      );

      const parsedBlocks = blocks.map(block => ({
        ...block,
        default_config: typeof block.default_config === 'string' ? JSON.parse(block.default_config) : block.default_config,
        config_schema: typeof block.config_schema === 'string' ? JSON.parse(block.config_schema) : block.config_schema,
      }));

      res.status(200).json({
        success: true,
        data: {
          ...theme,
          theme_blocks: parsedBlocks,
        },
      });
    } catch (error) {
      console.error('Error fetching theme:', error);
      next(error);
    }
  }

  // Create theme with blocks
  async create(req, res, next) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        name,
        description,
        version,
        status,
        access_level,
        category,
        features,
        preview_image_url,
        live_demo_url,
        config,
        blocks,
      } = req.body;

      // Validate required fields
      if (!name) {
        await connection.rollback();
        return next(new ApiError(400, 'Theme name is required'));
      }

      // Insert theme
      const [result] = await connection.query(
        `INSERT INTO themes
          (name, description, version, status, access_level, category, features, preview_image_url, live_demo_url, config)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          description || '',
          version || '1.0.0',
          status || 'draft',
          access_level || 'free',
          category || 'Modern',
          features ? JSON.stringify(features) : null,
          preview_image_url || null,
          live_demo_url || null,
          config ? JSON.stringify(config) : null,
        ]
      );

      const themeId = result.insertId;

      // Insert blocks if provided
      if (blocks && Array.isArray(blocks)) {
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          await connection.query(
            `INSERT INTO theme_blocks
              (theme_id, block_type, name, description, category, default_config, config_schema, sort_order, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              themeId,
              block.block_type,
              block.name || block.block_type,
              block.description || '',
              block.category || 'Components',
              block.default_config ? JSON.stringify(block.default_config) : null,
              block.config_schema ? JSON.stringify(block.config_schema) : null,
              block.sort_order ?? i,
            ]
          );
        }
      }

      await connection.commit();
      connection.release();

      // Fetch the created theme with blocks
      const [themeRows] = await pool.query('SELECT * FROM themes WHERE id = ?', [themeId]);
      const [blocksRows] = await pool.query('SELECT * FROM theme_blocks WHERE theme_id = ? ORDER BY sort_order ASC', [themeId]);

      res.status(201).json({
        success: true,
        message: 'Theme created successfully',
        data: {
          id: themeId,
          ...themeRows[0],
          theme_blocks: blocksRows,
        },
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error('Error creating theme:', error);
      next(error);
    }
  }

  // Update theme and its blocks
  async update(req, res, next) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const {
        name,
        description,
        version,
        status,
        access_level,
        category,
        features,
        preview_image_url,
        live_demo_url,
        config,
        blocks,
      } = req.body;

      // Check if theme exists
      const [existing] = await connection.query(
        'SELECT * FROM themes WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        await connection.rollback();
        return next(new ApiError(404, 'Theme not found'));
      }

      // Update theme
      await connection.query(
        `UPDATE themes SET
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          version = COALESCE(?, version),
          status = COALESCE(?, status),
          access_level = COALESCE(?, access_level),
          category = COALESCE(?, category),
          features = ?,
          preview_image_url = ?,
          live_demo_url = ?,
          config = ?,
          updated_at = NOW()
         WHERE id = ?`,
        [
          name,
          description,
          version,
          status,
          access_level,
          category,
          features ? JSON.stringify(features) : existing[0].features,
          preview_image_url !== undefined ? preview_image_url : existing[0].preview_image_url,
          live_demo_url !== undefined ? live_demo_url : existing[0].live_demo_url,
          config ? JSON.stringify(config) : existing[0].config,
          id,
        ]
      );

      // If blocks are provided, replace all blocks for this theme
      if (blocks && Array.isArray(blocks)) {
        // Delete existing blocks
        await connection.query(
          'DELETE FROM theme_blocks WHERE theme_id = ?',
          [id]
        );

        // Insert new blocks
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          await connection.query(
            `INSERT INTO theme_blocks
              (theme_id, block_type, name, description, category, default_config, config_schema, sort_order, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              id,
              block.block_type,
              block.name || block.block_type,
              block.description || '',
              block.category || 'Components',
              block.default_config ? JSON.stringify(block.default_config) : null,
              block.config_schema ? JSON.stringify(block.config_schema) : null,
              block.sort_order ?? i,
            ]
          );
        }
      }

      await connection.commit();

      // Fetch updated theme with blocks
      const [themeRows] = await pool.query('SELECT * FROM themes WHERE id = ?', [id]);
      const [blocksRows] = await pool.query('SELECT * FROM theme_blocks WHERE theme_id = ? ORDER BY sort_order ASC', [id]);

      res.status(200).json({
        success: true,
        message: 'Theme updated successfully',
        data: {
          ...themeRows[0],
          theme_blocks: blocksRows,
        },
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error('Error updating theme:', error);
      next(error);
    }
  }

  // Delete theme
  async delete(req, res, next) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const { id } = req.params;

      // Check if theme exists
      const [existing] = await connection.query(
        'SELECT * FROM themes WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        await connection.rollback();
        return next(new ApiError(404, 'Theme not found'));
      }

      // Delete theme (cascade will delete theme_blocks)
      await connection.query(
        'DELETE FROM themes WHERE id = ?',
        [id]
      );

      await connection.commit();
      connection.release();

      res.status(200).json({
        success: true,
        message: 'Theme deleted successfully',
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error('Error deleting theme:', error);
      next(error);
    }
  }
}

module.exports = new ThemeAdminController();
