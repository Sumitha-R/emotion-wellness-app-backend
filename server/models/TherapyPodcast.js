const mongoose = require('mongoose');

const therapyPodcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  host: {
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
      'mental_health',
      'mindfulness',
      'therapy_sessions',
      'guided_meditation',
      'emotional_healing',
      'psychology_education',
      'wellness_tips',
      'life_coaching',
      'spiritual_guidance',
      'stress_management'
    ],
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  audio_url: {
    type: String,
    required: true
  },
  embed_code: {
    type: String, // For embedded players (Spotify, Apple Podcasts, etc.)
    default: ''
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  episode_number: {
    type: Number,
    default: 1
  },
  season: {
    type: Number,
    default: 1
  },
  tags: [{
    type: String,
    trim: true
  }],
  therapeutic_focus: [{
    type: String,
    enum: [
      'anxiety_relief',
      'depression_support',
      'stress_management',
      'relationship_counseling',
      'trauma_healing',
      'addiction_recovery',
      'self_esteem_building',
      'emotional_regulation',
      'mindfulness_training',
      'grief_support',
      'anger_management',
      'sleep_improvement'
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
  listen_count: {
    type: Number,
    default: 0
  },
  recommended_for_mood: [{
    type: String,
    enum: ['stressed', 'anxious', 'sad', 'angry', 'confused', 'motivated', 'curious', 'healing']
  }],
  language: {
    type: String,
    default: 'English'
  },
  is_premium: {
    type: Boolean,
    default: false
  },
  created_by: {
    type: String,
    default: 'System'
  },
  external_links: {
    spotify: { type: String, default: '' },
    apple_podcasts: { type: String, default: '' },
    google_podcasts: { type: String, default: '' },
    website: { type: String, default: '' }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
therapyPodcastSchema.index({ type: 1 });
therapyPodcastSchema.index({ therapeutic_focus: 1 });
therapyPodcastSchema.index({ tags: 1 });
therapyPodcastSchema.index({ rating: -1 });
therapyPodcastSchema.index({ recommended_for_mood: 1 });
therapyPodcastSchema.index({ host: 1 });

// Method to increment listen count
therapyPodcastSchema.methods.incrementListenCount = function() {
  this.listen_count += 1;
  return this.save();
};

// Static method to get podcasts by therapeutic focus
therapyPodcastSchema.statics.getByTherapeuticFocus = function(focus) {
  return this.find({
    therapeutic_focus: { $in: focus }
  }).sort({ rating: -1, listen_count: -1 });
};

// Static method to get recommended podcasts based on mood
therapyPodcastSchema.statics.getRecommendedByMood = function(mood) {
  return this.find({
    recommended_for_mood: mood
  }).sort({ rating: -1, listen_count: -1 });
};

// Static method to get podcasts by host
therapyPodcastSchema.statics.getByHost = function(host) {
  return this.find({ host: new RegExp(host, 'i') }).sort({ episode_number: -1 });
};

// Static method to get podcasts by type
therapyPodcastSchema.statics.getByType = function(type) {
  return this.find({ type: type }).sort({ rating: -1 });
};

module.exports = mongoose.model('TherapyPodcast', therapyPodcastSchema);
