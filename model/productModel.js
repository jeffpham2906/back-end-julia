const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product must have a name"],
        unique: true
    },
    image: {
        type: String,
        required: [true, "Product must have a image"],
        unique: true
    },
    price: {
        type: Number,
        required: [true, "Product must have a price"],
    },
    revenue: {
        type: Number,
        required: [true, "Product must have a revenue"]
    },
    create_At: {
        type: Date,
        default: Date.now()
    }
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product
