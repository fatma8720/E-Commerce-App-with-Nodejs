const { check } = require("express-validator");
const slugify = require('slugify');
const validatoeMiddleware = require("../../middlewares/validatorMiddleware");

 //rule
exports.getCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid Category Id Format"),
    validatoeMiddleware,
];

exports.createCategoryValidator = [
    check('name')
    .notEmpty()
    .withMessage("Category required")
    .isLength({min : 3 })
    .withMessage("Too short Category Name")
    .isLength({max : 30 })
    .withMessage("Too Long Category Name")
    .custom((value, { req }) => {
        req.body.slug = slugify(value);
        return true;
      }),
     validatoeMiddleware,
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid Category Id Format"),
    check('name').custom((value, { req }) => {
        req.body.slug = slugify(value);
        return true;
      }),
    validatoeMiddleware,
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid Category Id Format"),
    validatoeMiddleware,
];
