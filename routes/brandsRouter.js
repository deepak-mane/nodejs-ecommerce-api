import express from 'express'
import {
    createBrandCtrl,
    deleteByIdBrandCtrl,
    getAllBrandsCtrl,
    getByIdBrandCtrl,
    updateByIdBrandCtrl
} from '../controllers/brandsCtrl.js'
import isAdmin from '../middlewares/isAdmin.js'
const brandsRouter = express.Router()
import isLoggedIn from '../middlewares/isLoggedIn.js'

brandsRouter.post('/create', isLoggedIn, isAdmin, createBrandCtrl)
brandsRouter.get('/list', getAllBrandsCtrl)
brandsRouter.get('/list/:id', getByIdBrandCtrl)
brandsRouter.put(
    '/update/:id',
    isLoggedIn,
    isAdmin,
    updateByIdBrandCtrl
)
brandsRouter.delete(
    '/delete/:id',
    isLoggedIn,
    isAdmin,
    deleteByIdBrandCtrl
)

export default brandsRouter
