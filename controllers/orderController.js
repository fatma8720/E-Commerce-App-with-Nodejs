const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// @desc    Create order with cash on delivery
// @route   POST /api/v1/orders/cash-on-delivery
// @access  Public
exports.createOrderCashOnDelivery = asyncHandler(async (req, res, next) => {
  const { userId, totalPrice, products, shippingAddress, createdBy } = req.body;

  try {
    // Check if the userId is valid
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Check if each product exists
    const productIds = products.map((product) => product.product);
    const existingProducts = await Product.find({ _id: { $in: productIds } });
    const nonExistingProduct = products.find(
      (product) =>
        !existingProducts.some((existingProduct) =>
          existingProduct._id.equals(product.product)
        )
    );
    if (nonExistingProduct) {
      return res.status(404).json({
        status: "error",
        message: `Product with ID ${nonExistingProduct.product} does not exist`,
      });
    }

    // Create the order
    const order = await Order.create({
      userId,
      totalPrice,
      products,
      shippingAddress,
      createdBy,
      paymentMethod: "Cash on Delivery",
      status: "Pending", // Set initial status as pending
    });

    res.status(201).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});
