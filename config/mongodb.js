const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("database connected")
}

module.exports = connectDB