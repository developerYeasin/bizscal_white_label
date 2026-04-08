const AdminBaseController = require('./admin_base_controller');

class AdminCustomerController extends AdminBaseController {
    constructor() {
        super('customers');
    }
}

module.exports = new AdminCustomerController();