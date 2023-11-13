const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const userController = require('../controller/authController')


router.use(userController.protect)

router
    .route('/')
    .get(productController.getAllProduct)
    .post(productController.uploadImage, productController.createProduct)

router
    .route('/:id')
    .put(productController.uploadImage,productController.updateProduct)
    .delete(productController.deleteProduct)

module.exports = router