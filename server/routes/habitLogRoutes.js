// routes/habitLogRoutes.js

const express = require("express");
const router = express.Router();
const habitLogController = require("../controllers/habitLogController");
const authenticate = require("../middleware/authMiddleware");

// @route   POST /api/logs
// @desc    Log a habit for the day
// @access  Private
router.get("/", authenticate, habitLogController.getAllLogsForUser);

router.post("/", authenticate, habitLogController.createHabitLog);
router.get("/by-date", authenticate, habitLogController.getLogsByDate);

// You can add more routes here later (like GET logs, etc.)
router.get("/:habitId", authenticate, habitLogController.getLogsForHabit);
router.get("/:habitId/streak", authenticate, habitLogController.getStreak);
router.delete("/:id", authenticate, habitLogController.deleteLog);

module.exports = router;
