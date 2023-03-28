import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        fullname: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        password: { type: String, required: true, trim: true },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            }
        ],
        wishList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'WishList'
            }
        ],
        isAdmin: { type: Boolean, default: false },
        hasShippingAddress: { type: Boolean, default: false },
        shippingAddress: {
            firstName: { type: String, trim: true },
            lastName: { type: String, trim: true },
            address: { type: String, trim: true },
            city: { type: String, trim: true },
            postalCode: { type: String, trim: true },
            province: { type: String, trim: true },
            country: { type: String, trim: true },
            phone: { type: String, trim: true }
        }
    },
    { versionKey: false, timestamps: true }
)

// compile the schema to model
const User = mongoose.model('User', userSchema)

export default User
