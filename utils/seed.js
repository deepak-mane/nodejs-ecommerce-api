import mongoose from 'mongoose'

const dbConnect = async () => {
    try {
        const URL = 'mongodb://127.0.0.1:27017/ecomm'
        const connected = await mongoose.connect(URL)
        console.log(`[MongoDB] Connected ${connected.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}

dbConnect()

const seedProducts = [
    {
        name: 'ss',
        price: 33,
        category: 'xx'
    }
]

const seedDB = async () => {
    await Product.deleteMany({})
    await Product.insertMany(seedProducts)
}

seedDB().then(() => {
    mongoose.connection.close()
})

/*
https://javascript.plainenglish.io/seeding-mongodb-database-from-node-the-simplest-way-3d6a0c1c4668

Now you can run ‘node seeds.js’ command from your terminal to run the file and it will delete all the existing records in DB, if any, and will replace them with the ones you provided. If you don’t want to delete existing records, you can simply get rid of Product.deteleMany({}).

*/
