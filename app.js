const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(express.json())
app.use(morgan('dev'))
app.use(cors({ origin: true, credentials: true }))

const productRoute = require('./routes/productRoute')
const orderRoute = require('./routes/orderRoute')
const userRoute = require('./routes/userRoute')
// const staffRoute = require('./routes/staffRoute')

app.use('/api/products', productRoute)
app.use('/api/orders', orderRoute)
// app.use('/api/staffs', staffRoute)
app.use('/api/users', userRoute)


module.exports = app