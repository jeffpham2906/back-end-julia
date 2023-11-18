const express = require('express')
const orderController = require('../controller/orderController')
const authController = require('../controller/authController')

const router = express.Router()

router.use(authController.protect)


router
    .route('/')
    .get(orderController.getOrders)
    .post(orderController.createOrder)
    .put(orderController.confirmOrder)
    .patch(orderController.checkRequest)


router
    .route('/:id')
    .post(orderController.addOrder)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder)

module.exports = router