const express = require('express');

const router = express.Router();
const { createOrderCashOnDelivery } = require('../controllers/orderController');
const authService = require('../controllers/authController');

router.post('/cash-on-delivery', createOrderCashOnDelivery);


module.exports = router;
