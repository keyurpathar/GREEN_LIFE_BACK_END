const validator = require('validator')
const bcrypt = require('bcrypt')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;
const doctorModel = require('../models/doctor.model')
const appointmentModel = require('../models/appointment.model')


// api to register an new user 
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedpassword = await bcrypt.hash(password, 12);

        const userData = {
            name, email, password: hashedpassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ success: true, message: "User registered successfully", token, data: newUser });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ success: true, message: "User logged in successfully", token, data: user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// api to get user profile page data 

const getProfile = async (req, res) => {

    try {

        const { userId } = req.body;

        if (!userId) {

            return res.status(400).json({ message: "User ID is required" });

        }

        const user = await userModel.findById(userId).select("-password");

        res.status(200).json({ success: true, message: "User profile fetched successfully", data: user });

    } catch (error) {
        
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
        
    }
}

const updateProfile = async (req, res) => {
    
    try {

        const { name , email, phone , address , dob , gender} = req.body;
        const userId = req.body.userId || req.user_id;
        const imageFile = req.file;

        const missingFields = [];
        if (!userId) missingFields.push('userId');
        if (!name) missingFields.push('name');
        if (!phone) missingFields.push('phone');
        if (!address) missingFields.push('address');
        if (!dob) missingFields.push('dob');
        if (!gender) missingFields.push('gender');

        if (missingFields.length > 0) {
            return res.status(400).json({ message: "Missing fields: " + missingFields.join(', '), receivedBody: req.body });
        }

        let parsedAddress = address;

        try {
            if (typeof address === 'string') {
                parsedAddress = JSON.parse(address);
            }
        } catch (e) {
            console.log("Error parsing address", e);
        }

        const updateData = { name, email, phone, address: parsedAddress, dob, gender };

        const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

        if(imageFile){
            const uploadedImage = await cloudinary.uploader.upload(imageFile.path);
            user.image = uploadedImage.secure_url;
            await userModel.findByIdAndUpdate(userId, {image: user.image});
        }

        res.status(200).json({ success: true, message: "User profile updated successfully", data: user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
    }
}

// api to book an appointment 

const bookAppointment = async (req, res) => {
    
    try {

        const { userId , docId , slotDate , slotTime , amount} = req.body;

        const doctorData = await doctorModel.findById(docId).select("-password");

        if(!doctorData.available){
            return res.status(404).json({ success: false, message: "Doctor not available" });
        }
      

       let slots_booked = doctorData.slots_booked

       if(slots_booked[slotDate]){
           if(slots_booked[slotDate].includes(slotTime)){
            return res.json({
                success : false ,
                message : "Slot already booked"
            })
           }else{
            slots_booked[slotDate].push(slotTime)
           }

        }else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password");

        delete doctorData.slots_booked ;

        const appointmentdata = {
            userId , docId , userData , doctorData , amount : doctorData.fee , slotDate , slotTime ,
            date : Date.now()
        }

        const newAppointment = new appointmentModel(appointmentdata);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId , {slots_booked});    

        return res.status(200).json({
            success : true ,
            message : "Appointment booked successfully",
            data : newAppointment
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
    }
}

module.exports = { registerUser, loginUser, getProfile, updateProfile , bookAppointment };