import express from 'express'
import {
    createReviewCtrl,
    deleteByIdReviewCtrl,
    getAllReviewsCtrl,
    getByIdReviewCtrl,
    updateByIdReviewCtrl
} from '../controllers/reviewsCtrl.js'
import isAdmin from '../middlewares/isAdmin.js'
const reviewsRouter = express.Router()
import isLoggedIn from '../middlewares/isLoggedIn.js'

reviewsRouter.post(
    '/create/:productId',
    isLoggedIn,
    isAdmin,
    createReviewCtrl
)
reviewsRouter.get('/list', getAllReviewsCtrl)
reviewsRouter.get('/list/:id', getByIdReviewCtrl)
reviewsRouter.put(
    '/update/:id',
    isLoggedIn,
    isAdmin,
    updateByIdReviewCtrl
)
reviewsRouter.delete(
    '/delete/:id',
    isLoggedIn,
    isAdmin,
    deleteByIdReviewCtrl
)

export default reviewsRouter
