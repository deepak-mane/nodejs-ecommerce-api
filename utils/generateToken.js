import jwt from 'jsonwebtoken'

const generateToken = id => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        return token
    } catch (error) {
        throw new Error('Error signing token: ' + error)
    }
}

export default generateToken
