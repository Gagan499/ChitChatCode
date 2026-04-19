const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { executeCode } = require("../controllers/codeController");

// POST /api/code/execute — authenticated users only
router.post("/execute", protect, executeCode);

module.exports = router;
