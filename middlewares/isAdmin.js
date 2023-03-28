import User from '../models/UserModel.js'

export const isAdmin = async (req, res, next) => {
    // find the login user
    const user = await User.findById(req.userAuthId)
    // check if admin
    if(user?.isAdmin){
        next()
    } else {
        next(new Error('Access Denied, Admin Only'))
    }
}

export default isAdmin