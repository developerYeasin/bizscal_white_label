const AdminBaseController = require('./admin_base_controller');

class AdminLandingPageTemplateController extends AdminBaseController {
    constructor() {
        super('landing_page_templates');
    }
}

module.exports = new AdminLandingPageTemplateController();