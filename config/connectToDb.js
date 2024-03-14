const mongoose = require('mongoose')

module.exports = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to DB')
    } catch (error) {
        console.log('connection failed to DB!', error)
    }
}