require('dotenv').config()
const express = require("express")
const cors = require("cors");
const connectDB = require('./config/mongodb');
const connectCloudinary = require('./config/cloudinary');
const { adminRouter } = require('./routes/admin.route');
const doctorRouter = require('./routes/doctor.route');
const userRouter = require('./routes/user.route');

const app = express();
const port = process.env.PORT || 8000
connectDB()
connectCloudinary()


app.use(express.json())
app.use(cors())

app.use('/admin', adminRouter)
app.use('/doctor', doctorRouter)
app.use('/user', userRouter)

app.listen(port, () => {
    console.log("http://localhost:8000 , SERVER STARTED")
})