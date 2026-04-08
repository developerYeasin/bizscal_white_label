const AdminBaseController = require('./admin_base_controller');

class AdminStoreConfigurationController extends AdminBaseController {
    constructor() {
        super('store_configurations');
    }
}

module.exports = new AdminStoreConfigurationController();