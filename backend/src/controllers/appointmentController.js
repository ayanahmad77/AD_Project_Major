const Appointment = require("../models/Appointment");
const asyncHandler = require("../utils/asyncHandler");
const { validateProviderSlot } = require("../services/appointmentService");
const { createNotification } = require("../services/notificationService");
const Provider = require("../models/Provider");

const getProviderAppointments = asyncHandler(async (req, res) => {
    const provider = await Provider.findOne({
        user: req.user._id,
        isActive: true
    });

    if (!provider) {
        return res.status(404).json({
            success: false,
            message: "Provider profile not found."
        });
    }

    const appointments = await Appointment.find({
        provider: provider._id
    })
        .populate("user", "name email phone")
        .sort({ date: 1, startTime: 1 });

    res.json({
        success: true,
        count: appointments.length,
        appointments
    });
});

const updateProviderAppointmentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!["completed", "cancelled"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Status must be completed or cancelled."
        });
    }

    const provider = await Provider.findOne({
        user: req.user._id,
        isActive: true
    });

    if (!provider) {
        return res.status(404).json({
            success: false,
            message: "Provider profile not found."
        });
    }

    const appointment = await Appointment.findOne({
        _id: req.params.id,
        provider: provider._id
    });

    if (!appointment) {
        return res.status(404).json({
            success: false,
            message: "Appointment not found."
        });
    }

    if (appointment.status !== "confirmed") {
        return res.status(400).json({
            success: false,
            message: "Only confirmed appointments can be updated."
        });
    }

    appointment.status = status;

    if (status === "cancelled") {
        appointment.cancelledAt = new Date();
    }

    await appointment.save();

    await createNotification({
        user: appointment.user,
        title: `Appointment ${status}`,
        message: `Your appointment on ${appointment.date} at ${appointment.startTime} was ${status}.`,
        type: "appointment",
        relatedAppointment: appointment._id
    });

    res.json({
        success: true,
        message: `Appointment ${status}.`,
        appointment
    });
});

const createAppointment = asyncHandler(async (req, res) => {
    const { providerId, date, startTime, reason } = req.body;

    

    if (!providerId || !date || !startTime) {
        return res.status(400).json({
            success: false,
            message: "providerId, date and startTime are required."
        });
    }

    const { endTime } = await validateProviderSlot(providerId, date, startTime);

    let appointment;
    try {
        appointment = await Appointment.create({
            user: req.user._id,
            provider: providerId,
            date,
            startTime,
            endTime,
            reason: reason || ""
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Sorry, this slot has just been booked. Please choose another slot."
            });
        }
        throw error;
    }

    await createNotification({
        user: req.user._id,
        title: "Appointment confirmed",
        message: `Your appointment on ${date} at ${startTime} has been confirmed.`,
        type: "appointment",
        relatedAppointment: appointment._id
    });

    const populated = await Appointment.findById(appointment._id).populate("provider", "name specialization");
    res.status(201).json({ success: true, message: "Appointment booked.", appointment: populated });
});

const getMyAppointments = asyncHandler(async (req, res) => {
    const filter = { user: req.user._id };

    if (req.query.status) {
        filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
        .populate("provider", "name specialization")
        .sort({ date: 1, startTime: 1 });

    res.json({ success: true, count: appointments.length, appointments });
});

const getAppointmentById = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findOne({
        _id: req.params.id,
        user: req.user._id
    }).populate("provider", "name specialization description");

    if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    res.json({ success: true, appointment });
});

const cancelAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    if (appointment.status !== "confirmed") {
        return res.status(400).json({ success: false, message: "Only confirmed appointments can be cancelled." });
    }

    appointment.status = "cancelled";
    appointment.cancelledAt = new Date();
    await appointment.save();

    await createNotification({
        user: req.user._id,
        title: "Appointment cancelled",
        message: `Your appointment on ${appointment.date} at ${appointment.startTime} was cancelled.`,
        type: "appointment",
        relatedAppointment: appointment._id
    });

    res.json({ success: true, message: "Appointment cancelled.", appointment });
});

const rescheduleAppointment = asyncHandler(async (req, res) => {
    const { date, startTime } = req.body;

    if (!date || !startTime) {
        return res.status(400).json({ success: false, message: "date and startTime are required." });
    }

    const appointment = await Appointment.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    if (appointment.status !== "confirmed") {
        return res.status(400).json({ success: false, message: "Only confirmed appointments can be rescheduled." });
    }

    const { endTime } = await validateProviderSlot(appointment.provider, date, startTime);

    try {
        appointment.date = date;
        appointment.startTime = startTime;
        appointment.endTime = endTime;
        await appointment.save();
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "That slot is already booked." });
        }
        throw error;
    }

    await createNotification({
        user: req.user._id,
        title: "Appointment rescheduled",
        message: `Your appointment has been moved to ${date} at ${startTime}.`,
        type: "appointment",
        relatedAppointment: appointment._id
    });

    res.json({ success: true, message: "Appointment rescheduled.", appointment });
});

module.exports = {
    createAppointment,
    getMyAppointments,
    getAppointmentById,
    cancelAppointment,
    rescheduleAppointment,
    getProviderAppointments,
    updateProviderAppointmentStatus
};