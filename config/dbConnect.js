import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        const URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/ecomm'
        const connected = await mongoose.connect(URL)
        console.log(`[MongoDB] Connected ${connected.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1)
    }
}

export default dbConnect;