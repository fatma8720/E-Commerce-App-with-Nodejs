const express = require('express');
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

const router = express.Router();
const authService = require('../controllers/authController');

router.route('/').get(getBrands).post(authService.protect,
  authService.allowedTo('admin'),createBrandValidator, createBrand);
router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(authService.protect,
    authService.allowedTo('admin'),updateBrandValidator, updateBrand)
  .delete(authService.protect,
    authService.allowedTo('admin'),deleteBrandValidator, deleteBrand);

module.exports = router;