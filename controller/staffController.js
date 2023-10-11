const User = require('../model/userModel')
const Order = require('../model/orderModel')

exports.getAllStaffs = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false })
        res.send(users)
    } catch (error) {
        res.status(401).json({
            status: 'failed',
            message: "Cannot find staffs"
        })
    }
}

exports.signup = async (req, res) => {
    try {
        console.log(req.body)
        // const newUser = await User.create({
        //     displayName: req.body.displayName,
        //     username: req.body.username,
        //     password: req.body.password,
        //     admin_id: req.body.admin_id
        // })
        // res.status(201).json({
        //     status: 'success',
        //     newUser: {
        //         displayName: newUser.displayName,
        //         username: newUser.username,
        //         admin_id: newUser.admin_id
        //     }
        // })
    } catch (error) {
        res.status(406).json({
            status: 'failed',
            message: error.message
        })
    }
}

exports.updateStaffOrder = async (req, res) => {
    try {

        let staff_id = req.params.id
        if (!staff_id) return res.status(404).json({ status: 'failed', message: 'Please provide the valid id' })
        const newStaffUpdate = await User.findByIdAndUpdate(req.params.id, { orders: req.body.orders }, { runValidators: true })
        await req.body?.map(async (order) => await Order.findByIdAndUpdate(order, { status: "Đã chia" }))
        res.status(201).json({
            status: 'success',
            newStaffUpdate
        })
    } catch (error) {
        res.status(401).json({
            status: 'failed',
            message: error.message
        })
    }
}