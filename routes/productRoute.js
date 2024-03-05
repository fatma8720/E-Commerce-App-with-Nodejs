const express = require('express');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/ProductValidator");

const {
  getProducts,
  getProduct,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

const authService = require('../controllers/authController');


router.route('/').get(getProducts).post(createProductValidator, createProduct);
router.route('/category').get(getProductsByCategory);
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo('admin'),
    updateProductValidator,
     updateProduct)
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteProductValidator,
     deleteProduct);

module.exports = router;