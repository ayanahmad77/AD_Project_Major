const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const Provider = require("../models/Provider");


const registerProvider = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const {
        name,
        email,
        password,
        phone,
        specialization,
        qualification,
        experience,
        clinicName,
        address,
        consultationFee
    } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    if (!specialization || !specialization.trim()) {
        return res.status(400).json({
            success: false,
            message: "Specialization is required."
        });
    }

    const exists = await User.findOne({ email: normalizedEmail });

    if (exists) {
        return res.status(409).json({
            success: false,
            message: "Email is already registered."
        });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let user;

    try {
        user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            phone,
            role: "provider"
        });

        const provider = await Provider.create({
            user: user._id,
            name,
            email: normalizedEmail,
            phone,
            specialization: specialization.trim(),
            qualification: qualification || "",
            experience: experience || 0,
            clinicName: clinicName || "",
            address: address || "",
            consultationFee: consultationFee || 0,
            isActive: true
        });

        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            message: "Provider registration successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            provider
        });

    } catch (error) {
        if (user) {
            await User.findByIdAndDelete(user._id);
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This email or provider account is already registered."
            });
        }

        throw error;
    }
});



const register = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
        return res.status(409).json({ success: false, message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone
    });

    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        message: "Registration successful.",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    });
});

const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    res.json({
        success: true,
        message: "Login successful.",
        token: generateToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    });
});

const getMe = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role
        }
    });
});

module.exports = { register, login, getMe,    registerProvider, };
