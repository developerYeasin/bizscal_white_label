const AdminBaseController = require('./admin_base_controller');

class AdminStoreLandingPageSettingsController extends AdminBaseController {
    constructor() {
        super('store_landing_page_settings');
    }
}

module.exports = new AdminStoreLandingPageSettingsController();