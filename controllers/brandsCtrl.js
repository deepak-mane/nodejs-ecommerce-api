import Brand from '../models/BrandModel.js'
import asyncHandler from 'express-async-handler'
import slugify from 'slugify'

// @desc    Create new brand
// @route   POST /api/v1/brands/create
// @access  Private/Admin
export const createBrandCtrl = asyncHandler(async (req, res) => {
    const { name, user, image, products } = req.body
    // check if brand request data is incomplete , no need to check for image as default is provided in model
    if (!name ) {
        const error = new Error(
            `Incomplete Request, brand cannot be created`
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // check if brand already exists
    const brandExists = await Brand.findOne({ name: name.toLowerCase() })
    if (brandExists) {
        const error = new Error(`Brand [${name}] already exists, choose a new one.`)
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // create brand
    // Slugify and then save in mongodb
    const brand = await Brand.create({
        name: name.toLowerCase(),
        slug: slugify(name),
        user: req.userAuthId,
    })

    return res.status(201).json({
        status: 'success',
        message: `Brand [${brand.name}] created successfully.`,
        brand
    })
})

// @desc    Get all brands
// @route   GET  /api/v1/brands/list
// @access  Public
export const getAllBrandsCtrl = asyncHandler(
    async (req, res) => {
        // TODO: Debug uncomment // console.log(req.query)
        // query
        let brandQuery = Brand.find()

        // search by name
        if (req.query.name) {
            brandQuery = brandQuery.find({
                name: { $regex: req.query.name, $options: 'i' }
            })
        }

        // search by product
        if (req.query.brand) {
            brandQuery = brandQuery.find({
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
        const total = await Brand.countDocuments()

        brandQuery = brandQuery.skip(startIndex).limit(limit)
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
        const brands = await brandQuery
        // TODO: Debug uncomment // console.log(brands);
        return res.status(200).json({
            status: 'success',
            message: `Brands fetched successfully.`,
            total,
            results: brands.length,
            pagination,
            brands
        })
    }
)

// @desc    Get specific/single brand
// @route   GET  /api/v1/brands/list/:brandid
// @access  Public
export const getByIdBrandCtrl = asyncHandler(
    async (req, res) => {
        // TODO: Debug uncomment //

        const { id } = req.params
        console.log(id)
        const brand = await Brand.findById(id)
        if (brand) {
            return res.status(200).json({
                status: 'success',
                message: `Brand [${brand?.name}] fetched successfully.`,
                brand
            })
        } else {
            return res.status(204).json({
                status: 'success',
                message: `Brand Not found`
            })
        }
    }
)
// @desc    Update specific/single brand
// @route   PUT  /api/v1/brands/update/:brandid
// @access  Admin/Private
export const updateByIdBrandCtrl = asyncHandler(
    async (req, res) => {
        // TODO: Debug uncomment //
        const { name, user, image, products } = req.body

        //update
        const { id } = req.params
        // TODO: Debug uncomment //    console.log(id)
        // Slugify and then save in mongodb
        const brand = await Brand.findByIdAndUpdate(
            id,
            {
                name,
                user: req.userAuthId,
                slug: slugify(name),
            },
            {
                runValidators: true,
                new: true
            }
        )

        if (brand) {
            return res.status(200).json({
                status: 'success',
                message: `Brand [${brand?.name}] Updated successfully.`,
                brand
            })
        } else {
            return res.status(204).json({
                status: 'success',
                message: `Brand Not found`
            })
        }
    }
)
// @desc    Delete specific/single brand
// @route   DELETE  /api/v1/brands/delete/:productid
// @access  Admin/Private
export const deleteByIdBrandCtrl = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        // TODO: debug uncomment // console.log(id)
        const brand = await Brand.findByIdAndDelete(id)
        if (brand) {
            return res.status(200).json({
                status: 'success',
                message: `Brand [${brand?.name}] Deleted successfully.`,
                brand
            })
        } else {
            return res.status(204).json({
                status: 'success',
                message: `Brand Not found`
            })
        }
    }
)
