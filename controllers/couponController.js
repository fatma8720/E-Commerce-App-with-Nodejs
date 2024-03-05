const asyncHandler = require("express-async-handler");
const factory = require('./handlersFactory');
const Coupon = require('../models/couponModel');
const Product = require('../models/productModel');
const ApiError = require('../utils/apiError')
// @desc    Get list of coupons
// @route   GET /api/v1/coupons
// @access  Public
//exports.getCoupons = factory.getAll(Coupon);
exports.getCoupons = asyncHandler(async (req, res) => {
    //pagenation
    //*1 to convert it to number from string
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    //(2-1)*5=5
    const skip = (page - 1) * limit;
  
    const coupons = await Coupon.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: coupons.length, page, data: coupons });
  });

// @desc    Apply coupon to product
// @route   Post /api/v1/coupons/applyCoupon
// @access  Private/Admin
exports.applyCouponToProduct = asyncHandler(async (req, res, next) => {
  const { productId, couponId } = req.body;

  // Find the product by ID
  const product = await Product.findById(productId);

  // Check if the product exists
  if (!product) {
    return next(new ApiError(`Product not found with id: ${productId}`, 404));
  }

  // Check if the coupon exists and not expired
  const coupon = await Coupon.findOne({ _id: couponId, expireIn: { $gt: Date.now() } });
  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`, 400));
  }

  // Apply the coupon to the product and save
  product.appliedCoupon = couponId;
  await product.save();

  res.status(200).json({
    status: 'success',
    data: product,
  });
});





// @desc    Get specific coupon by id
// @route   GET /api/v1/coupons/:id
// @access  Public
exports.getCoupon = factory.getOne(Coupon);

// @desc    Create coupon
// @route   POST  /api/v1/coupons
// @access  Public
exports.createCoupon = factory.createOne(Coupon);

// @desc    Update specific coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin
exports.updateCoupon = factory.updateOne(Coupon);

// @desc    Delete specific coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = factory.deleteOne(Coupon);