const express = require('express')
const authController = require('../controller/authController')
const userController = require('../controller/userController')

const router = express.Router()
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

router
    .route('/staff')
    .post(authController.protect, userController.signUpStaffAccount)

router
    .route('/')
    .get(authController.protect, userController.getStaffs)


module.exports = router