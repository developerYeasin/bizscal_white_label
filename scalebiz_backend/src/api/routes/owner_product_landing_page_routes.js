const express = require('express');
const {
  createOwnerProductLandingPage,
  getAllOwnerProductLandingPages,
  getOwnerProductLandingPageById,
  updateOwnerProductLandingPage,
  deleteOwnerProductLandingPage,
} = require('../controllers/owner_product_landing_page_controller');
const { protect, authorize } = require('../middlewares/auth_middleware');

const router = express.Router();

router.use(protect);
router.use(authorize(['owner']));

router.route('/')
  .post(createOwnerProductLandingPage)
  .get(getAllOwnerProductLandingPages);

router.route('/:id')
  .get(getOwnerProductLandingPageById)
  .put(updateOwnerProductLandingPage)
  .delete(deleteOwnerProductLandingPage);

module.exports = router;