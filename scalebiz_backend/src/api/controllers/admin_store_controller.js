const AdminBaseController = require('./admin_base_controller');

class AdminStoreController extends AdminBaseController {
    constructor() {
        super('stores');
    }
}

module.exports = new AdminStoreController();