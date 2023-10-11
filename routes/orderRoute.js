const express = require('express')
const orderController = require('../controller/orderController')
const userController = require('../controller/userController')

const router = express.Router()


router
    .route('/')
    .get(orderController.getAllOrders)
    .post(orderController.createOrder)


router
    .route('/:id')
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder)

module.exports = router