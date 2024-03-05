//routes

const express = require("express");
const { 
  getCategoryValidator, 
  updateCategoryValidator, 
  deleteCategoryValidator, 
  createCategoryValidator 
} = require("../utils/validators/categoryValidator");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();
const authService = require('../controllers/authController');

const subcategoriesRoute = require('./subCategoryRoute');

router.use('/:categoryId/subcategories', subcategoriesRoute);

//router.get('/',getCategories)
//router.post('/',createCategory)
router
.route("/").get(getCategories)
.post(createCategoryValidator,createCategory);
//rule
//if there is an error in rule it cathc it 
//if evry thing id ok it enter handler

router
  .route("/:id")
  .get(getCategoryValidator,getCategory)
  .put(authService.protect,
    authService.allowedTo('admin'),
    updateCategoryValidator,
    updateCategory)
  .delete(authService.protect,
    authService.allowedTo('admin'),
    deleteCategoryValidator,
    deleteCategory);

module.exports = router;
