const mongoose = require('mongoose');

const soundTherapySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  type: {
    type: String,
    enum: [
      'brainwave_entrainment',
      'nature_sounds', 
      'musical_therapy',
      'chakra_sound_therapy',
      'white_noise',
      'pink_noise',
      'guided_audio_therapy',
      'asmr'
    ],
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  audio_url: {
    type: String,
    required: true
  },
  cover_image: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  frequency: {
    type: String, // For brainwave entrainment (e.g., "40Hz", "528Hz")
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  therapeutic_benefits: [{
    type: String,
    enum: [
      'deep_sleep',
      'concentration', 
      'relaxation',
      'mental_clarity',
      'mood_uplift',
      'anxiety_reduction',
      'spiritual_wellbeing',
      'emotional_detox',
      'focus',
      'sensory_overload_management',
      'trauma_healing',
      'emotional_grounding',
      'stress_relief',
      'insomnia_relief',
      'calmness'
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
  play_count: {
    type: Number,
    default: 0
  },
  is_premium: {
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
soundTherapySchema.index({ type: 1 });
soundTherapySchema.index({ therapeutic_benefits: 1 });
soundTherapySchema.index({ tags: 1 });
soundTherapySchema.index({ rating: -1 });

// Method to increment play count
soundTherapySchema.methods.incrementPlayCount = function() {
  this.play_count += 1;
  return this.save();
};

// Static method to get therapy by benefits
soundTherapySchema.statics.getByBenefits = function(benefits) {
  return this.find({
    therapeutic_benefits: { $in: benefits }
  }).sort({ rating: -1, play_count: -1 });
};

// Static method to get recommended sounds based on mood
soundTherapySchema.statics.getRecommendedByMood = function(mood) {
  const moodToBenefitsMap = {
    'stressed': ['relaxation', 'stress_relief', 'calmness'],
    'anxious': ['anxiety_reduction', 'emotional_grounding', 'relaxation'],
    'sad': ['mood_uplift', 'emotional_detox', 'spiritual_wellbeing'],
    'angry': ['calmness', 'emotional_grounding', 'relaxation'],
    'tired': ['deep_sleep', 'relaxation', 'insomnia_relief'],
    'unfocused': ['concentration', 'focus', 'mental_clarity'],
    'excited': ['calmness', 'emotional_grounding'],
    'neutral': ['relaxation', 'mental_clarity', 'mood_uplift']
  };

  const benefits = moodToBenefitsMap[mood] || ['relaxation', 'calmness'];
  return this.getByBenefits(benefits);
};

module.exports = mongoose.model('SoundTherapy', soundTherapySchema); 