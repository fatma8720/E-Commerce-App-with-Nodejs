const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Category = require('../../models/categoryModel');

exports.createProductValidator = [
  check('productName')
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 characters')
    .notEmpty()
    .withMessage('Product name is required')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price must be a number')
    .isLength({ max: 32 })
    .withMessage('Product price is too long'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Product priceAfterDiscount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error('PriceAfterDiscount must be lower than price');
      }
      return true;
    }),
  check('image')
    .notEmpty()
    .withMessage('Product image is required'),
  check('category')
    .notEmpty()
    .withMessage('Product must belong to a category')
    .isMongoId()
    .withMessage('Invalid category ID format')
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category found for this ID: ${categoryId}`)
          );
        }
      })
    ),
  check('stock')
    .notEmpty()
    .withMessage('Product stock is required')
    .isNumeric()
    .withMessage('Product stock must be a number'),

  validatorMiddleware,
];

exports.getProductValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  body('productName')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 characters')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  validatorMiddleware,
];
