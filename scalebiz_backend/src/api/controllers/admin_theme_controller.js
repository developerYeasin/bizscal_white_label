const AdminBaseController = require('./admin_base_controller');

class AdminThemeController extends AdminBaseController {
    constructor() {
        super('themes');
    }
}

module.exports = new AdminThemeController();