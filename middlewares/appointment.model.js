const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    docId: {
        type: String,
        required: true
    },

    slotDate: {
        type: String,
        required: true
    },

    slotTime: {
        type: String,
        required: true
    },

    userData: {
        type: Object,
        required: true
    },

    doctorData: {
        type: Object,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    Date: {
        type: Number,
        required: true
    },

    cancelled: {
        type: boolean,
        default: false
    },

    payment: {
        type: boolean,
        default: false
    },

    isCompleted: {
        type: boolean,
        default: false
    }


});


const appointmentModel = mongoose.model('appointment', appointmentSchema);

module.exports = appointmentModel;