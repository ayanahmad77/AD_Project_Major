const User = require("../models/User");
const Provider = require("../models/Provider");
const Appointment = require("../models/Appointment");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        totalProviders,
        totalAppointments,
        confirmedAppointments,
        cancelledAppointments,
        completedAppointments
    ] = await Promise.all([
        User.countDocuments({ role: "user" }),
        Provider.countDocuments({ isActive: true }),
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: "confirmed" }),
        Appointment.countDocuments({ status: "cancelled" }),
        Appointment.countDocuments({ status: "completed" })
    ]);

    res.json({
        success: true,
        stats: {
            totalUsers,
            totalProviders,
            totalAppointments,
            confirmedAppointments,
            cancelledAppointments,
            completedAppointments
        }
    });
});

const getAllAppointments = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter)
        .populate("user", "name email")
        .populate("provider", "name specialization")
        .sort({ createdAt: -1 })
        .limit(200);

    res.json({ success: true, count: appointments.length, appointments });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, count: users.length, users });
});

module.exports = { getDashboardStats, getAllAppointments, getAllUsers };
