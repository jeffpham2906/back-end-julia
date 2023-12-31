const mongoose = require('mongoose')

const orderModel = new mongoose.Schema({
    orderID: {
        type: String,
        required: [true, "Order must have a order ID"],
        unique: true
    },
    staff_name: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "no-distributed"
    },
    checked: {
        type: Boolean,
        default: false
    },
    admin_id: {
        type: String,
        required: true
    },
    staff_id: String,
    order_products: [
        {
            name: {
                type: String,
                required: [true, "Product must have a name"],
                unique: [false, "why"]
            },
            image: {
                type: String,
                required: [true, "Product must have a image"]
            },
            quantity: {
                type: Number,
                default: 1
            },
            size: {
                type: String,
                required: [true, "A product must have a size"],
                enum: {
                    values: ["Note", "Size XS", "Size S", "Size M", "Size L"],
                    message: "Size can be XS, S, M, L or Ghi chú"
                }
            },
            form: {
                type: String,
                required: [true, "A product must have a form"],
                enum: {
                    values: ["Nhọn", "Tròn nhọn", "Vuông", "Thang"],
                    message: "Form can be Nhọn, Tròn nhọn, Vuông, Thang"
                }
            },
            note: {
                type: String,
                maxlength: [100, "Note should be less than 100 character"]
            }
            ,
            createAt: {
                type: Date,
                default: Date.now()
            }
        },

    ],
    createAt: {
        type: Date,
        default: Date.now()
    }
})

const Order = mongoose.model("Order", orderModel)
module.exports = Order