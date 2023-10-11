const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

const productRoute = require('./routes/productRoute')
const orderRoute = require('./routes/orderRoute')
const userRoute = require('./routes/userRoute')
const staffRoute = require('./routes/staffRoute')
const userController = require('./controller/userController')

app.use('/api/products', userController.protect, productRoute)
app.use('/api/orders', userController.protect, orderRoute)
app.use('/api/users', userRoute)
app.use('/api/staffs', userController.protect, staffRoute)


module.exports = app