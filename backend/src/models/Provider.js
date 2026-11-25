
const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true
    },
    startTime: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):[0-5]\d$/
    },
    endTime: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):[0-5]\d$/
    }
}, { _id: false });

const providerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    qualification: {
        type: String,
        default: ""
    },
    experience: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        default: ""
    },
    phone: {
        type: String,
        trim: true,
        default: ""
    },
    clinicName: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    consultationFee: {
        type: Number,
        default: 0
    },
    slotDuration: {
        type: Number,
        default: 30,
        min: 5,
        max: 240
    },
    availability: {
        type: [availabilitySchema],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Provider", providerSchema);
