// controllers/habitLogController.js

const HabitLog = require("../models/HabitLog");

exports.createHabitLog = async (req, res) => {
  try {
    const { habitId } = req.body;

    if (!habitId) {
      return res.status(400).json({ message: "habitId is required" });
    }

    const newLog = new HabitLog({
      user: req.user.id,
      habit: habitId,
    });

    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
exports.getLogsForHabit = async (req, res) => {
  try {
    const { habitId } = req.params;

    const logs = await HabitLog.find({
      user: req.user.id,
      habit: habitId,
    });

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.getStreak = async (req, res) => {
  try {
    const { habitId } = req.params;

    const logs = await HabitLog.find({
      user: req.user.id,
      habit: habitId,
    });

    // Get unique dates in descending order
    const dates = logs
      .map((log) => new Date(log.date).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i) // remove duplicates
      .sort((a, b) => new Date(b) - new Date(a)); // latest first

    let streak = 0;
    let currentDate = new Date();

    for (let date of dates) {
      const logDate = new Date(date);
      if (logDate.toDateString() === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1); // check previous day
      } else {
        break; // streak is broken
      }
    }

    res.status(200).json({ streak });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.getAllLogsForUser = async (req, res) => {
  try {
    const logs = await HabitLog.find({ user: req.user.id }).populate("habit");

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const log = await HabitLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.status(200).json({ message: "Log deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.getLogsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res
        .status(400)
        .json({ message: "Date query is required (YYYY-MM-DD)" });
    }

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const next = new Date(target);
    next.setDate(target.getDate() + 1);

    const logs = await HabitLog.find({
      user: req.user.id,
      date: { $gte: target, $lt: next },
    }).populate("habit");

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
