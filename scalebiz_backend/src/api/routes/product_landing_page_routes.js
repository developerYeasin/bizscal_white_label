const express = require('express');
const productLandingPageController = require('../controllers/product_landing_page_controller');
const { protect, authorize } = require('../middlewares/auth_middleware');

const router = express.Router();

router.route('/')
  .post(protect, authorize(['admin', 'owner']), productLandingPageController.createProductLandingPage)
  .get(protect, authorize(['admin', 'owner', 'customer']), productLandingPageController.getAllProductLandingPages);

router.route('/:id')
  .get(protect, authorize(['admin', 'owner', 'customer']), productLandingPageController.getProductLandingPageById)
  .put(protect, authorize(['admin', 'owner']), productLandingPageController.updateProductLandingPage)
  .delete(protect, authorize(['admin', 'owner']), productLandingPageController.deleteProductLandingPage);

router.route('/public/:id')
  .get(productLandingPageController.getPublicProductLandingPageById);

module.exports = router;