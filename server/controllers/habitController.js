const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");

// Create a habit
const createHabit = async (req, res) => {
  try {
    console.log("req.user:", req.user); // 🔍 check this log in terminal

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: user not found" });
    }

    const { name, timeOfDay } = req.body;

    const habit = new Habit({
      user: req.user.id, // This is where the crash likely happens
      name,
      timeOfDay,
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    console.error("Error in createHabit:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get all habits for the logged-in user
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark habit as completed for today
const markHabitDone = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const todayStr = new Date().toISOString().split("T")[0];

    // Check if there's already a log for today
    const alreadyLogged = habit.logs.some((log) => {
      const logDate = log.date.toISOString().split("T")[0];
      return logDate === todayStr;
    });

    if (!alreadyLogged) {
      habit.logs.push({ date: new Date(), completed: true });
    }

    await habit.save();
    res.status(200).json(habit);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to mark habit as done", error: error.message });
  }
};

const updateHabit = async (req, res) => {
  try {
    const { name, time } = req.body;

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (name) habit.name = name;
    if (time) habit.time = time;

    await habit.save();
    res.status(200).json(habit);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // Delete all logs for this habit
    await HabitLog.deleteMany({ habit: habit._id });

    res.status(200).json({ message: "Habit and related logs deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
module.exports = {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  markHabitDone,
};
