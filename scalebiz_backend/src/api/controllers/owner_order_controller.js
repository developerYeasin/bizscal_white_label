const pool = require("../../config/database");
const asyncHandler = require("../../utils/async_handler");
const ApiError = require("../../utils/api_error");

// @desc    Get Order Report
// @route   GET /api/owner/orders/report
// @access  Private (Owner)
const getOrderReport = asyncHandler(async (req, res, next) => {
    const { filter, startDate, endDate } = req.query;
    const storeId = req.user.store_id;

    if (!storeId) {
        return res.status(403).json({ message: 'User is not associated with a store.' });
    }

    let startDateObj, endDateObj;

    if (filter) {
        const now = new Date();
        
        switch (filter) {
            case 'today':
                startDateObj = new Date(now);
                startDateObj.setHours(0, 0, 0, 0);
                endDateObj = new Date(now);
                endDateObj.setHours(23, 59, 59, 999);
                break;
            case 'this_week':
                startDateObj = new Date(now);
                const dayOfWeek = startDateObj.getDay();
                startDateObj.setDate(startDateObj.getDate() - dayOfWeek);
                startDateObj.setHours(0, 0, 0, 0);
                
                endDateObj = new Date(startDateObj);
                endDateObj.setDate(startDateObj.getDate() + 6);
                endDateObj.setHours(23, 59, 59, 999);
                break;
            case 'this_month':
                startDateObj = new Date(now.getFullYear(), now.getMonth(), 1);
                endDateObj = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDateObj.setHours(23, 59, 59, 999);
                break;
            case 'last_month':
                startDateObj = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDateObj = new Date(now.getFullYear(), now.getMonth(), 0);
                endDateObj.setHours(23, 59, 59, 999);
                break;
            case 'year':
                startDateObj = new Date(now.getFullYear(), 0, 1);
                endDateObj = new Date(now.getFullYear(), 11, 31);
                endDateObj.setHours(23, 59, 59, 999);
                break;
            case 'custom':
                if (!startDate || !endDate) {
                    return next(new ApiError('Custom date range requires startDate and endDate.', 400));
                }
                startDateObj = new Date(startDate);
                endDateObj = new Date(endDate);
                // If endDate is just a date (no time), set to end of day to be inclusive
                if (endDate.indexOf('T') === -1 && endDate.indexOf(' ') === -1) {
                    endDateObj.setHours(23, 59, 59, 999);
                }
                break;
        }
    }

    let dateFilterClause = '';
    const queryParams = [];
    if (startDateObj && endDateObj) {
        const formatDate = (date) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = (`0${d.getMonth() + 1}`).slice(-2);
            const day = (`0${d.getDate()}`).slice(-2);
            const hours = (`0${d.getHours()}`).slice(-2);
            const minutes = (`0${d.getMinutes()}`).slice(-2);
            const seconds = (`0${d.getSeconds()}`).slice(-2);
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        dateFilterClause = 'AND o.created_at >= ? AND o.created_at <= ?';
        queryParams.push(formatDate(startDateObj), formatDate(endDateObj));
    }

    const reportSql = `
        SELECT
            COALESCE(SUM(CASE WHEN o.status != 'incomplete' THEN o.total_amount ELSE 0 END), 0) AS totalAmount,
            COUNT(DISTINCT CASE WHEN o.status != 'incomplete' THEN o.id ELSE NULL END) AS totalOrders,
            COALESCE(SUM(CASE WHEN o.status != 'incomplete' THEN oi.quantity ELSE 0 END), 0) AS totalItemSales,
            COUNT(DISTINCT CASE WHEN o.status != 'incomplete' THEN o.user_id ELSE NULL END) AS totalCustomerServed,
            COUNT(DISTINCT CASE WHEN o.status = 'incomplete' THEN o.id ELSE NULL END) AS totalIncompleteOrders
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.store_id = ? ${dateFilterClause};
    `;

    const ordersSql = `
        SELECT
            o.id,
            o.total_amount,
            o.status,
            o.created_at,
            o.is_fraud,
            (SELECT SUM(quantity) FROM order_items WHERE order_id = o.id) as items
        FROM orders o
        WHERE o.store_id = ? ${dateFilterClause}
        ORDER BY o.created_at DESC;
    `;

    const [reportResult] = await pool.query(reportSql, [storeId, ...queryParams]);
    const [ordersResult] = await pool.query(ordersSql, [storeId, ...queryParams]);

    res.status(200).json({
        ...reportResult[0],
        orders: ordersResult
    });
});

module.exports = {
  getOrderReport,
};
