const AppError = require('../utils/appError')

const handleCastError = (error) => {
    const message = `Invalid ${error.path}: ${error.value}`
    return new AppError(message, 400)
}

const handleValidationErrorDB = (error) => {
    const errors = Object.values(error.errors).map(el => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const values = Object.keys(err.keyValue)
    const message = `Duplicate field value: ${values.join('. ')}. Please use another value!`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.error("Error ❌", err)
        res.status(500).json({
            status: 'error',
            message: "Something went wrong"
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        const { name } = err
        if (name === 'CastError') {
            error = handleCastError(error)
        }
        if (name === "ValidationError") {
            error = handleValidationErrorDB(error)
        }
        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error)
        }
        sendErrorProd(error, res)
    }

}