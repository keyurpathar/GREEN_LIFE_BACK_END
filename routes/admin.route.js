const express = require("express");
const { addDoctor } = require("../controllers/admin.controller");
const upload = require("../middlewares/multer");
const adminRouter = express.Router()

adminRouter.post('/addDoctor', upload.single('image'), addDoctor)


module.exports = {adminRouter}