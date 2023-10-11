const express = require('express')
const staffController = require('../controller/staffController')
const authController = require('../controller/userController')
const router = express.Router()

router
    .route('/')
    .get(staffController.getAllStaffs)

router
    .route('/:id')
    .post(staffController.updateStaffOrder)

router
    .route('/signup')
    .post(staffController.signup)
module.exports = router