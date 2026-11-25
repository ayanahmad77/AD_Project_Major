const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider",
        required: true,
        index: true
    },
    date: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/
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
    },
    reason: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ""
    },
    status: {
        type: String,
        enum: ["confirmed", "cancelled", "completed"],
        default: "confirmed",
        index: true
    },
    cancelledAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// A provider cannot have two confirmed appointments with the same date and start time.
// Cancelled appointments no longer occupy the slot.
appointmentSchema.index(
    { provider: 1, date: 1, startTime: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "confirmed" },
        name: "unique_confirmed_provider_slot"
    }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
