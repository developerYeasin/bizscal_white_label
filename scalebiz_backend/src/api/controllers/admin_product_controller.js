const AdminBaseController = require('./admin_base_controller');

class AdminProductController extends AdminBaseController {
    constructor() {
        super('products');
    }

    // Override getAll to include specific sorting for products
    getAll = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const offset = (page - 1) * limit;

            const [records] = await pool.query(
                `SELECT * FROM ${this.tableName} ORDER BY display_order ASC LIMIT ? OFFSET ?`,
                [limit, offset]
            );

            const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM ${this.tableName}`);

            res.status(200).json({
                success: true,
                count: records.length,
                total,
                page,
                limit,
                data: records
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AdminProductController();