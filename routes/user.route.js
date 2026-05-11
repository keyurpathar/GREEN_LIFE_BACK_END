const express = require("express");
const { registerUser , loginUser, getProfile, updateProfile, bookAppointment } = require("../controllers/user.controller");
const authUser = require("../middlewares/auth.user");
const upload = require("../middlewares/multer");
const userRouter = express.Router();

userRouter.post('/register' , registerUser)
userRouter.post('/login' , loginUser)

userRouter.get('/profile' ,authUser, getProfile)
userRouter.post('/profile/update' ,authUser, upload.single('image') , updateProfile)
userRouter.post('/bookAppointment' ,authUser, bookAppointment)


module.exports = userRouter