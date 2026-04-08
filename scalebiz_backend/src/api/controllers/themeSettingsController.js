const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");

// GET /api/v1/owner/theme-settings
exports.get_theme_settings = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM store_theme_settings WHERE store_id = ?",
      [req.store_id]
    );
    const settings = rows.length > 0 ? rows[0] : null;
    res.status(200).json({ status: "success", data: { settings } });
  } catch (error) {
    next(new ApiError(500, "Failed to retrieve theme settings."));
  }
};

// PUT /api/v1/owner/theme-settings
exports.update_theme_settings = async (req, res, next) => {
  const { theme_id, primary_color, secondary_color, theme_mode, buy_now_button_enabled } = req.body;
  try {
    const query = `
      UPDATE store_theme_settings
      SET
        theme_id = ?,
        primary_color = ?,
        secondary_color = ?,
        theme_mode = ?,
        buy_now_button_enabled = ?
      WHERE store_id = ?
    `;
    await pool.query(query, [theme_id, primary_color, secondary_color, theme_mode, buy_now_button_enabled, req.store_id]);
    
    const [updatedRows] = await pool.query("SELECT * FROM store_theme_settings WHERE store_id = ?", [req.store_id]);
    res.status(200).json({
      status: "success",
      message: "Theme settings updated successfully.",
      data: { settings: updatedRows[0] },
    });
  } catch (error) {
    console.log("error >> ", error);
    next(new ApiError(500, "Failed to update theme settings."));
  }
};