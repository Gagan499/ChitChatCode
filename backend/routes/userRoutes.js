const express = require("express");
const router = express.Router();
const {
  getUsers,
  updateProfile,
  updateLanguage,
  toggle2FA,
  getNotifications,
  updateNotifications,
  getDevices,
  deleteDevice,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// ── Existing ──────────────────────────────────────────────────────────────
router.get("/", protect, getUsers);

// ── Profile ───────────────────────────────────────────────────────────────
router.put("/update-profile", protect, updateProfile);

// ── Account settings ──────────────────────────────────────────────────────
router.put("/language", protect, updateLanguage);
router.put("/toggle-2fa", protect, toggle2FA);

// ── Notification settings ─────────────────────────────────────────────────
router.get("/notifications", protect, getNotifications);
router.put("/notifications", protect, updateNotifications);

// ── Linked devices ────────────────────────────────────────────────────────
router.get("/devices", protect, getDevices);
router.delete("/devices/:id", protect, deleteDevice);

module.exports = router;
