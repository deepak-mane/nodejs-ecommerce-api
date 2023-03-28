import Coupon from '../models/CouponModel.js'
import asyncHandler from 'express-async-handler'
import slugify from 'slugify'

// @desc    Create new coupon
// @route   POST /api/v1/coupons/create
// @access  Private/Admin
export const createCouponCtrl = asyncHandler(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body
    // check if coupon  request data is incomplete ,
    if (!code || !startDate || !endDate || !discount) {
        const error = new Error(
            `Incomplete Request, Coupon cannot be created`
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }

    // check if admin
    // check if coupon exists
    const couponExists = await Coupon.findOne({
        code: code?.toUpperCase()
    })
    if (couponExists) {
        const error = new Error(
            `Coupon [${couponExists.code}] Already Exists.`
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // Check if discount is Number
    if (isNaN(discount)) {
        const error = new Error(`Discount value must be a number.`)
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // create coupon
    const coupon = await Coupon.create({
        code,
        startDate,
        endDate,
        discount,
        user: req.userAuthId
    })
    // send response
    return res.status(201).json({
        status: 'success',
        message: `Coupon [${coupon.code}] with validity [${startDate} , ${endDate}] created successfully.`,
        coupon
    })
})

// @desc    Get all coupons
// @route   GET  /api/v1/coupons/list
// @access  Public
export const getAllCouponsCtrl = asyncHandler(async (req, res) => {
    // TODO: Debug uncomment // console.log(req.query)
    // query
    let couponQuery = Coupon.find()

    // search by name
    if (req.query.name) {
        couponQuery = couponQuery.find({
            name: { $regex: req.query.name, $options: 'i' }
        })
    }

    // search by product
    if (req.query.coupon) {
        couponQuery = couponQuery.find({
            product: { $regex: req.query.product, $options: 'i' }
        })
    }

    // pagination
    // page - single page visible to user
    const page = parseInt(req.query.page)
        ? parseInt(req.query.page)
        : 1
    // limit - on single page how many records to retain
    const limit = parseInt(req.query.limit)
        ? parseInt(req.query.limit)
        : 10
    //  startIndex - starting
    const startIndex = (page - 1) * limit
    //  endIndex - ending
    const endIndex = page * limit
    // total result
    const total = await Coupon.countDocuments()

    couponQuery = couponQuery.skip(startIndex).limit(limit)
    // pagination results
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    // await the query
    const coupons = await couponQuery
    // TODO: Debug uncomment // console.log(coupons);
    return res.status(200).json({
        status: 'success',
        message: `Coupons fetched successfully.`,
        total,
        results: coupons.length,
        pagination,
        coupons
    })
})

// @desc    Get specific/single coupon
// @route   GET  /api/v1/coupons/list/:couponid
// @access  Public
export const getByIdCouponCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params
    // TODO: Debug uncomment // console.log(id)
    const coupon = await Coupon.findById(id)
    if (coupon) {
        return res.status(200).json({
            status: 'success',
            message: `Coupon [${coupon?.code}] fetched successfully.`,
            coupon
        })
    } else {
        return res.status(204).json({
            status: 'success',
            message: `Coupon Not found`
        })
    }
})
// @desc    Update specific/single coupon
// @route   PUT  /api/v1/coupons/update/:couponid
// @access  Admin/Private
export const updateByIdCouponCtrl = asyncHandler(async (req, res) => {
    // TODO: Debug uncomment //
    const { code, startDate, endDate, discount } = req.body

    //update
    const { id } = req.params
    // TODO: Debug uncomment //    console.log(id)
    // Slugify and then save in mongodb
    const coupon = await Coupon.findByIdAndUpdate(
        id,
        {
            code: code?.toUpperCase(),
            user: req.userAuthId,
            startDate,
            endDate,
            discount
        },
        {
            runValidators: true,
            new: true
        }
    )

    if (coupon) {
        return res.status(200).json({
            status: 'success',
            message: `Coupon [${coupon?.code}] Updated successfully.`,
            coupon
        })
    } else {
        return res.status(204).json({
            status: 'success',
            message: `Coupon Not found`
        })
    }
})
// @desc    Delete specific/single coupon
// @route   DELETE  /api/v1/coupons/delete/:productid
// @access  Admin/Private
export const deleteByIdCouponCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params
    // TODO: debug uncomment // console.log(id)
    const coupon = await Coupon.findByIdAndDelete(id)
    if (coupon) {
        return res.status(200).json({
            status: 'success',
            message: `Coupon [${coupon?.code}] Deleted successfully.`,
            coupon
        })
    } else {
        return res.status(204).json({
            status: 'success',
            message: `Coupon Not found`
        })
    }
})
