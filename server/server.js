const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();
console.log("JWT SECRET:", process.env.JWT_SECRET);

// Initialize express
const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // allow your frontend origin
    credentials: true,
  })
);
app.use(express.json()); // parse JSON bodies
const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);

const habitLogRoutes = require("./routes/habitLogRoutes");
app.use("/api/logs", habitLogRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
