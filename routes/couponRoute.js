const express = require('express');

const {
  getCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  applyCouponToProduct
} = require('../controllers/couponController');

const authService = require('../controllers/authController');

const router = express.Router();

//router.use(authService.protect, authService.allowedTo('admin'));

router.route('/').get(getCoupons).post(createCoupon);
router.route('/:id')
.get(getCoupon)
.put(authService.protect,
     authService.allowedTo('admin'),
     updateCoupon)
.delete(authService.protect, 
        authService.allowedTo('admin'),
        deleteCoupon);
router.post('/applyCoupon',authService.protect,
    authService.allowedTo('admin'),
    applyCouponToProduct)

module.exports = router;