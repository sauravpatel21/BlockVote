const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Session setup for extra security
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback_secret_123",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // true for https (Render/Vercel)
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Routes
const authRoutes = require("./routes/auth");
const ipfsRoutes = require("./routes/ipfs");

// Serverless Database Connection Middleware
const connectDB = async (req, res, next) => {
  if (mongoose.connection.readyState >= 1) {
    return next();
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/blockvote");
    console.log("Connected to MongoDB Atlas");
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
};

app.use(connectDB);

app.use("/api/auth", authRoutes);
app.use("/api/ipfs", ipfsRoutes);

// Root Health Check Route
app.get("/", (req, res) => {
  res.json({ message: "BlockVote Vercel Backend is Live!" });
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

module.exports = app;
