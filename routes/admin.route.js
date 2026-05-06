const express = require("express");
const { addDoctor, loginAdmin } = require("../controllers/admin.controller");
const upload = require("../middlewares/multer");
const authAdmin = require("../middlewares/auth.admin");
const adminRouter = express.Router()

adminRouter.post('/addDoctor', authAdmin ,  upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)


module.exports = {adminRouter}