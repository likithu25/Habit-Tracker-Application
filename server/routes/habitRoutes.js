const express = require("express");

const {
  createHabit,
  getHabits,
  markHabitDone,
  updateHabit,
  deleteHabit,
} = require("../controllers/habitController");
const protect = require("../middleware/authMiddleware");
const Habit = require("../models/Habit");

const router = express.Router();

// Routes
router.post("/", protect, createHabit);
router.get("/", protect, getHabits);
router.patch("/:id", protect, updateHabit);
router.delete("/:id", protect, deleteHabit);
router.get("/:id", protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json(habit);
  } catch (error) {
    console.error("Error fetching habit:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id/done", protect, markHabitDone);

module.exports = router;
