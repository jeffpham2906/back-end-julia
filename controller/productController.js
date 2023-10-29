const Product = require("../model/productModel")




exports.getAllProduct = async (req, res) => {
    try {
        const products = await Product.find({ admin_id: req.adminId })
        res.status(200).json({
            status: "success",
            result: products.length,
            products
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: "Server cannot get products"
        })
    }
}

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create({
            name: req.body.name,
            image: req.body.image,
            price: req.body.price,
            revenue: req.body.revenue,
            admin_id: req.adminId
        })
        res.status(201).json({
            status: "success",
            product: newProduct
        })
    } catch (error) {
        res.status(406).json({
            status: 'failed',
            message: "Server cannot store new product"
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)
        if (!deletedProduct) {
            return res.status(404).json({
                status: 'failed',
                message: "ID not found"
            })
        }
        res.status(202).json({
            status: 'success',
            deletedProduct
        })
    } catch (error) {
        res.status(406).json({
            status: 'failed',
            message: "Server cannot delete product"
        })
    }
}

exports.updateProduct = async (req, res) => {
    try {
        console.log(req.body)
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { runValidators: true })
        res.status(202).json({
            status: 'success',
            updatedProduct
        })
    } catch (error) {
        res.status(406).json({
            status: 'failed',
            message: "Server cannot update product"
        })
    }
}