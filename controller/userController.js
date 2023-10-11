const User = require('../model/userModel')
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
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
    res.cookie('jwt', token, cookieOptions)

    user.password = undefined
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
        console.log(req.headers.cookie)
        let token;
        // Check authorization
        if (req.headers.cookie && req.headers.cookie.startsWith('jwt')) {
            token = req.headers.cookie.split('=')[1]
        }
        // console.log(token)
        if (!token) return res.status(401).json({
            status: 'failed',
            message: 'You are not logged in! Please log in to get access'
        })

        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        // console.log(decoded)
        next()
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message
        })
    }
}

exports.signup = async (req, res) => {
    try {

        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,
            isAdmin: true
        })

        createSendToken(newUser, res)

    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }
}

exports.login = async (req, res) => {
    try {
        //Check name and password exist
        if (!req.body.username || !req.body.password) throw new Error("Please provide username and password")

        //Is correct name and password?
        const user = await User.findOne({ username: req.body.username }).select('+password').select('+isAdmin')

        if (!user || !await user.correctPassword(req.body.password, user.password)) throw new Error("Incorrect password")

        createSendToken(user, 201, res)
        return
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error.message
        })
    }
}

exports.test = (req, res) => {
    console.log(req.params)

    res.send('123')
}