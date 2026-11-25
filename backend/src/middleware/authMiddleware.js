const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        res.status(401);
        throw new Error("Not authorized. Token missing.");
    }

    const token = header.split(" ")[1];
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        res.status(401);
        throw new Error("Invalid or expired token.");
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
        res.status(401);
        throw new Error("User account not found or inactive.");
    }

    req.user = user;
    next();
});

module.exports = { protect };
