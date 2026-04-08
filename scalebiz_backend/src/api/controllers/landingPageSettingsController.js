const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");

// GET /api/v1/owner/landing-page-settings
exports.get_landing_page_settings = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM store_landing_page_settings WHERE store_id = ?",
      [req.store_id]
    );
    const settings = rows.length > 0 ? rows[0] : null;
    res.status(200).json({ status: "success", data: { settings } });
  } catch (error) {
    next(new ApiError(500, "Failed to retrieve landing page settings."));
  }
};

// PUT /api/v1/owner/landing-page-settings
exports.update_landing_page_settings = async (req, res, next) => {
  const {
    landing_page_template_id, general_primary_color, general_secondary_color, show_product_details, seo_page_title,
    seo_page_description, scrolling_banner_text, top_banner_image_url, featured_section_images, featured_video_title,
    featured_video_url, showcased_banner_images, static_banner_image_url, product_images_section_title, product_images_section_images
  } = req.body;
  try {
    const query = `
      UPDATE store_landing_page_settings SET
        landing_page_template_id = ?, general_primary_color = ?, general_secondary_color = ?, show_product_details = ?,
        seo_page_title = ?, seo_page_description = ?, scrolling_banner_text = ?, top_banner_image_url = ?,
        featured_section_images = ?, featured_video_title = ?, featured_video_url = ?, showcased_banner_images = ?,
        static_banner_image_url = ?, product_images_section_title = ?, product_images_section_images = ?
      WHERE store_id = ?
    `;
    await pool.query(query, [
      landing_page_template_id, general_primary_color, general_secondary_color, show_product_details, seo_page_title,
      seo_page_description, scrolling_banner_text, top_banner_image_url, JSON.stringify(featured_section_images), featured_video_title,
      featured_video_url, JSON.stringify(showcased_banner_images), static_banner_image_url, product_images_section_title, JSON.stringify(product_images_section_images),
      req.store_id
    ]);

    const [updatedRows] = await pool.query("SELECT * FROM store_landing_page_settings WHERE store_id = ?", [req.store_id]);
    res.status(200).json({
      status: "success",
      message: "Landing page settings updated successfully.",
      data: { settings: updatedRows[0] },
    });
  } catch (error) {
    console.error(error);
    next(new ApiError(500, "Failed to update landing page settings."));
  }
};