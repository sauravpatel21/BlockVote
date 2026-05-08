const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow Vercel frontend
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

app.use("/api/auth", authRoutes);
app.use("/api/ipfs", ipfsRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/blockvote")
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
