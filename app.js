const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController')



const app = express()


app.use(express.json())
app.use(morgan('dev'))
app.use(cors({ origin: true, credentials: true }))
app.use(express.static(`${__dirname}/public`))

const productRoute = require('./routes/productRoute')
const orderRoute = require('./routes/orderRoute')
const userRoute = require('./routes/userRoute')

app.get('/', (req, res) => res.send('hello'))

app.use('/api/products', productRoute)
app.use('/api/orders', orderRoute)
app.use('/api/users', userRoute)

app.all('*', (req, res, next) => {
    next(new AppError(`The ${req.originalUrl} is not found in this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app