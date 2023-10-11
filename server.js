const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const mongoose = require('mongoose')
const app = require('./app')


const url = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(url, { dbName: 'julia' }).then(() => console.log("Connect to Database successfully"), err => console.log(err.message))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`App is running on port ${port}`))

