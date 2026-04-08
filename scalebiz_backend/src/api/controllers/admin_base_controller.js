const ApiError = require('../../utils/api_error');
const pool = require('../../config/database');

// Base controller for admin operations
// Can include common methods or middleware for all admin controllers
class AdminBaseController {
    constructor(tableName) {
        this.tableName = tableName;
    }

    // Generic method to get all records
    getAll = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const offset = (page - 1) * limit;

            const [records] = await pool.query(
                `SELECT * FROM ${this.tableName} LIMIT ? OFFSET ?`,
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

    // Generic method to get a record by ID
    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const [record] = await pool.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);

            if (record.length === 0) {
                return next(new ApiError(404, `${this.tableName.slice(0, -1)} not found`));
            }

            res.status(200).json({
                success: true,
                data: record[0]
            });
        } catch (error) {
            next(error);
        }
    };

    // Generic method to create a record
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const columns = Object.keys(data).join(', ');
            const placeholders = Object.keys(data).map(() => '?').join(', ');
            const values = Object.values(data);

            const [result] = await pool.query(
                `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
                values
            );

            res.status(201).json({
                success: true,
                message: `${this.tableName.slice(0, -1)} created successfully`,
                id: result.insertId
            });
        } catch (error) {
            next(error);
        }
    };

    // Generic method to update a record
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(data), id];

            const [result] = await pool.query(
                `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
                values
            );

            if (result.affectedRows === 0) {
                return next(new ApiError(404, `${this.tableName.slice(0, -1)} not found`));
            }

            res.status(200).json({
                success: true,
                message: `${this.tableName.slice(0, -1)} updated successfully`
            });
        } catch (error) {
            next(error);
        }
    };

    // Generic method to delete a record
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;

            const [result] = await pool.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);

            if (result.affectedRows === 0) {
                return next(new ApiError(404, `${this.tableName.slice(0, -1)} not found`));
            }

            res.status(200).json({
                success: true,
                message: `${this.tableName.slice(0, -1)} deleted successfully`
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = AdminBaseController;