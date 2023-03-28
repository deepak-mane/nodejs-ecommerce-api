import express from 'express'
import fileUpload from '../config/fileUpload.js'
import {
    createProductCtrl,
    deleteByIdProductCtrl,
    getAllProductsCtrl,
    getByIdProductCtrl,
    updateByIdProductCtrl
} from '../controllers/productsCtrl.js'
import isAdmin from '../middlewares/isAdmin.js'
const productsRouter = express.Router()
import isLoggedIn from '../middlewares/isLoggedIn.js'

//  fileUpload.single('productImage') for single image upload using multer
productsRouter.post(
    '/create',
    isLoggedIn,
    isAdmin,
    fileUpload.array('productImages'),
    createProductCtrl
)
productsRouter.get('/list', getAllProductsCtrl)
productsRouter.get('/list/:id', getByIdProductCtrl)
productsRouter.put(
    '/update/:id',
    isLoggedIn,
    isAdmin,
    updateByIdProductCtrl
)
productsRouter.delete(
    '/delete/:id',
    isLoggedIn,
    isAdmin,
    deleteByIdProductCtrl
)

export default productsRouter
