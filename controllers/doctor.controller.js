const doctorModel = require("../models/doctor.model");



const changeAvailability = async (req, res) => {
    try {

        const {docId} = req.body;

        const docData = await doctorModel.findById(docId)

        await doctorModel.findByIdAndUpdate(docId , {available : !docData.available})
        res.json({
            success : true,
            message : "availability changed"
        })



    }
    catch (err) {
        // console.log('❌ ERROR NAME:', err.name)
        // console.log('❌ ERROR MESSAGE:', err.message)
        // console.log('❌ FULL ERROR:', err)
        res.status(500).json({
            sucess: false, message: err.message
        })

    }
}

module.exports = {changeAvailability}