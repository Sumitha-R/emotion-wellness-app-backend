const mongoose = require('mongoose');

const emotionTrackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emotion: {
    type: String,
    enum: [
      'happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'frustrated', 
      'content', 'worried', 'grateful', 'lonely', 'confident', 'overwhelmed',
      'peaceful', 'stressed', 'hopeful', 'disappointed', 'proud', 'fearful', 'joyful'
    ],
    required: true
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  context: {
    type: String,
    trim: true,
    maxlength: 500
  },
  triggers: [{
    type: String,
    trim: true
  }],
  coping_strategies_used: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  },
  // For weekly/monthly trend analysis
  week: {
    type: Number // Week of the year (1-52)
  },
  month: {
    type: Number // Month (1-12)
  },
  year: {
    type: Number
  }
}, {
  timestamps: true
});

// Automatically set week, month, year before saving
emotionTrackingSchema.pre('save', function(next) {
  const date = this.date || new Date();
  this.year = date.getFullYear();
  this.month = date.getMonth() + 1;
  
  // Calculate week of year
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  this.week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  
  next();
});

// Indexes for efficient querying
emotionTrackingSchema.index({ userId: 1, date: -1 });
emotionTrackingSchema.index({ userId: 1, month: 1, year: 1 });
emotionTrackingSchema.index({ userId: 1, week: 1, year: 1 });

const EmotionTracking = mongoose.model('EmotionTracking', emotionTrackingSchema);

module.exports = EmotionTracking;
