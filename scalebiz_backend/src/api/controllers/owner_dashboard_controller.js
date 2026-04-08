const asyncHandler = require("../../utils/async_handler");
const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");

// @desc    Get dashboard data
// @route   GET /api/owner/dashboard
// @access  Private/Owner
exports.getDashboardData = asyncHandler(async (req, res, next) => {
  const storeId = req.user.store_id;
  const { filter = "last_month", startDate, endDate } = req.query;

  let startDateObj, endDateObj;
  const now = new Date();

  switch (filter) {
    case "today":
      startDateObj = new Date(now);
      startDateObj.setHours(0, 0, 0, 0);
      endDateObj = new Date(now);
      endDateObj.setHours(23, 59, 59, 999);
      break;
    case "this_week":
      startDateObj = new Date(now);
      const dayOfWeek = startDateObj.getDay();
      startDateObj.setDate(startDateObj.getDate() - dayOfWeek);
      startDateObj.setHours(0, 0, 0, 0);
      endDateObj = new Date(startDateObj);
      endDateObj.setDate(startDateObj.getDate() + 6);
      endDateObj.setHours(23, 59, 59, 999);
      break;
    case "this_month":
      startDateObj = new Date(now.getFullYear(), now.getMonth(), 1);
      endDateObj = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDateObj.setHours(23, 59, 59, 999);
      break;
    case "last_month":
      startDateObj = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDateObj = new Date(now.getFullYear(), now.getMonth(), 0);
      endDateObj.setHours(23, 59, 59, 999);
      break;
    case "this_year":
      startDateObj = new Date(now.getFullYear(), 0, 1);
      endDateObj = new Date(now.getFullYear(), 11, 31);
      endDateObj.setHours(23, 59, 59, 999);
      break;
    case "custom":
      if (!startDate || !endDate) {
        return next(
          new ApiError("Custom date range requires startDate and endDate.", 400)
        );
      }
      startDateObj = new Date(startDate);
      endDateObj = new Date(endDate);
      if (endDate.indexOf("T") === -1 && endDate.indexOf(" ") === -1) {
        endDateObj.setHours(23, 59, 59, 999);
      }
      break;
  }

  let dateFilterClause = "";
  let visitDateFilterClause = "";
  const queryParams = [storeId];
  const visitQueryParams = [storeId];

  if (startDateObj && endDateObj) {
    dateFilterClause = "AND o.created_at >= ? AND o.created_at <= ?";
    visitDateFilterClause = "AND visited_at >= ? AND visited_at <= ?";
    queryParams.push(startDateObj, endDateObj);
    visitQueryParams.push(startDateObj, endDateObj);
  }

  const salesTodayQuery = `SELECT SUM(total_amount) as total FROM orders o WHERE o.store_id = ? AND DATE(o.created_at) = CURDATE()`;
  const salesMonthlyQuery = `SELECT SUM(total_amount) as total FROM orders o WHERE o.store_id = ? AND YEAR(o.created_at) = YEAR(CURDATE()) AND MONTH(o.created_at) = MONTH(CURDATE())`;
  const salesReportQuery = `SELECT DATE(o.created_at) as date, SUM(o.total_amount) as total FROM orders o WHERE o.store_id = ? ${dateFilterClause} GROUP BY DATE(o.created_at) ORDER BY DATE(o.created_at)`;
  const lowStockProductsQuery = `SELECT id, name, stock_quantity FROM products WHERE store_id = ? AND stock_quantity < 10 AND status = 'published' AND track_inventory = TRUE ORDER BY stock_quantity ASC LIMIT 5`;
  const mostSoldItemsQuery = `SELECT p.id, p.name, SUM(oi.quantity) as total_sold FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE p.store_id = ? ${dateFilterClause} GROUP BY p.id, p.name ORDER BY total_sold DESC LIMIT 3`;

  const websiteVisitsQuery = `SELECT COUNT(id) as total_visits FROM visits WHERE store_id = ? ${visitDateFilterClause}`;

  const [
    [salesTodayResult],
    [salesMonthlyResult],
    [salesReport],
    [lowStockProducts],
    [mostSoldItems],
    [websiteVisitsResult],
  ] = await Promise.all([
    pool.query(salesTodayQuery, [storeId]),
    pool.query(salesMonthlyQuery, [storeId]),
    pool.query(salesReportQuery, queryParams),
    pool.query(lowStockProductsQuery, [storeId]),
    pool.query(mostSoldItemsQuery, queryParams),
    pool.query(websiteVisitsQuery, visitQueryParams),
  ]);

  console.log("websiteVisitsResult >> ", websiteVisitsResult);

  res.status(200).json({
    success: true,
    data: {
      salesToday: salesTodayResult[0].total || 0,
      salesMonthly: salesMonthlyResult[0].total || 0,
      websiteVisits: websiteVisitsResult[0].total_visits || 0,
      salesReport,
      lowStockProducts,
      mostSoldItems,
    },
  });
});