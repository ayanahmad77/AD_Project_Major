const express = require("express");
const {
    getProviders,
    getProviderById,
    getProviderSlots,
    createProvider,
    updateProvider,
    deactivateProvider
} = require("../controllers/providerController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getProviders);
router.get("/:id/slots", getProviderSlots);
router.get("/:id", getProviderById);

router.post("/", protect, adminOnly, createProvider);
router.patch("/:id", protect, adminOnly, updateProvider);
router.delete("/:id", protect, adminOnly, deactivateProvider);

module.exports = router;
