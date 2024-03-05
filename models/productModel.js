const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Product name is too short'],
      maxlength: [100, 'Product name is too long'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        trim: true,
        max: [200000, 'Product price is too long'],
      },
    priceAfterDiscount: {
        type: Number,
    },
    finalPrice: {
        type: Number,
        default: function () {
          // Calculate final price based on price and priceAfterDiscount
          return this.priceAfterDiscount ? this.price - this.priceAfterDiscount : this.price;
        },
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
    },
     // New field for storing applied coupon
     appliedCoupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
