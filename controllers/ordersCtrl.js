import dotenv from 'dotenv'
dotenv.config()
import Stripe from 'stripe'
import asyncHandler from 'express-async-handler'
import slugify from 'slugify'
import Order from '../models/OrderModel.js'
import User from '../models/UserModel.js'
import Product from '../models/ProductModel.js'
import Coupon from '../models/CouponModel.js'

// STRIPE instance
const stripe = new Stripe(process.env.STRIPE_KEY)

// @desc    Create new order
// @route   POST /api/v1/orders/create
// @access  Private/Admin
export const createOrderCtrl = asyncHandler(async (req, res) => {
    // 1. Get the coupon
    const { coupon } = req?.query
    // TODO: debug uncomment // console.log(coupon)
    // convert coupon to uppercase
    const couponFound = await Coupon.findOne({
        code: coupon?.toUpperCase()
    })
    // 2. check if found coupon is expired
    if (!couponFound) {
        const error = new Error(`Coupon not Valid!!!].`)
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // 3. check if found coupon is expired
    if (couponFound?.isExpired) {
        const error = new Error(
            `Coupon you have provided is expired!!!].`
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // 4. get discount
    const discount = couponFound?.discount / 100

    // 5. Get the payload(customer, orderItems, shippingAddress, totalPrice) for creation of order
    const { orderItems, shippingAddress, totalPrice } = req.body
    // TODO: Debug uncomment // console.log('[createOrderCtrl func ] orderItems,shippingAddress,totalPrice:', {orderItems,shippingAddress,totalPrice});
    // 6. Find the user logged
    // TODO: Debug uncomment // console.log(req.userAuthId)
    const user = await User.findById(req.userAuthId)
    // 7. Check if user has Shipping Address
    if (!user?.shippingAddress) {
        const error = new Error(
            `Please provide a shipping address for user [${user?.fullname}].`
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // TODO: Debug uncomment // console.log(user._id);
    // 8. Check if order is not empty
    if (orderItems?.length <= 0) {
        const error = new Error(`No Order Items.`)
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // 9. Create Order and save in DB
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        retailPrice: totalPrice,
        totalPrice: couponFound
            ? totalPrice - totalPrice * discount
            : totalPrice
    })
    // TODO: Debug uncomment //
    console.log(order)

    // 10. Update Product qty and sold qty

    const products = await Product.find({
        _id: { $in: orderItems }
    })
    // TODO: Debug uncomment // console.log(products)
    orderItems?.map(async order => {
        const product = products?.find(product => {
            return product?._id?.toString() === order?._id?.toString()
        })
        // TODO: Debug uncomment // console.log('[product :]', product)
        if (product) {
            product.totalSold += order.qty
        }
        await product.save()
    })

    // 11. Push Order into the user
    user.orders.push(order?._id)
    await user.save()

    // 12. Make Payment(Stripe)
    // convert order items to have same structure that stripe need
    const convertedOrders = orderItems.map(item => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item?.name,
                    description: item?.description
                },
                unit_amount: item?.price * 100
            },
            quantity: item?.qty
        }
    })
    const session = await stripe.checkout.sessions.create({
        line_items: convertedOrders,
        metadata: {
            orderId: JSON.stringify(order?._id) // replace order?._id with JSON.stringify()
        },
        mode: 'payment',
        success_url: 'http://127.0.0.1:3000/success',
        cancel_url: 'http://127.0.0.1:3000/cancel'
    })
    res.send({ url: session.url })
    // 7. Payment Webhook
    // 8. update the user order
})

// @desc    Get all orders
// @route   POST /api/v1/orders/list
// @access  Private/Admin
export const getAllOrdersCtrl = asyncHandler(async (req, res) => {
    // find all orders
    const orders = await Order.find()
    res.json({
        success: true,
        message: 'All orders fetched successfully',
        orders
    })
})
// @desc    Get specific orders
// @route   GET /api/v1/orders/list/:id
// @access  Private/Admin
export const getByIdOrderCtrl = asyncHandler(async (req, res) => {
    // get id from params
    const { id } = req.params
    const order = await Order.findById(id)
    res.json({
        success: true,
        message: 'Order fetched successfully',
        order
    })
})
// @desc    Update order to status of either (pending,processing,shipped,delivered)
// @route   PUT /api/v1/orders/update/:id
// @access  Private/Admin
export const updateByIdOrderCtrl = asyncHandler(async (req, res) => {
    // get id from params
    const { id } = req.params
    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
            status: req.body.status
        },
        {
            runValidators: true,
            new: true
        }
    )
    res.json({
        success: true,
        message: 'Order Updated successfully',
        updatedOrder
    })
})
// @desc    Delete order
// @route   DELETE /api/v1/orders/delete
// @access  Private/Admin
export const deleteByIdOrderCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params
    // TODO: debug uncomment // console.log(id)
    const order = await Category.findByIdAndDelete(id)
    if (order) {
        return res.status(200).json({
            status: 'success',
            message: `Order [${order?.orderNumber}] Deleted successfully.`,
            category
        })
    } else {
        return res.status(204).json({
            status: 'success',
            message: `Order Not found`
        })
    }
})
// @desc    get sales sum of orders
// @route   GET /api/v1/orders/sales/sum
// @access  Private/Admin
export const getOrdersStatsOrderCtrl = asyncHandler(
    async (req, res) => {
        // get order statistics
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    maximumSale: {
                        $max: '$totalPrice'
                    },
                    avgSale: {
                        $avg: '$totalPrice'
                    },
                    minimumSale: {
                        $min: '$totalPrice'
                    },
                    totalSales: {
                        $sum: '$totalPrice'
                    }
                }
            }
        ])

        // get the date
        const date = new Date()
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const saleToday = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: today,
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: {
                        $sum: "$totalPrice",
                    }
                }
            }
        ])
        res.status(200).json({
            success: true,
            message: 'Sum of Orders',
            orders,
            saleToday
        })
    }
)
