const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')


router
    .route('/')
    .get(productController.getAllProduct)
    .post(productController.createProduct)

router
    .route('/:id')
    .put(productController.updateProduct)
    .delete(productController.deleteProduct)

module.exports = router