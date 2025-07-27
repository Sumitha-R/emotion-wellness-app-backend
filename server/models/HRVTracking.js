const mongoose = require('mongoose');

const hrvTrackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hrv_score: {
    type: Number,
    required: true,
    min: 0,
    max: 100 // HRV score typically ranges 0-100
  },
  rmssd: {
    type: Number, // Root Mean Square of Successive Differences
    min: 0
  },
  heart_rate: {
    type: Number,
    min: 30,
    max: 220
  },
  stress_level: {
    type: String,
    enum: ['low', 'moderate', 'high', 'very_high'],
    required: true
  },
  recovery_status: {
    type: String,
    enum: ['poor', 'fair', 'good', 'excellent'],
    required: true
  },
  // Derived emotion based on HRV
  predicted_emotion: {
    type: String,
    enum: [
      'calm', 'relaxed', 'focused', 'balanced', 'energized',
      'stressed', 'anxious', 'tired', 'overwhelmed', 'tense'
    ],
    required: true
  },
  // Manual emotion entry (can differ from predicted)
  actual_emotion: {
    type: String,
    enum: [
      'happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'frustrated', 
      'content', 'worried', 'grateful', 'lonely', 'confident', 'overwhelmed',
      'peaceful', 'stressed', 'hopeful', 'disappointed', 'proud', 'fearful', 'joyful'
    ]
  },
  emotion_intensity: {
    type: Number,
    min: 1,
    max: 10
  },
  measurement_context: {
    type: String,
    enum: ['morning', 'pre_workout', 'post_workout', 'evening', 'stress_test', 'meditation', 'general']
  },
  external_factors: [{
    factor: {
      type: String,
      enum: ['caffeine', 'alcohol', 'sleep_quality', 'exercise', 'medication', 'stress', 'illness']
    },
    impact: {
      type: String,
      enum: ['positive', 'negative', 'neutral']
    }
  }],
  notes: {
    type: String,
    maxlength: 500
  },
  date: {
    type: Date,
    default: Date.now
  },
  // For trend analysis
  week: Number,
  month: Number,
  year: Number
}, {
  timestamps: true
});

// Calculate HRV-based emotion and stress level before saving
hrvTrackingSchema.pre('save', function(next) {
  const date = this.date || new Date();
  this.year = date.getFullYear();
  this.month = date.getMonth() + 1;
  
  // Calculate week of year
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  this.week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  
  // Auto-calculate stress level and predicted emotion based on HRV
  if (!this.stress_level) {
    if (this.hrv_score >= 70) this.stress_level = 'low';
    else if (this.hrv_score >= 50) this.stress_level = 'moderate';
    else if (this.hrv_score >= 30) this.stress_level = 'high';
    else this.stress_level = 'very_high';
  }
  
  if (!this.recovery_status) {
    if (this.hrv_score >= 75) this.recovery_status = 'excellent';
    else if (this.hrv_score >= 60) this.recovery_status = 'good';
    else if (this.hrv_score >= 40) this.recovery_status = 'fair';
    else this.recovery_status = 'poor';
  }
  
  if (!this.predicted_emotion) {
    if (this.hrv_score >= 70) {
      this.predicted_emotion = ['calm', 'relaxed', 'balanced', 'focused'][Math.floor(Math.random() * 4)];
    } else if (this.hrv_score >= 50) {
      this.predicted_emotion = ['calm', 'focused', 'energized'][Math.floor(Math.random() * 3)];
    } else if (this.hrv_score >= 30) {
      this.predicted_emotion = ['stressed', 'tense', 'tired'][Math.floor(Math.random() * 3)];
    } else {
      this.predicted_emotion = ['anxious', 'overwhelmed', 'stressed'][Math.floor(Math.random() * 3)];
    }
  }
  
  next();
});

// Indexes for efficient querying
hrvTrackingSchema.index({ userId: 1, date: -1 });
hrvTrackingSchema.index({ userId: 1, month: 1, year: 1 });
hrvTrackingSchema.index({ userId: 1, week: 1, year: 1 });
hrvTrackingSchema.index({ hrv_score: 1 });

const HRVTracking = mongoose.model('HRVTracking', hrvTrackingSchema);

module.exports = HRVTracking;
