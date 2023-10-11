const mongoose = require("mongoose")
// const validator = require('validator')
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    displayName: String,
    username: {
        type: String,
        required: [true, "Please tell us your name"]
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        select: false
    },
    isAdmin: {
        type: Boolean,
        default: false,
        select: false
    },
    orders: [String],
    admin_id: String
})

userSchema.pre('save', async function (next) {
    // This func only work if password is modified
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)

    return next()
})

userSchema.method('correctPassword', async function (userPassword, hashedPassword) {
    return await bcrypt.compare(userPassword, hashedPassword)
})

const User = mongoose.model('User', userSchema)


module.exports = User