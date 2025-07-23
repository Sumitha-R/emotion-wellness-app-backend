const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  moodHistory: [{ type: String }],
  journalEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Journal' }]
});

module.exports = mongoose.model("User", userSchema); 