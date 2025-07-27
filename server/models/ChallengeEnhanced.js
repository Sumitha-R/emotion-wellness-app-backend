const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: [
      'mindfulness', 'gratitude', 'self_reflection', 'goal_setting',
      'relationship', 'creativity', 'physical_wellness', 'emotional_regulation',
      'stress_management', 'personal_growth', 'daily_habit', 'social_connection',
      'hrv_improvement', 'breathing', 'recovery'
    ],
    required: true
  },
  difficulty_level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  // NEW: Challenge duration type
  duration_type: {
    type: String,
    enum: ['short_term', 'long_term'],
    required: true,
    default: 'short_term'
  },
  estimated_duration: {
    type: Number, // in minutes for short-term, days for long-term
    required: true,
    min: 1,
    max: 365 // Max 365 days for long-term challenges
  },
  // NEW: Duration unit
  duration_unit: {
    type: String,
    enum: ['minutes', 'hours', 'days', 'weeks'],
    default: 'minutes'
  },
  instructions: [{
    step_number: Number,
    instruction: {
      type: String,
      required: true,
      trim: true
    }
  }],
  prompts: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'one_time'],
    default: 'one_time'
  },
  // NEW: Expected HRV improvement
  expected_hrv_impact: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  // NEW: Challenge type
  challenge_type: {
    type: String,
    enum: ['default', 'user_created'],
    default: 'default'
  },
  // NEW: Creator information
  created_by_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.challenge_type === 'user_created';
    }
  },
  is_active: {
    type: Boolean,
    default: true
  },
  // NEW: Public/Private for user-created challenges
  is_public: {
    type: Boolean,
    default: false // User challenges are private by default
  },
  created_by: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

// User Challenge Completion Schema (Enhanced)
const userChallengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'skipped', 'paused'],
    default: 'not_started'
  },
  started_at: {
    type: Date
  },
  completed_at: {
    type: Date
  },
  paused_at: {
    type: Date
  },
  user_response: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: 500
  },
  completion_streak: {
    type: Number,
    default: 0
  },
  // NEW: HRV tracking for challenge
  hrv_before: {
    type: Number,
    min: 0,
    max: 100
  },
  hrv_after: {
    type: Number,
    min: 0,
    max: 100
  },
  hrv_improvement: {
    type: Number // Calculated: hrv_after - hrv_before
  },
  // For long-term challenges
  daily_check_ins: [{
    date: Date,
    status: {
      type: String,
      enum: ['completed', 'missed', 'partial']
    },
    notes: String,
    hrv_score: Number
  }],
  progress_percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate HRV improvement before saving
userChallengeSchema.pre('save', function(next) {
  if (this.hrv_before && this.hrv_after) {
    this.hrv_improvement = this.hrv_after - this.hrv_before;
  }
  next();
});

// Indexes for efficient querying
challengeSchema.index({ category: 1, difficulty_level: 1 });
challengeSchema.index({ is_active: 1 });
challengeSchema.index({ duration_type: 1 });
challengeSchema.index({ challenge_type: 1 });
challengeSchema.index({ created_by_user: 1 });

userChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
userChallengeSchema.index({ userId: 1, status: 1 });

const Challenge = mongoose.model('Challenge', challengeSchema);
const UserChallenge = mongoose.model('UserChallenge', userChallengeSchema);

module.exports = { Challenge, UserChallenge };
