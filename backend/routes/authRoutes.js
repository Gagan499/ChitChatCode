"use strict";

const express = require("express");
const router  = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  googleAuth,
  logout,
  updateMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
router.post("/register",           registerUser);
router.post("/login",              loginUser);
router.post("/logout",             logout);
router.post("/google",             googleAuth);
router.post("/forgot-password",    forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ── Protected ─────────────────────────────────────────────────────────────────
router.get("/me",  protect, getMe);
router.put("/me",  protect, updateMe);

module.exports = router;
