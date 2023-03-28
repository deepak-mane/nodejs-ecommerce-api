import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET , (err, decoded)=>{
        if(err){
            // TODO: Debug uncomment // return 'Token expired/invalid'
            return false
        } else {
            return decoded
        }
    })
}

export default verifyToken