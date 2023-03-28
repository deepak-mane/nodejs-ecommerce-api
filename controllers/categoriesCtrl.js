import Category from '../models/CategoryModel.js'
import asyncHandler from 'express-async-handler'
import slugify from 'slugify'

// @desc    Create new category
// @route   POST /api/v1/categories/create
// @access  Private/Admin
export const createCategoryCtrl = asyncHandler(async (req, res) => {
    const { name, user, image, products } = req.body
    // check if category request data is incomplete , no need to check for image as default is provided in model
    if (!name ) {
        const error = new Error(
            `Incomplete Request, category cannot be created`
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // check if category already exists
    const categoryExists = await Category.findOne({ name: name.toLowerCase() })
    if (categoryExists) {
        const error = new Error(`Category [${name}] already exists, choose a new one.`)
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }

    // create category
    // Slugify and then save in mongodb
    // TODO: debug uncomment //  console.log(req.file);
    const category = await Category.create({
        name: name.toLowerCase(),
        slug: slugify(name),
        user: req.userAuthId,
        image: req.file.path,
    })

    return res.status(201).json({
        status: 'success',
        message: `Category [${category.name}] created successfully.`,
        category
    })
})
// @desc    Get all categories
// @route   GET  /api/v1/categories/list
// @access  Public
export const getAllCategoriesCtrl = asyncHandler(
    async (req, res) => {
        // TODO: Debug uncomment // console.log(req.query)
        // query
        let categoryQuery = Category.find()

        // search by name
        if (req.query.name) {
            categoryQuery = categoryQuery.find({
                name: { $regex: req.query.name, $options: 'i' }
            })
        }

        // search by product
        if (req.query.category) {
            categoryQuery = categoryQuery.find({
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
        const total = await Category.countDocuments()

        categoryQuery = categoryQuery.skip(startIndex).limit(limit)
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
        const categories = await categoryQuery
        // TODO: Debug uncomment // console.log(categories);
        return res.status(200).json({
            status: 'success',
            message: `Categories fetched successfully.`,
            total,
            results: categories.length,
            pagination,
            categories
        })
    }
)

// @desc    Get specific/single category
// @route   GET  /api/v1/categories/list/:categoryid
// @access  Public
export const getByIdCategoryCtrl = asyncHandler(
    async (req, res) => {
        // TODO: Debug uncomment //

        const { id } = req.params
        console.log(id)
        const category = await Category.findById(id)
        if (category) {
            return res.status(200).json({
                status: 'success',
                message: `Category [${category?.name}] fetched successfully.`,
                category
            })
        } else {
            return res.status(204).json({
                status: 'success',
                message: `Category Not found`
            })
        }
    }
)
// @desc    Update specific/single category
// @route   PUT  /api/v1/categories/update/:categoryid
// @access  Admin/Private
export const updateByIdCategoryCtrl = asyncHandler(
    async (req, res) => {
        // TODO: Debug uncomment //
        const { name, user, image, products } = req.body

        //update
        const { id } = req.params
        // TODO: Debug uncomment //    console.log(id)
        // Slugify and then save in mongodb
        const category = await Category.findByIdAndUpdate(
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

        if (category) {
            return res.status(200).json({
                status: 'success',
                message: `Category [${category?.name}] Updated successfully.`,
                category
            })
        } else {
            return res.status(204).json({
                status: 'success',
                message: `Category Not found`
            })
        }
    }
)
// @desc    Delete specific/single category
// @route   DELETE  /api/v1/categories/delete/:productid
// @access  Admin/Private
export const deleteByIdCategoryCtrl = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        // TODO: debug uncomment // console.log(id)
        const category = await Category.findByIdAndDelete(id)
        if (category) {
            return res.status(200).json({
                status: 'success',
                message: `Category [${category?.name}] Deleted successfully.`,
                category
            })
        } else {
            return res.status(204).json({
                status: 'success',
                message: `Category Not found`
            })
        }
    }
)
