const express = require("express");
const { addDoctor, loginAdmin, allDoctors, updateDoctor, deleteDoctor } = require("../controllers/admin.controller");
const upload = require("../middlewares/multer");
const authAdmin = require("../middlewares/auth.admin");
const { changeAvailability } = require("../controllers/doctor.controller");
const adminRouter = express.Router()

adminRouter.post('/addDoctor', authAdmin ,  upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.get('/allDoctors' , authAdmin ,  allDoctors)
adminRouter.post('/changeavailability' , authAdmin , changeAvailability)
adminRouter.post('/updateDoctor/:id', authAdmin, upload.single('image'), updateDoctor)
adminRouter.delete('/deleteDoctor/:id', authAdmin, deleteDoctor)

module.exports = {adminRouter}