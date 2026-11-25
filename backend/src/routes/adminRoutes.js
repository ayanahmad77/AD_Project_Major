const express = require("express");
const { getDashboardStats, getAllAppointments, getAllUsers } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/appointments", getAllAppointments);
router.get("/users", getAllUsers);

module.exports = router;
