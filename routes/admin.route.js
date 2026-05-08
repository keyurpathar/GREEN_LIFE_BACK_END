const express = require("express");
const { addDoctor, loginAdmin, allDoctors } = require("../controllers/admin.controller");
const upload = require("../middlewares/multer");
const authAdmin = require("../middlewares/auth.admin");
const { changeAvailability } = require("../controllers/doctor.controller");
const adminRouter = express.Router()

adminRouter.post('/addDoctor', authAdmin ,  upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.get('/allDoctors' , authAdmin ,  allDoctors)
adminRouter.post('/changeavailability' , authAdmin , changeAvailability)


module.exports = {adminRouter}