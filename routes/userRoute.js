const express = require('express')
const authController = require('../controller/userController')

const router = express.Router()

// 1) 
router
    .route('/signup')
    .post(authController.signup)

router
    .post('/login', authController.login)


module.exports = router