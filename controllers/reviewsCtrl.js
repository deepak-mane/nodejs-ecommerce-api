import Review from '../models/ReviewModel.js'
import Product from '../models/ProductModel.js'
import asyncHandler from 'express-async-handler'
import slugify from 'slugify'

// @desc    Create new review
// @route   POST /api/v1/reviews/create
// @access  Private/Admin
export const createReviewCtrl = asyncHandler(async (req, res) => {
    const { product, message, rating } = req.body
    // check if review request data is incomplete , no need to check for image as default is provided in model
    if (!message || !rating) {
        const error = new Error(
            `Incomplete Request, review cannot be created`
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }

    // 1. Find product you want to review
    const { productId } = req.params
    // TODO: debug uncomment // console.log(productId)

    // check if product exists
    const productFound = await Product.findById(productId).populate('reviews')
    if (!productFound) {
        const error = new Error(`Product not found!!!.`)
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }

    // check if user already reviewed this product
    const hasReviewed = productFound?.reviews?.find((review)=> {
        console.log(review);
        // this means same user has written a review for this product
        return review?.user?.toString()  === req?.userAuthId?.toString() 
    })

    // TODO: debug uncomment // console.log('[createReviewCtrl func] value of hasReviewed : ',hasReviewed);
    if (hasReviewed) {
        const error = new Error(`You have Already reviewed this product.`)
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    
    // create review
    const review = await Review.create({
        message,
        rating,
        user: req.userAuthId,
        product: productFound?._id,
    })

    // Push reviews into productFound
    productFound.reviews.push(review?._id)
    //resave
    await productFound.save()

    return res.status(201).json({
        status: 'success',
        message: `Review for product [${productFound?.name}] created successfully.`,
        // review
    })
})

// @desc    Get all reviews
// @route   GET  /api/v1/reviews/list
// @access  Public
export const getAllReviewsCtrl = asyncHandler(async (req, res) => {
    // TODO: Debug uncomment // console.log(req.query)
    // query
    let reviewQuery = Review.find()

    // search by name
    if (req.query.name) {
        reviewQuery = reviewQuery.find({
            name: { $regex: req.query.name, $options: 'i' }
        })
    }

    // search by product
    if (req.query.review) {
        reviewQuery = reviewQuery.find({
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
    const total = await Review.countDocuments()

    reviewQuery = reviewQuery.skip(startIndex).limit(limit)
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
    const reviews = await reviewQuery
    // TODO: Debug uncomment // console.log(reviews);
    return res.status(200).json({
        status: 'success',
        message: `Reviews fetched successfully.`,
        total,
        results: reviews.length,
        pagination,
        reviews
    })
})

// @desc    Get specific/single review
// @route   GET  /api/v1/reviews/list/:reviewid
// @access  Public
export const getByIdReviewCtrl = asyncHandler(async (req, res) => {
    // TODO: Debug uncomment //

    const { id } = req.params
    console.log(id)
    const review = await Review.findById(id)
    if (review) {
        return res.status(200).json({
            status: 'success',
            message: `Review [${review?.name}] fetched successfully.`,
            review
        })
    } else {
        return res.status(204).json({
            status: 'success',
            message: `Review Not found`
        })
    }
})
// @desc    Update specific/single review
// @route   PUT  /api/v1/reviews/update/:reviewid
// @access  Admin/Private
export const updateByIdReviewCtrl = asyncHandler(async (req, res) => {
    // TODO: Debug uncomment //
    const { name, user, image, products } = req.body

    //update
    const { id } = req.params
    // TODO: Debug uncomment //    console.log(id)
    // Slugify and then save in mongodb
    const review = await Review.findByIdAndUpdate(
        id,
        {
            name,
            user: req.userAuthId,
            slug: slugify(name)
        },
        {
            runValidators: true,
            new: true
        }
    )

    if (review) {
        return res.status(200).json({
            status: 'success',
            message: `Review [${review?.name}] Updated successfully.`,
            review
        })
    } else {
        return res.status(204).json({
            status: 'success',
            message: `Review Not found`
        })
    }
})
// @desc    Delete specific/single review
// @route   DELETE  /api/v1/reviews/delete/:productid
// @access  Admin/Private
export const deleteByIdReviewCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params
    // TODO: debug uncomment // console.log(id)
    const review = await Review.findByIdAndDelete(id)
    if (review) {
        return res.status(200).json({
            status: 'success',
            message: `Review [${review?.name}] Deleted successfully.`,
            review
        })
    } else {
        return res.status(204).json({
            status: 'success',
            message: `Review Not found`
        })
    }
})
