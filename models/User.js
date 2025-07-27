const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  profile: {
    age: {
      type: Number,
      min: 13,
      max: 120
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  preferences: {
    notification_enabled: {
      type: Boolean,
      default: true
    },
    daily_reminder_time: {
      type: String,
      default: '09:00'
    },
    preferred_challenge_types: [{
      type: String,
      enum: ['mindfulness', 'gratitude', 'stress_management', 'emotional_regulation', 'physical_wellness']
    }]
  },
  moodHistory: [{ 
    type: String 
  }],
  journalEntries: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Journal' 
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model("User", userSchema);