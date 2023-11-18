const Order = require('../model/orderModel')
const User = require('../model/userModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')


exports.getOrders = catchAsync(async (req, res) => {
    const feature = new APIFeatures(Order.find(), req.query).filter().limitFields().paginate().sort()
    const orders = await feature.query
    res.status(200).json({
        status: 'success',
        result: orders.length,
        orders
    })
})

exports.createOrder = catchAsync(async (req, res) => {
    console.log(req.body)
    console.log(req.admin_id)
    const { orderID, order_products } = req.body
    const newOrder = await Order.create({
        orderID,
        order_products,
        admin_id: req.query.admin_id
    })

    res.status(201).json({
        status: "success",
        newOrder
    })
})

exports.updateOrder = catchAsync(async (req, res) => {
    const orderUpdated = await Order.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, returnDocument: 'after' })
    res.status(202).json({
        status: 'success',
        orderUpdated
    })
})

exports.addOrder = catchAsync(async (req, res) => {
    const orders = req.body.orders

    if (!orders) return res.status(406).json({ status: 'failed', message: 'Do not have order to distributed' })

    const user = await User.findById(req.params.id)
    await orders.map(async (order) => await Order.findByIdAndUpdate(order, { staff_name: user.displayName, staff_id: user._id, status: 'distributed' }))

    res.status(201).json({
        status: 'success'
    })
})

exports.checkRequest = catchAsync(async (req, res) => {
    const orders = req.body.orders
    await orders.map(async (order) => await Order.findByIdAndUpdate(order, { status: 'pending' }))

    res.status(201).json({
        status: 'success'
    })
})

exports.confirmOrder = catchAsync(async (req, res) => {
    const orders = req.body.orders
    await orders.map(async (order) => await Order.findByIdAndUpdate(order, { status: 'completed' }))

    res.status(201).json({
        status: 'success'
    })
})

exports.deleteOrder = catchAsync(async (req, res) => {
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
})