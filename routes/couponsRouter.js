import express from 'express'
import {
    createCouponCtrl,
    deleteByIdCouponCtrl,
    getAllCouponsCtrl,
    getByIdCouponCtrl,
    updateByIdCouponCtrl
} from '../controllers/couponsCtrl.js'
import isAdmin from '../middlewares/isAdmin.js'
const couponsRouter = express.Router()
import isLoggedIn from '../middlewares/isLoggedIn.js'

couponsRouter.post('/create', isLoggedIn, isAdmin, createCouponCtrl)
couponsRouter.get('/list', getAllCouponsCtrl)
couponsRouter.get('/list/:id', getByIdCouponCtrl)
couponsRouter.put(
    '/update/:id',
    isLoggedIn,
    isAdmin,
    updateByIdCouponCtrl
)
couponsRouter.delete(
    '/delete/:id',
    isLoggedIn,
    isAdmin,
    deleteByIdCouponCtrl
)

export default couponsRouter
