const AdminBaseController = require('./admin_base_controller');

class AdminPageController extends AdminBaseController {
    constructor() {
        super('pages');
    }
}

module.exports = new AdminPageController();