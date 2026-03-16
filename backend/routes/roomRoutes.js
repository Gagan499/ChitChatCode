const express = require("express");
const router = express.Router();
const { getDirectRoom } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

router.get("/direct/:otherUserId", protect, getDirectRoom);

module.exports = router;
