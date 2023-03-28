import Color from '../models/ColorModel.js'
import asyncHandler from 'express-async-handler'
import slugify from 'slugify'

// @desc    Create new color
// @route   POST /api/v1/colors/create
// @access  Private/Admin
export const createColorCtrl = asyncHandler(async (req, res) => {
    const { name, user, image, products } = req.body
    // check if color request data is incomplete , no need to check for image as default is provided in model
    if (!name) {
        const error = new Error(
            `Incomplete Request, color cannot be created`
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // check if color already exists
    const colorExists = await Color.findOne({ name: name.toLowerCase() })
    if (colorExists) {
        const error = new Error(`Color ${name} already exists, choose a new one.`)
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // create color
    // Slugify and then save in mongodb
    const color = await Color.create({
        name: name.toLowerCase(),
        slug: slugify(name),
        user: req.userAuthId,
    })

    return res.status(201).json({
        status: 'success',
        message: `Color [${color.name}] created successfully.`,
        color
    })
})

// @desc    Get all colors
// @route   GET  /api/v1/colors/list
// @access  Public
export const getAllColorsCtrl = asyncHandler(
    async (req, res) => {
        // TODO: Debug uncomment // console.log(req.query)
        // query
        let colorQuery = Color.find()

        // search by name
        if (req.query.name) {
            colorQuery = colorQuery.find({
                name: { $regex: req.query.name, $options: 'i' }
            })
        }

        // search by product
        if (req.query.color) {
            colorQuery = colorQuery.find({
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
        const total = await Color.countDocuments()

        colorQuery = colorQuery.skip(startIndex).limit(limit)
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
        const colors = await colorQuery
        // TODO: Debug uncomment // console.log(colors);
        return res.status(200).json({
            status: 'success',
            message: `Colors fetched successfully.`,
            total,
            results: colors.length,
            pagination,
            colors
        })
    }
)

// @desc    Get specific/single color
// @route   GET  /api/v1/colors/list/:colorid
// @access  Public
export const getByIdColorCtrl = asyncHandler(
    async (req, res) => {
        // TODO: Debug uncomment //

        const { id } = req.params
        console.log(id)
        const color = await Color.findById(id)
        if (color) {
            return res.status(200).json({
                status: 'success',
                message: `Color [${color?.name}] fetched successfully.`,
                color
            })
        } else {
            return res.status(204).json({
                status: 'success',
                message: `Color Not found`
            })
        }
    }
)
// @desc    Update specific/single color
// @route   PUT  /api/v1/colors/update/:colorid
// @access  Admin/Private
export const updateByIdColorCtrl = asyncHandler(
    async (req, res) => {
        // TODO: Debug uncomment //
        const { name, user, image, products } = req.body

        //update
        const { id } = req.params
        // TODO: Debug uncomment //    console.log(id)
        // Slugify and then save in mongodb
        const color = await Color.findByIdAndUpdate(
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

        if (color) {
            return res.status(200).json({
                status: 'success',
                message: `Color [${color?.name}] Updated successfully.`,
                color
            })
        } else {
            return res.status(204).json({
                status: 'success',
                message: `Color Not found`
            })
        }
    }
)
// @desc    Delete specific/single color
// @route   DELETE  /api/v1/colors/delete/:productid
// @access  Admin/Private
export const deleteByIdColorCtrl = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        // TODO: debug uncomment // console.log(id)
        const color = await Color.findByIdAndDelete(id)
        if (color) {
            return res.status(200).json({
                status: 'success',
                message: `Color [${color?.name}] Deleted successfully.`,
                color
            })
        } else {
            return res.status(204).json({
                status: 'success',
                message: `Color Not found`
            })
        }
    }
)
