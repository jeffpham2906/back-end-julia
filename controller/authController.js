const User = require('../model/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')

function tokenSign(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

function createSendToken(user, statusCode, res) {
    const token = tokenSign(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24),
        // httpOnly: true
    }
    // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
    user.password = undefined

    res.cookie('jwt', token, cookieOptions)
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // Check authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    else if (req.headers.cookie) {
        token = req.headers.cookie.split('=')[1]
    }
    if (!token) return res.status(401).json({
        status: 'nologged',
        message: 'You are not logged in! Please log in to get access'
    })
    // console.log(token)
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) check if user still exists
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        throw new Error('User is not exist')
    }
    // is Admin
    if (currentUser.isStaff) {
        req.query.staff_id = String(currentUser._id)
    } else {
        req.query.admin_id = String(currentUser._id)
    }
    next()
})


exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        displayName: req.body.displayName,
        username: req.body.username,
        password: req.body.password
    })
    if (newUser) console.log("create successfully")
    res.status(201).json({
        status: 'success', newUser
    })
    // if (req.query.role === 'staff') {
    //     const newStaff = await User.create({
    //         displayName: req.body.displayName,
    //         username: req.body.username,
    //         password: req.body.password,
    //         admin_id: req.q.admin_id,
    //         isStaff: true,
    //     })
    //     res.status(201).json({
    //         status: 'success',
    //         newStaff
    //     })
    // }

})

exports.login = catchAsync(async (req, res, next) => {
    if (!req.body.username || !req.body.password) next(new AppError("Please provide username and password", 405))

    const user = await User.findOne({ username: req.body.username }).select('+password')
    if (!user || !await user.correctPassword(req.body.password, user.password)) { return next(new AppError("Thông tin đăng nhập không đúng", 406)) }
    createSendToken(user, 201, res)

})

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 1000)
    })
    res.status(200).json({ status: 'success' })
}