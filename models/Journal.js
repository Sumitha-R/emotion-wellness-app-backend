const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  content: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 5000
  },
  mood: { 
    type: String,
    enum: ['very_happy', 'happy', 'neutral', 'sad', 'very_sad', 'angry', 'anxious', 'excited', 'calm', 'stressed'],
    required: false
  },
  mood_emoji: {
    type: String,
    enum: ['😄', '😊', '😐', '😢', '😭', '😠', '😰', '🤩', '😌', '😤'],
    required: false
  },
  emotion: {
    type: String,
    trim: true
  },
  emotion_emoji: {
    type: String,
    default: '💭'
  },
  tags: [{
    type: String,
    trim: true
  }],
  journey_progress: {
    emoji: {
      type: String,
      default: '🌱' // Starting journey
    },
    level: {
      type: String,
      enum: ['beginner', 'growing', 'blooming', 'flourishing', 'mastery'],
      default: 'beginner'
    },
    improvement_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  dashboard_display: {
    featured_emoji: {
      type: String,
      default: '📝'
    },
    color_theme: {
      type: String,
      enum: ['green', 'blue', 'purple', 'orange', 'pink', 'yellow'],
      default: 'blue'
    },
    visibility: {
      type: String,
      enum: ['private', 'friends', 'public'],
      default: 'private'
    }
  },
  is_private: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
journalSchema.index({ userId: 1, date: -1 });
journalSchema.index({ userId: 1, mood: 1 });
journalSchema.index({ userId: 1, 'journey_progress.level': 1 });

// Helper method to auto-assign mood emoji
journalSchema.methods.assignMoodEmoji = function() {
  const moodEmojiMap = {
    'very_happy': '😄',
    'happy': '😊',
    'neutral': '😐',
    'sad': '😢',
    'very_sad': '😭',
    'angry': '😠',
    'anxious': '😰',
    'excited': '🤩',
    'calm': '😌',
    'stressed': '😤'
  };
  
  if (this.mood && !this.mood_emoji) {
    this.mood_emoji = moodEmojiMap[this.mood];
  }
};

// Helper method to calculate journey progress
journalSchema.methods.calculateJourneyProgress = function() {
  // Simple improvement calculation based on mood trends
  const positiveEmotions = ['very_happy', 'happy', 'excited', 'calm'];
  const neutralEmotions = ['neutral'];
  
  let score = this.journey_progress.improvement_score || 0;
  
  if (positiveEmotions.includes(this.mood)) {
    score += 10;
  } else if (neutralEmotions.includes(this.mood)) {
    score += 5;
  } else {
    score = Math.max(0, score - 2); // Slight decrease for negative emotions
  }
  
  this.journey_progress.improvement_score = Math.min(100, score);
  
  // Update journey level and emoji based on score
  if (score >= 80) {
    this.journey_progress.level = 'mastery';
    this.journey_progress.emoji = '🏆';
  } else if (score >= 60) {
    this.journey_progress.level = 'flourishing';
    this.journey_progress.emoji = '🌸';
  } else if (score >= 40) {
    this.journey_progress.level = 'blooming';
    this.journey_progress.emoji = '🌻';
  } else if (score >= 20) {
    this.journey_progress.level = 'growing';
    this.journey_progress.emoji = '🌿';
  } else {
    this.journey_progress.level = 'beginner';
    this.journey_progress.emoji = '🌱';
  }
};

// Pre-save middleware to auto-assign emojis and calculate progress
journalSchema.pre('save', function(next) {
  this.assignMoodEmoji();
  this.calculateJourneyProgress();
  next();
});

// Static method to get dashboard emoji summary for a user
journalSchema.statics.getDashboardSummary = async function(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const entries = await this.find({
    userId: userId,
    date: { $gte: startDate }
  }).sort({ date: -1 });
  
  if (entries.length === 0) {
    return {
      journey_emoji: '🌱',
      mood_trend: '😐',
      improvement_percentage: 0,
      entries_count: 0
    };
  }
  
  // Calculate average improvement score
  const totalScore = entries.reduce((sum, entry) => sum + (entry.journey_progress.improvement_score || 0), 0);
  const averageScore = totalScore / entries.length;
  
  // Get most common mood emoji
  const moodEmojis = entries.map(e => e.mood_emoji).filter(Boolean);
  const moodCounts = {};
  moodEmojis.forEach(emoji => moodCounts[emoji] = (moodCounts[emoji] || 0) + 1);
  const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, '😐');
  
  // Get latest journey emoji
  const latestJourneyEmoji = entries[0]?.journey_progress?.emoji || '🌱';
  
  return {
    journey_emoji: latestJourneyEmoji,
    mood_trend: mostCommonMood,
    improvement_percentage: Math.round(averageScore),
    entries_count: entries.length,
    recent_entries: entries.slice(0, 3).map(entry => ({
      date: entry.date,
      title: entry.title,
      mood_emoji: entry.mood_emoji,
      journey_emoji: entry.journey_progress.emoji,
      featured_emoji: entry.dashboard_display.featured_emoji
    }))
  };
};

module.exports = mongoose.model('Journal', journalSchema);