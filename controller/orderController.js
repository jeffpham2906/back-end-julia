const Order = require('../model/orderModel')


exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
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
            order_products: [...req.body.order_products]
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


exports.addNewOrder = async (req, res) => {
    try {
        const data = req.body
        res.json(data)
    } catch (error) {
        res.status(406).json({
            status: 'failed',
            message: "F"
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