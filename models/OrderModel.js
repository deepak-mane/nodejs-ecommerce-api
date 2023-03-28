import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Generate Random alphanumeric string for order numbers
const randomTxt = Array.from(Array(30), () =>
    Math.floor(Math.random() * 36).toString(36)
)
    .join('')
    .toLocaleUpperCase()

// Order schema
const OrderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        orderItems: [
            {
                type: Object,
                required: true
            }
        ],
        shippingAddress: {
            type: Object,
            required: true
        },
        orderNumber: {
            type: String,
            default: randomTxt
        },
        // for stripe payment
        paymentStatus: {
            type: String,
            default: 'Not Paid'
        },
        paymentMethod: {
            type: String,
            default: 'Not Specified'
        },
        retailPrice: {
            type: Number,
            default: 0.0,
        },        
        totalPrice: {
            type: Number,
            default: 0.0,
        },
        currency: {
            type: String,
            default: 'Not Specified'
        },
        // For Admin
        status: {
            type: String,
            default: 'Pending',
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
            required: true
        },
        deliveredAt: {
            type: Date
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

// Compile to form model
const Order = mongoose.model('Order', OrderSchema)

export default Order