const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  logout,
  updateMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Define routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/logout", logout);

module.exports = router;
