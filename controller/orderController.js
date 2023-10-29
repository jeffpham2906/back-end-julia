const Order = require('../model/orderModel')
const User = require('../model/userModel')

exports.getOrders = async (req, res) => {
    try {
        const isStaff = req.query.role === 'staff'
        // console.log(isStaff)
        // console.log(req.staffId)
        console.log(req.query)


        let findOptions = isStaff ? { staff_id: req.staffId } : { admin_id: req.adminId }
        if (req.query.status === 'no-distributed') {
            findOptions = { ...findOptions, staff_name: '' }
        }
        if (req.query.status === 'distributed') {
            findOptions = { ...findOptions, status: 'is completing' }
        }
        if (req.query.status === 'completed') {
            findOptions = { ...findOptions, isCompleted: true }
        }
        if (req.query.status === 'pending') {
            findOptions = { ...findOptions, status: 'is pending' }
        }

        const orders = await Order.find(findOptions)
        res.status(200).json({
            status: 'success',
            orders
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: "Cannot retrive orders"
        })
    }
}

exports.createOrder = async (req, res) => {

    try {
        const newOrder = await Order.create({
            orderID: req.body.orderID,
            order_products: [...req.body.order_products],
            admin_id: req.adminId
        })

        res.status(201).json({
            status: "success",
            newOrder
        })
    } catch (error) {
        res.status(406).json({
            status: 'failed',
            message: "Failed to create order"
        })
    }
}

exports.updateOrder = async (req, res) => {
    try {
        const orderUpdated = await Order.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, returnDocument: 'after' })
        res.status(202).json({
            status: 'success',
            orderUpdated
        })
    } catch (error) {
        res.status(406).json({
            status: 'failed',
            message: "Failed to update order"
        })
    }
}

exports.addOrder = async (req, res) => {
    try {

        const orders = req.body.orders

        if (!orders) return res.status(406).json({ status: 'failed', message: 'Do not have order to distributed' })

        const user = await User.findById(req.params.id)

        await orders.map(async (order) => await Order.findByIdAndUpdate(order, { staff_name: user.displayName, staff_id: user._id, status: 'is completing' }))
        res.status(201).json({
            status: 'success'
        })
    } catch (error) {
        console.log(error.message)
        res.status(401).json({
            status: 'failed',
            message: error.message
        })
    }
}

exports.checkRequest = async (req, res) => {
    try {
        const orders = req.body.orders
        await orders.map(async (order) => await Order.findByIdAndUpdate(order, { status: 'is pending' }))
        res.status(201).json({
            status: 'success'
        })
    } catch (error) {
        console.log(error.message)
        res.status(401).json({
            status: 'failed',
            message: error.message
        })
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) return res.status(404).json({
            status: 'failed',
            message: "Cannot found id order"
        })

        const order = await Order.findByIdAndDelete(id)
        res.status(201).json({
            status: 'success',
            order
        })
    } catch (error) {
        res.status(406).json({
            status: 'failed',
            message: "Cannot delete order"
        })
    }
}