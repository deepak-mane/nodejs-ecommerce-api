import express from 'express'
import fileUpload from '../config/fileUpload.js'
import {
    createCategoryCtrl,
    deleteByIdCategoryCtrl,
    getAllCategoriesCtrl,
    getByIdCategoryCtrl,
    updateByIdCategoryCtrl
} from '../controllers/categoriesCtrl.js'
import isAdmin from '../middlewares/isAdmin.js'
const categoriesRouter = express.Router()
import isLoggedIn from '../middlewares/isLoggedIn.js'

categoriesRouter.post('/create', isLoggedIn, isAdmin, fileUpload.single('categoryImage'), createCategoryCtrl)
categoriesRouter.get('/list', getAllCategoriesCtrl)
categoriesRouter.get('/list/:id', getByIdCategoryCtrl)
categoriesRouter.put('/update/:id', isLoggedIn,  isAdmin,updateByIdCategoryCtrl)
categoriesRouter.delete( 
    '/delete/:id',
    isLoggedIn,
    isAdmin,
    deleteByIdCategoryCtrl
)

export default categoriesRouter

