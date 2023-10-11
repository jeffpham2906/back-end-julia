const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const mongoose = require('mongoose')
const fs = require('fs')
const Product = require('../model/productModel')
const Order = require('../model/orderModel')

const url = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(url, { dbName: 'julia' }).then(() => console.log("Connect to Database successfully"), err => console.log(err.message))
const orders = JSON.parse(fs.readFileSync(`${__dirname}/order.js`, 'utf-8'))
const products = JSON.parse(fs.readFileSync(`${__dirname}/product.js`, 'utf-8'));

console.log(`${__dirname}/order.js`)
const importData = async () => {
    try {
        await Order.syncIndexes()
        await Product.create(products)
        await Order.create(orders)
        console.log("Loadded")
        process.exit()
    } catch (error) {
        console.log(error.message)
        process.exit()
    }
}
const deleteData = async () => {
    try {
        await Product.deleteMany()
        await Order.deleteMany()
        console.log("Deleted")
        process.exit()
    } catch (error) {
        console.log(error.message)
        process.exit()
    }
}
if (process.argv[2] === "--import") {
    importData()
} else if (process.argv[2] === "--delete") {
    deleteData()
}