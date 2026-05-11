const validator = require("validator")
const cloudinary = require('cloudinary').v2;
const doctormodel = require('../models/doctor.model')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctor.model");


// api for adding doctor 

const addDoctor = async (req, res) => {

    try {

        // console.log(req.body)
        // console.log(req.file)

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

        const parsedAddress = typeof address === "string" ? JSON.parse(address) : address

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
        console.log('❌ ERROR NAME:', err.name)
        console.log('❌ ERROR MESSAGE:', err.message)
        console.log('❌ FULL ERROR:', err)
        res.status(500).json({
            sucess: false, message: err.message
        })

    }

}

// api for login admin 

const loginAdmin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign({ email }, process.env.JWT_SECRET)

            res.status(200).json({
                success: true,
                token
            })

        } else {
            return res.status(401).json({
                success: false,
                message: "unvalid credentials"
            })
        }


    }

    catch (err) {
        res.status(500).json({
            sucess: false, message: err.message
        })

    }
}

// get all doctors list for admin panel 

const allDoctors = async (req,res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.status(200).json({
            success : true,
            message : "data fetched",
            doctors 
        })

        
    } catch (err) {
            
res.status(500).json({
            sucess: false, message: err.message
        })

    }
}

// api for updating doctor
const updateDoctor = async (req, res) => {
    try {
        const docId = req.params.id;
        const { name, email, speciality, degree, experience, about, fee, address } = req.body;
        const imageFile = req.file;

        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

        const updateData = {
            name: name || doctor.name,
            email: email || doctor.email,
            speciality: speciality || doctor.speciality,
            degree: degree || doctor.degree,
            experience: experience || doctor.experience,
            about: about || doctor.about,
            fee: fee || doctor.fee,
            address: parsedAddress || doctor.address
        };

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;
        }

        await doctorModel.findByIdAndUpdate(docId, updateData);

        res.status(200).json({ success: true, message: "Doctor updated successfully" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// api for deleting doctor
const deleteDoctor = async (req, res) => {
    try {
        const docId = req.params.id;
        await doctorModel.findByIdAndDelete(docId);
        res.status(200).json({ success: true, message: "Doctor deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { addDoctor, loginAdmin, allDoctors, updateDoctor, deleteDoctor }