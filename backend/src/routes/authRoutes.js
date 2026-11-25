const express = require("express");
const { body } = require("express-validator");
const {
    register,
    registerProvider,
    login,
    getMe
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");



const router = express.Router();

router.post(
    "/register",
    [
        body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2-80 characters."),
        body("email").isEmail().withMessage("Enter a valid email."),
        body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    ],
    register
);


router.post(
    "/register-provider",
    [
        body("name").trim().isLength({ min: 2, max: 80 }),
        body("email").isEmail(),
        body("password").isLength({ min: 8 }),
        body("specialization").trim().notEmpty()
    ],
    registerProvider
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Enter a valid email."),
        body("password").notEmpty().withMessage("Password is required.")
    ],
    login
);

router.get("/me", protect, getMe);

module.exports = router;
