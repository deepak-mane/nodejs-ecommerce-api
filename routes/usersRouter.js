import express from 'express'
import {
    loginUserCtrl,
    registerUserCtrl,
    getUserProfileUserCtrl,
    updateShippingAddressUserCtrl
} from '../controllers/usersCtrl.js'
const userRouter = express.Router()
import isLoggedIn from '../middlewares/isLoggedIn.js'

userRouter.post('/register', registerUserCtrl)
userRouter.post('/login', loginUserCtrl)
userRouter.get('/profile', isLoggedIn, getUserProfileUserCtrl)
userRouter.put(
    '/update/shipping',
    isLoggedIn,
    updateShippingAddressUserCtrl
)

export default userRouter
