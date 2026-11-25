const providerOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "provider") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Provider account required."
        });
    }

    next();
};

module.exports = { providerOnly };