import Brand from '../models/BrandModel.js'
import Product from '../models/ProductModel.js'
import Category from '../models/CategoryModel.js'
import asyncHandler from 'express-async-handler'
import slugify from 'slugify'

// @desc    Create new product
// @route   POST /api/v1/products/create
// @access  Private/Admin
export const createProductCtrl = asyncHandler(async (req, res) => {
    
    const {
        name,
        brand,
        description,
        category,
        sizes,
        colors,
        price,
        totalQty
    } = req.body
    const convertedImgs = req.files.map((file) => file?.path);
    // check if product request data is incomplete
    if (
        !name ||
        !brand ||
        !description ||
        !category ||
        !sizes ||
        !colors ||
        !price ||
        !totalQty ||
        !convertedImgs
    ) {
        const error = new Error(
            `Incomplete Request, product cannot be created`
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // check if product already exists
    const productExists = await Product.findOne({ name })
    if (productExists) {
        const error = new Error(`Product [${name}] already exists`)
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }

    // find the brand
    const brandFound = await Brand.findOne({
        name: brand?.toLowerCase(),
    })
    if (!brandFound) {
        const error = new Error(
            `Brand [${brand}] Not Found, please create brand first or check brand name.`
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }

    // find the category
    const categoryFound = await Category.findOne({
        name: category?.toLowerCase(),
    })
    if (!categoryFound) {
        const error = new Error(
            `Category [${category}] Not Found, please create category first or check category name.`
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }

    // create product
    // Slugify and then save in mongodb
    // TODO: debug uncomment //   console.log(req.files);
    const product = await Product.create({
        name,
        slug: slugify(name),
        brand: brand.toLowerCase(),
        description,
        category: category.toLowerCase(),
        sizes: sizes.toUpperCase(),
        colors: colors.toLowerCase(),
        user: req.userAuthId,
        price,
        totalQty,
        images : convertedImgs,
    })

    // Push the product into brand
    brandFound.products.push(product?._id)
    //resave
    await brandFound.save()

    // Push the product into category
    categoryFound.products.push(product?._id)
    //resave
    await categoryFound.save()

    return res.status(201).json({
        status: 'success',
        message: `Product [${product.name}] created successfully.`,
        product,
    })
})

// @desc    Get all products
// @route   GET  /api/v1/products/list
// @access  Public
export const getAllProductsCtrl = asyncHandler(async (req, res) => {
    // TODO: Debug uncomment // console.log(req.query)
    // query
    let productQuery = Product.find()

    // search by name
    if (req.query.name) {
        productQuery = productQuery.find({
            name: { $regex: req.query.name, $options: 'i' }
        })
    }

    // search by brand
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand: { $regex: req.query.brand, $options: 'i' }
        })
    }

    // search by category
    if (req.query.category) {
        productQuery = productQuery.find({
            category: { $regex: req.query.category, $options: 'i' }
        })
    }
    // search by colors
    if (req.query.colors) {
        productQuery = productQuery.find({
            colors: { $regex: req.query.colors, $options: 'i' }
        })
    }
    // search by sizes
    if (req.query.sizes) {
        productQuery = productQuery.find({
            sizes: { $regex: req.query.sizes, $options: 'i' }
        })
    }
    // filter by price range
    if (req.query.price) {
        const priceRange = req.query.price.split('-')
        // gte: greater than or equal to
        // lte: less than or equal to
        productQuery = productQuery.find({
            price: { $gte: priceRange[0], $lte: priceRange[1] }
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
    const total = await Product.countDocuments()

    productQuery = productQuery.skip(startIndex).limit(limit)
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
    const products = await productQuery.populate('reviews')
    // TODO: Debug uncomment // console.log(products);
    return res.status(200).json({
        status: 'success',
        message: `Products fetched successfully.`,
        total,
        results: products.length,
        pagination,
        products
    })
})

// @desc    Get specific/single product
// @route   GET  /api/v1/products/list/:productid
// @access  Public
export const getByIdProductCtrl = asyncHandler(async (req, res) => {
    // TODO: Debug uncomment //

    const { id } = req.params
    console.log(id)
    const product = await Product.findById(id).populate('reviews')
    if (product) {
        return res.status(200).json({
            status: 'success',
            message: `Product [${product?.name}] fetched successfully.`,
            product
        })
    } else {
        return res.status(204).json({
            status: 'success',
            message: `Product Not found`
        })
    }
})
// @desc    Update specific/single product
// @route   PUT  /api/v1/products/update/:productid
// @access  Admin/Private
export const updateByIdProductCtrl = asyncHandler(async (req, res) => {
    // TODO: Debug uncomment //
    const {
        name,
        brand,
        description,
        category,
        sizes,
        colors,
        user,
        price,
        totalQty
    } = req.body

    //update
    const { id } = req.params
    // TODO: Debug uncomment //    console.log(id)
    // Slugify and then save in mongodb
    const product = await Product.findByIdAndUpdate(
        id,
        {
            name,
            slug: slugify(name),
            brand,
            description,
            category,
            sizes,
            colors,
            user,
            price,
            totalQty
        },
        {
            runValidators: true,
            new: true
        }
    )

    if (product) {
        return res.status(200).json({
            status: 'success',
            message: `Product [${product?.name}] Updated successfully.`,
            product
        })
    } else {
        return res.status(204).json({
            status: 'success',
            message: `Product Not found`
        })
    }
})
// @desc    Delete specific/single product
// @route   DELETE  /api/v1/products/delete/:productid
// @access  Admin/Private
export const deleteByIdProductCtrl = asyncHandler(async (req, res) => {
    // TODO: Debug uncomment //

    const { id } = req.params
    // TODO: debug uncomment // console.log(id)
    const product = await Product.findByIdAndDelete(id)
    if (product) {
        return res.status(200).json({
            status: 'success',
            message: `Product [${product?.name}] Deleted successfully.`,
            product
        })
    } else {
        return res.status(204).json({
            status: 'success',
            message: `Product Not found`
        })
    }
})
