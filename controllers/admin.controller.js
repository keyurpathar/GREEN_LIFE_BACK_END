const validator = require("validator")
const cloudinary = require('cloudinary').v2;
const doctormodel = require('../models/doctor.model')
const bcrypt = require('bcrypt')


// api for adding doctor 

const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fee, address } = req.body;

        const imageFile = req.file

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fee || !address || !imageFile) {
            return res.status(400).json({
                sucess: false,
                message: "missing details"
            })
        }

        if (!validator.isEmail(email)) return res.status(400).json({
            sucess: false,
            message: "please enter an valid email"
        })

        if (password.length < 8) return res.status(400).json({
            sucess: false,
            message: "password must be at least 8 characters"
        })

        const hashedpassword = await bcrypt.hash(password, 12)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type:
                "image"
        })

        const imageurl = imageUpload.secure_url

        const parsedAddress = typeof address === "string" ? JSON.parse(address)  : address

        const doctorData = {
            name, email, image: imageurl, password: hashedpassword, speciality, degree, experience, about, fee,
            address: parsedAddress, date: Date.now()
        }

        const newDoctor = new doctormodel(doctorData)
        await newDoctor.save()

        res.status(201).json({
            success: true, msg: "data added"
        })

    }

    catch (err) {
        res.status(500).json({
            sucess: false, message: err.message
        })

    }

}

module.exports = { addDoctor }