import express from 'express'
import {
    createOrderCtrl,
    deleteByIdOrderCtrl,
    getAllOrdersCtrl,
    getByIdOrderCtrl,
    updateByIdOrderCtrl,
    getOrdersStatsOrderCtrl
} from '../controllers/ordersCtrl.js'
import isAdmin from '../middlewares/isAdmin.js'
const ordersRouter = express.Router()
import isLoggedIn from '../middlewares/isLoggedIn.js'

ordersRouter.post('/create', isLoggedIn, createOrderCtrl)
ordersRouter.get('/list', getAllOrdersCtrl)
ordersRouter.get('/list/:id', getByIdOrderCtrl)
ordersRouter.put('/update/:id', isLoggedIn,  isAdmin,updateByIdOrderCtrl)
ordersRouter.delete( 
    '/delete/:id',
    isLoggedIn,
    deleteByIdOrderCtrl
)
ordersRouter.get('/sales/stats', isLoggedIn,  isAdmin,getOrdersStatsOrderCtrl)
export default ordersRouter

