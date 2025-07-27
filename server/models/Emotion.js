const mongoose = require('mongoose');

const emotionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emotionType: {
    type: String,
    enum: [
      'happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 
      'stressed', 'grateful', 'lonely', 'confident', 'overwhelmed', 
      'peaceful', 'frustrated', 'hopeful', 'fearful', 'content'
    ],
    required: true
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  triggers: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  mood_context: {
    location: String,
    weather: String,
    activity: String,
    social_situation: {
      type: String,
      enum: ['alone', 'with_family', 'with_friends', 'at_work', 'in_public', 'other']
    }
  },
  coping_strategies_used: [{
    type: String,
    enum: [
      'deep_breathing', 'meditation', 'journaling', 'exercise', 
      'music', 'talking_to_someone', 'creative_activity', 
      'nature_walk', 'sound_therapy', 'other'
    ]
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for efficient querying
emotionSchema.index({ userId: 1, timestamp: -1 });
emotionSchema.index({ emotionType: 1 });

const Emotion = mongoose.model('Emotion', emotionSchema);
module.exports = Emotion; 