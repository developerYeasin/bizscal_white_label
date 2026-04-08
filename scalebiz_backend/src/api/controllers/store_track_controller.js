const asyncHandler = require("../../utils/async_handler");
const pool = require("../../config/database");

exports.trackVisit = asyncHandler(async (req, res) => {
  const { store_id } = req;
  const { path, referrer, screenWidth } = req.body;

  if (!store_id) {
    return res.status(400).json({ message: "Store ID is required" });
  }

  const query = `
        INSERT INTO visits (store_id, path, referrer, screenWidth)
        VALUES (?, ?, ?, ?)
    `;
  await pool.query(query, [store_id, path, referrer, screenWidth]);

  res.status(201).json({ message: "Visit tracked successfully" });
});
