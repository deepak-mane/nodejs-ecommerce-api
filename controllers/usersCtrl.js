import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import User from '../models/UserModel.js'
import generateToken from '../utils/generateToken.js'
import getTokenFromHeader from '../utils/getTokenFromHeader.js'
import verifyToken from '../utils/verifyToken.js'

// @desc    Register user
// @route   POST /api/v1/users/register
// @access  Private/Admin
export const registerUserCtrl = asyncHandler(async (req, res) => {
    // Check if user exist
    const { fullname, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        const error = new Error('User already registered')
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    }
    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    // create the user
    const user = await User.create({
        email,
        fullname,
        password: hashedPassword
    })
    return res.status(201).json({
        status: 'success',
        message: 'User Registered Successfully.',
        user
    })
})
// @desc    Login user
// @route   POST /api/v1/users/login
// @access  Public
export const loginUserCtrl = asyncHandler(async (req, res) => {
    // Check if user exist
    const { email, password } = req.body
    const userFound = await User.findOne({ email })
    if (!userFound) {
        const error = new Error('Invalid login credentials')
        error.status = 404
        // TODO: debug uncomment // console.log(error);
        throw error
    }

    const validatePassword = await bcrypt.compare(
        password,
        userFound.password
    )
    // TODO: Debug uncomment // console.log(validatePassword);
    let token = ''
    if (!validatePassword) {
        const error = new Error('Invalid password')
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    } else {
        // generate token
        token = generateToken(userFound?._id)
    }

    return res.status(201).json({
        status: 'success',
        message: 'User logged in Successfully.',
        userFound,
        token
    })
})
// @desc    Get User Profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfileUserCtrl = asyncHandler(
    async (req, res) => {
    // find the user
    const user = await User.findById(req.userAuthId).populate('orders')

    res.json({
        status: 'success',
        message: 'User profile fetched successfully.',
        user,
    })
    }
)
// @desc    Update ShippingAddress in  User Profile
// @route   PUT /api/v1/users/update/shipping
// @access  Private
export const updateShippingAddressUserCtrl = asyncHandler(
    async (req, res) => {
        const {firstName,lastName,address,city,postalCode,province,country,phone} = req.body
        const user = await User.findByIdAndUpdate(req.userAuthId,{
            shippingAddress: {
                firstName,
                lastName,
                address,
                city,
                postalCode,
                province,
                country,
                phone
            },
            hasShippingAddress: true,
        }, {
            runValidators: true,
            new: true,
        }).select('-password').select('-isAdmin')
        // send response
        return res.status(201).json({
            status: 'success',
            message: 'User Shipping Address Updated Successfully.',
            user,
        })
    }
)