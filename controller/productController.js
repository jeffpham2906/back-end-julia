const Product = require("../model/productModel")
const APIFeatures = require('../utils/apiFeatures')
const AppError = require("../utils/appError")
const catchAsync = require('../utils/catchAsync')
const fs = require('fs')
const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/products')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, req.query.admin_id + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Please provide an image for product', 400), false)
    }
}

const upload = multer({ storage, fileFilter })

exports.uploadImage = upload.single('image')

exports.getAllProduct = catchAsync(async (req, res, next) => {
    const feature = new APIFeatures(Product.find(), req.query).filter().sort().paginate()
    const products = await feature.query
    if (!products) {
        return next(new AppError('Products was not found', 404))
    }

    res.status(200).json({
        status: "success",
        result: products.length,
        products
    })
})



exports.createProduct = catchAsync(async (req, res) => {
    const { name, price, commission } = req.body
    const newProduct = await Product.create({
        name,
        image: req.file?.filename,
        price,
        commission,
        admin_id: req.query.admin_id
    })
    res.status(201).json({
        status: "success",
        product: newProduct,
    })
})

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) return next(new AppError('Id was not found', 404))
    fs.unlinkSync(`public/images/products/${deletedProduct.image}`)
    res.status(202).json({
        status: 'success',
        deletedProduct
    })
})

exports.updateProduct = catchAsync(async (req, res) => {
    const { name, price, commission } = req.body
    const updateObj = {
        name,
        price,
        commission,
    }
    if (req.file) {
        updateObj.image = req.file.filename
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateObj, { runValidators: true })
    if (req.file) {
        fs.unlinkSync(`public/images/products/${updatedProduct.image}`)
    }
    res.status(202).json({
        status: 'success',
        updatedProduct
    })
})