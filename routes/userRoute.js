const express = require('express')
const authController = require('../controller/authController')
const userController = require('../controller/userController')

const router = express.Router()
// 1) Query role [admin,staff]
router
    .route('/signup')
    .post(authController.signup)

router
    .post('/login', authController.login)

router
    .route('/logout')
    .post(authController.logout)


router.route('/:id')
    .get(userController.getStaffs)
// .post(userController.addOrder)
// .patch(userController.checkRequest) // last here , creating check request for staff


module.exports = router