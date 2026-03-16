const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// List all users (excluding current user)
router.get("/", protect, getUsers);

module.exports = router;
