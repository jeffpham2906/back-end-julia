const User = require('../model/userModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')

exports.getStaffs = catchAsync(async (req, res) => {
    console.log(req.query)
    const feature = new APIFeatures(User.find(), req.query).filter()
    const staffs = await feature.query
    res.status(200).json({ status: 'success', staffs })
})

exports.signUpStaffAccount = catchAsync(async (req, res) => {
    const newStaff = await User.create({
        displayName: req.body.displayName,
        username: req.body.username,
        password: req.body.password,
        admin_id: req.query.admin_id,
        isStaff: true,
    })
    res.status(201).json({
        status: 'success',
        newStaff
    })
})







