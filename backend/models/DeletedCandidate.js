const mongoose = require("mongoose");

const deletedCandidateSchema = new mongoose.Schema({
  candidateId: { type: Number, required: true, unique: true },
  deletedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DeletedCandidate", deletedCandidateSchema);
