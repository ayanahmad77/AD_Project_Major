const express = require("express");
const {
    getNotifications,
    markNotificationRead,
    markAllRead
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markNotificationRead);

module.exports = router;
