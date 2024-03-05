const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Product= require('../models/productModel');
const User = require("../models/userModel");

// @desc    Create cart
// @route   POST /api/v1/cart
// @access  Public
exports.createCart = asyncHandler(async (req, res, next) => {
  const { userId, totalPrice, products } = req.body;

  try {
    // Check if the userId is valid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Check if each product exists
    const productIds = products.map(product => product.product);
    const existingProducts = await Product.find({ _id: { $in: productIds } });
    const nonExistingProduct = products.find(product => !existingProducts.some(existingProduct => existingProduct._id.equals(product.product)));
    if (nonExistingProduct) {
      return res.status(404).json({ status: 'error', message: `Product with ID ${nonExistingProduct.product} does not exist` });
    }

    // Create the cart
    const cart = await Cart.create({
      userId,
      totalPrice,
      products,
    });

    res.status(201).json({
      status: 'success',
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});


// @desc    Update cart
// @route   PUT /api/v1/cart/:cartId
// @access  Private/Admin
exports.updateCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findByIdAndUpdate(req.params.cartId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!cart) {
    return next(new ApiError(`Cart not found with id: ${req.params.cartId}`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: cart,
  });
});

// @desc    Apply coupon on cart if not applied to products
// @route   POST /api/v1/carts/applyCartCoupon/:cartId
// @access  Public
exports.applyCartCoupon = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  const { couponId } = req.body;

  // Check if coupon exists and not expired
  const coupon = await Coupon.findOne({ _id: couponId, expireIn: { $gt: Date.now() } });
  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`, 400));
  }

  // Check if the cart exists
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new ApiError(`Cart not found with id: ${cartId}`, 404));
  }

  // Check if the coupon is already applied to any product in the cart
  const isCouponAppliedToProducts = cart.products.some(product => product.coupon && product.coupon.equals(couponId));
  if (isCouponAppliedToProducts) {
    return next(new ApiError(`Coupon is already applied to one or more products in the cart`, 400));
  }

  // Apply coupon to the cart and save
  cart.appliedCoupon = couponId;
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});

