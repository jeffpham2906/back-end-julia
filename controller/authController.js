const User = require('../model/userModel')
const Staff = require('../model/staffModel')
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
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
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

exports.protect = async (req, res, next) => {
    try {
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
        const currentUser = await User.findById(decoded.id) || await Staff.findById(decoded.id);
        if (!currentUser) {
            throw new Error('User is not exist')
        }
        // is Admin
        if (!currentUser.admin_id) {
            req.adminId = String(currentUser._id)
        } else {
            req.staffId = String(currentUser._id)
        }
        next()
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message
        })
    }
}

exports.restrictAdmin = async function (req, res, next) {
    console.log('admin:', req.adminId)
    console.log('staff:', req.staffId)
    if (!req.adminId) {
        console.log(123)
        return res.status(403).json({
            status: 'unauthorization',
            message: "You do not have permission to perform this action"
        })
    }
    next()
}

exports.signup = async (req, res) => {
    try {
        if (req.query.role === 'admin') {
            const newUser = await User.create({
                displayName: req.body.displayName,
                username: req.body.username,
                password: req.body.password
            })
            if (newUser) console.log("create successfully")
            res.status(201).json({
                status: 'success', newUser
            })
        } else if (req.query.role === 'staff') {
            const newStaff = await User.create({
                displayName: req.body.displayName,
                username: req.body.username,
                password: req.body.password,
                admin_id: req.body.admin_id,
                isStaff: true,
            })
            res.status(201).json({
                status: 'success',
                newStaff
            })
        }
    } catch (error) {
        res.status(406).json({
            status: 'failed',
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        // console.log(req.query)
        //Check name and password exist
        if (!req.body.username || !req.body.password) throw new Error("Please provide username and password")

        //Is correct name and password?
        if (req.query.role === 'admin') {
            const user = await User.findOne({ username: req.body.username, isStaff: false }).select('+password')

            if (!user || !await user.correctPassword(req.body.password, user.password)) throw new Error("Thông tin đăng nhập không đúng")
            createSendToken(user, 201, res)
        } else if (req.query.role === 'staff') {
            const staff = await User.findOne({ username: req.body.username, isStaff: true }).select('+password')
            if (!staff || !await staff.correctPassword(req.body.password, staff.password)) throw new Error('Thông tin staff đăng nhập không đúng')
            createSendToken(staff, 201, res)
        }

    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error.message
        })
    }
}

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 1000)
    })

    res.status(200).json({ status: 'success' })
}