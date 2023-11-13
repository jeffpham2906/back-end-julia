const mongoose = require("mongoose")
// const validator = require('validator')
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: "Please provide name"
    },
    username: {
        type: String,
        required: 'Please provide username'
    },
    password: {
        type: String,
        required: 'Please provide password',
        select: false
    },
    isStaff: {
        type: Boolean,
        default: false
    },
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