const express = require("express");
const {
    createAppointment,
    getMyAppointments,
    getAppointmentById,
    cancelAppointment,
    rescheduleAppointment
} = require("../controllers/appointmentController");

const {
    getProviderAppointments,
    updateProviderAppointmentStatus
} = require("../controllers/appointmentController");

const { providerOnly } = require("../middleware/providerMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);



router.get(
    "/provider/my-appointments",
    protect,
    providerOnly,
    getProviderAppointments
);

router.patch(
    "/provider/:id/status",
    protect,
    providerOnly,
    updateProviderAppointmentStatus
);
router.route("/")
    .get(getMyAppointments)
    .post(createAppointment);

router.get("/:id", getAppointmentById);
router.patch("/:id/cancel", cancelAppointment);
router.patch("/:id/reschedule", rescheduleAppointment);

module.exports = router;
