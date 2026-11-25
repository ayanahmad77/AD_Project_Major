const Provider = require("../models/Provider");
const asyncHandler = require("../utils/asyncHandler");
const { getAvailableSlots } = require("../services/appointmentService");

const getProviders = asyncHandler(async (req, res) => {
    const filter = { isActive: true };

    if (req.query.search) {
        const search = req.query.search.trim();
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { specialization: { $regex: search, $options: "i" } }
        ];
    }

    const providers = await Provider.find(filter).sort({ name: 1 });
    res.json({ success: true, count: providers.length, providers });
});

const getProviderById = asyncHandler(async (req, res) => {
    const provider = await Provider.findOne({ _id: req.params.id, isActive: true });
    if (!provider) {
        return res.status(404).json({ success: false, message: "Provider not found." });
    }
    res.json({ success: true, provider });
});

const getProviderSlots = asyncHandler(async (req, res) => {
    const slots = await getAvailableSlots(req.params.id, req.query.date);
    res.json({ success: true, date: req.query.date, slots });
});

const createProvider = asyncHandler(async (req, res) => {
    const provider = await Provider.create(req.body);
    res.status(201).json({ success: true, provider });
});

const updateProvider = asyncHandler(async (req, res) => {
    const provider = await Provider.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!provider) {
        return res.status(404).json({ success: false, message: "Provider not found." });
    }
    res.json({ success: true, provider });
});

const deactivateProvider = asyncHandler(async (req, res) => {
    const provider = await Provider.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
    );

    if (!provider) {
        return res.status(404).json({ success: false, message: "Provider not found." });
    }
    res.json({ success: true, message: "Provider deactivated.", provider });
});

module.exports = {
    getProviders,
    getProviderById,
    getProviderSlots,
    createProvider,
    updateProvider,
    deactivateProvider
};
