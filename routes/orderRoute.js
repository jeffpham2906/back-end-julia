const express = require('express')
const orderController = require('../controller/orderController')
const authController = require('../controller/authController')

const router = express.Router()

router.use(authController.protect)
// router.use(authController.restrictAdmin)
router
    .route('/')
    .get(orderController.getOrders)
    .post(orderController.createOrder)


router
    .route('/:id')
    .post(orderController.addOrder)
    .put(orderController.checkRequest)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder)

module.exports = router