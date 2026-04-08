const express = require('express');
const {
  createLandingPageTemplate,
  getAllLandingPageTemplates,
  getLandingPageTemplateById,
  updateLandingPageTemplate,
  deleteLandingPageTemplate,
} = require('../controllers/landing_page_template_controller');
const { authenticate } = require('../middlewares/auth_middleware');
const { authorize } = require('../middlewares/store_middleware');

const router = express.Router();

router.route('/')
  .post(authenticate, authorize(['admin']), createLandingPageTemplate)
  .get(authenticate, authorize(['admin', 'owner', 'customer']), getAllLandingPageTemplates);

router.route('/:id')
  .get(authenticate, authorize(['admin', 'owner', 'customer']), getLandingPageTemplateById)
  .put(authenticate, authorize(['admin']), updateLandingPageTemplate)
  .delete(authenticate, authorize(['admin']), deleteLandingPageTemplate);

module.exports = router;