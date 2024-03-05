const express = require('express');

const router = express.Router();
const {
    createCart,
    updateCart,
    applyCartCoupon
}= require('../controllers/cartController');
const authService = require('../controllers/authController');

//router.use(authService.protect, authService.allowedTo('user'));

router
  .route('/').post(createCart)

router.put('/:cartId', authService.protect, authService.allowedTo('admin'),updateCart);

router.post('/applyCoupon/:cartId', applyCartCoupon);


module.exports = router;
