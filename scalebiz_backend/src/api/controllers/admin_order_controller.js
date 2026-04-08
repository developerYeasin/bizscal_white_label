const AdminBaseController = require('./admin_base_controller');

class AdminOrderController extends AdminBaseController {
    constructor() {
        super('orders');
    }

    async create(req, res, next) {
        try {
            const newOrder = await this.model.create(req.body);
            res.status(201).json({ success: true, data: newOrder });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const results = {};

            const total = await this.model.countDocuments().exec();
            results.total = total;

            if (endIndex < total) {
                results.next = {
                    page: parseInt(page) + 1,
                    limit: limit
                };
            }

            if (startIndex > 0) {
                results.previous = {
                    page: parseInt(page) - 1,
                    limit: limit
                };
            }
            
            results.results = await this.model.find().limit(limit).skip(startIndex).exec();

            res.status(200).json({ success: true, ...results });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const order = await this.model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            res.status(200).json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const order = await this.model.findByIdAndDelete(req.params.id);

            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            res.status(200).json({ success: true, data: {} });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminOrderController();