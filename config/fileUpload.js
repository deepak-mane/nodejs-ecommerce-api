import cloudinaryPackage from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

const cloudinary = cloudinaryPackage.v2
// TODO: Debug uncomment //
/*
console.log(process.env.CLOUDINARY_CLOUD_NAME)
console.log(process.env.CLOUDINARY_API_KEY)
console.log(process.env.CLOUDINARY_API_SECRET_KEY)
*/

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
})
// create storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'jpeg'],
    params: {
        folder: 'Ecommerce-api'
    }
})
// Init multer with storage engine
const fileUpload = multer({ storage: storage })

export default fileUpload
