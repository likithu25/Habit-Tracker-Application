const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const dbName = mongoose.connection.name;
    console.log("📂 Connected to DB:", dbName);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit app on DB connection failure
  }
};

module.exports = connectDB;
