const AdminBaseController = require('./admin_base_controller');

class AdminCategoryController extends AdminBaseController {
    constructor() {
        super('categories');
    }
}

module.exports = new AdminCategoryController();