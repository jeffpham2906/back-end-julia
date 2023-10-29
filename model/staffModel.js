// const mongoose = require('mongoose')
// const bcrypt = require("bcryptjs")

// const staffSchema = new mongoose.Schema({
//     displayName: {
//         type: String,
//         required: "Please provide name"
//     },
//     username: {
//         type: String,
//         required: 'Please provide username'
//     },
//     password: {
//         type: String,
//         required: 'Please provide password',
//         select: false
//     },
//     isStaff: {
//         type: Boolean,
//         default: true
//     },
//     orders: [String],
//     admin_id: {
//         type: String,
//         required: true
//     }
// })

// staffSchema.pre('save', async function (next) {
//     // This func only work if password is modified
//     if (!this.isModified('password')) return next()

//     this.password = await bcrypt.hash(this.password, 12)

//     return next()
// })

// staffSchema.method('correctPassword', async (staffPassword, hashedPassword) => {
//     return await bcrypt.compare(staffPassword, hashedPassword)
// })

// staffSchema.method('addOrder', async function (newArrayOrder) {
//     this.orders = this.orders.concat(newArrayOrder)
//     return
// })

// const Staff = mongoose.model('Staff', staffSchema)
// module.exports = Staff