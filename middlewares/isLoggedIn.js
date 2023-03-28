import getTokenFromHeader from '../utils/getTokenFromHeader.js'
import verifyToken from '../utils/verifyToken.js'

export const isLoggedIn = (req, res, next) => {
    // get token from header
    const token = getTokenFromHeader(req)
    // verify the token is valid
    const decodedUser = verifyToken(token)

    if (!decodedUser) {
        const error = new Error(
            'Invalid/Expired token, please login again.'
        )
        error.status = 401
        // TODO: debug uncomment // console.log(error);
        throw error
    } else {
        // save the user into req object
        req.userAuthId = decodedUser?.id
        next()
    }
}
export default isLoggedIn
