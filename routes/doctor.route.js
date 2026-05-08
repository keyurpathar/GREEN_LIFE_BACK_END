const express = require('express')
const { doctorlist } = require('../controllers/doctor.controller')
const doctorRouter = express.Router()

doctorRouter.get('/list' , doctorlist)

module.exports = doctorRouter