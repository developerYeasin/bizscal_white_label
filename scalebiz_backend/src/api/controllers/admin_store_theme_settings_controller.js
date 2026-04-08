const AdminBaseController = require('./admin_base_controller');

class AdminStoreThemeSettingsController extends AdminBaseController {
    constructor() {
        super('store_theme_settings');
    }
}

module.exports = new AdminStoreThemeSettingsController();