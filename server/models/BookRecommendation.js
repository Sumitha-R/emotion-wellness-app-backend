const mongoose = require('mongoose');

const bookRecommendationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  cover_image_url: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: [
      'self_help',
      'motivation',
      'mental_wellness',
      'psychology',
      'mindfulness',
      'emotional_intelligence',
      'personal_development',
      'healing',
      'spirituality',
      'stress_management'
    ],
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  read_link: {
    type: String, // URL to read online or purchase
    default: ''
  },
  embed_code: {
    type: String, // For embedded readers
    default: ''
  },
  isbn: {
    type: String,
    trim: true
  },
  publication_year: {
    type: Number
  },
  page_count: {
    type: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  therapeutic_focus: [{
    type: String,
    enum: [
      'anxiety_management',
      'depression_support',
      'stress_relief',
      'confidence_building',
      'relationship_healing',
      'trauma_recovery',
      'mindfulness_practice',
      'emotional_regulation',
      'goal_achievement',
      'self_love',
      'forgiveness',
      'gratitude_practice'
    ]
  }],
  difficulty_level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  read_count: {
    type: Number,
    default: 0
  },
  recommended_for_mood: [{
    type: String,
    enum: ['stressed', 'anxious', 'sad', 'angry', 'confused', 'motivated', 'curious', 'healing']
  }],
  is_free: {
    type: Boolean,
    default: false
  },
  created_by: {
    type: String,
    default: 'System'
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
bookRecommendationSchema.index({ type: 1 });
bookRecommendationSchema.index({ therapeutic_focus: 1 });
bookRecommendationSchema.index({ tags: 1 });
bookRecommendationSchema.index({ rating: -1 });
bookRecommendationSchema.index({ recommended_for_mood: 1 });

// Method to increment read count
bookRecommendationSchema.methods.incrementReadCount = function() {
  this.read_count += 1;
  return this.save();
};

// Static method to get books by therapeutic focus
bookRecommendationSchema.statics.getByTherapeuticFocus = function(focus) {
  return this.find({
    therapeutic_focus: { $in: focus }
  }).sort({ rating: -1, read_count: -1 });
};

// Static method to get recommended books based on mood
bookRecommendationSchema.statics.getRecommendedByMood = function(mood) {
  return this.find({
    recommended_for_mood: mood
  }).sort({ rating: -1, read_count: -1 });
};

// Static method to get books by type
bookRecommendationSchema.statics.getByType = function(type) {
  return this.find({ type: type }).sort({ rating: -1 });
};

module.exports = mongoose.model('BookRecommendation', bookRecommendationSchema);
