import express from 'express'
import {
    createColorCtrl,
    deleteByIdColorCtrl,
    getAllColorsCtrl,
    getByIdColorCtrl,
    updateByIdColorCtrl
} from '../controllers/colorsCtrl.js'
import isAdmin from '../middlewares/isAdmin.js'
const colorsRouter = express.Router()
import isLoggedIn from '../middlewares/isLoggedIn.js'

colorsRouter.post('/create', isLoggedIn, isAdmin, createColorCtrl)
colorsRouter.get('/list', getAllColorsCtrl)
colorsRouter.get('/list/:id', getByIdColorCtrl)
colorsRouter.put('/update/:id', isLoggedIn, isAdmin, updateByIdColorCtrl)
colorsRouter.delete( 
    '/delete/:id',
    isLoggedIn,
    isAdmin,
    deleteByIdColorCtrl
)

export default colorsRouter

