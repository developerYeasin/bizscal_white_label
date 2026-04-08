const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");

// GET /api/v1/themes
exports.get_all_themes = async (req, res, next) => {
  try {
    // Only show published themes to the clients
    const [themes] = await pool.query("SELECT * FROM themes WHERE status = 'published' ORDER BY name ASC");
    res.status(200).json({ status: "success", data: { themes } });
  } catch (error) {
    next(new ApiError(500, "Failed to retrieve themes."));
  }
};

// GET /api/v1/owner/themes
exports.get_all_themes_for_owner = async (req, res, next) => {
  try {
    const [themes] = await pool.query("SELECT * FROM themes ORDER BY id ASC");
    res.status(200).json({ status: "success", data: { themes } });
  } catch (error) {
    next(new ApiError(500, "Failed to retrieve themes for owner."));
  }
};

// GET /api/v1/landing-page-templates
exports.get_all_landing_page_templates = async (req, res, next) => {
  try {
    // Only show published templates to the clients
    const [templates] = await pool.query("SELECT * FROM landing_page_templates WHERE status = 'published' ORDER BY name ASC");
    res.status(200).json({ status: "success", data: { templates } });
  } catch (error) {
    next(new ApiError(500, "Failed to retrieve landing page templates."));
  }
};

// GET /api/v1/owner/landing-page-templates
exports.get_all_landing_page_templates_for_owner = async (req, res, next) => {
  try {
    const [templates] = await pool.query("SELECT * FROM landing_page_templates ORDER BY name ASC");
    res.status(200).json({ status: "success", data: { templates } });
  } catch (error) {
    next(new ApiError(500, "Failed to retrieve landing page templates for owner."));
  }
};

// GET /api/v1/owner/landing-page-templates/:id
exports.get_landing_page_template_by_id_for_owner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM landing_page_templates WHERE id = ?", [id]);
    if (rows.length === 0) {
      return next(new ApiError(404, "Landing page template not found"));
    }
    res.status(200).json({ status: "success", data: { template: rows[0] }});
  } catch (error) {
    next(new ApiError(500, "Failed to retrieve landing page template"));
  }
};