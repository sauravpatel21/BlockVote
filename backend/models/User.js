const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  voterId: {
    type: String,
    required: true,
    unique: true,
    match: [/^[A-Z]{3}[0-9]{7}$/, "Invalid Voter ID format"]
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  walletAddress: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
