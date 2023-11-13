const mongoose = require('mongoose')
const fs = require('fs')
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Product must have a name",
        unique: true
    },
    image: {
        type: String,
        required: "Product must have a image",
    },
    price: {
        type: Number,
        required: "Product must have a price"
    },
    commission: {
        type: Number,
        required: "Product must have a commission"
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    admin_id: {
        type: String,
        required: true
    }
})


const Product = mongoose.model('Product', productSchema)
module.exports = Product
