const mongoose = require('mongoose');

const soundTherapySchema = new mongoose.Schema({
  title: { type: String, required: true },
  audioUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  category: {
    type: String,
    enum: ['brain_frequency', 'healing', 'musical', 'joyful', 'natural'],
    required: true
  }
});

const SoundTherapy = mongoose.model('SoundTherapy', soundTherapySchema);
module.exports = SoundTherapy; 