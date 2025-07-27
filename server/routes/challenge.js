const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const challengeController = require('../controllers/challenge');

// Quick test endpoint to show default challenges (no auth)
router.get('/demo-challenges', async (req, res) => {
  try {
    const { Challenge } = require('../models/Challenge');
    const shortTerm = await Challenge.find({ 
      challenge_type: 'default', 
      duration_type: 'short_term' 
    }).limit(3);
    const longTerm = await Challenge.find({ 
      challenge_type: 'default', 
      duration_type: 'long_term' 
    }).limit(2);
    
    res.json({
      success: true,
      message: 'HRV-Based Emotion Wellness System Demo',
      data: {
        shortTermChallenges: shortTerm,
        longTermChallenges: longTerm,
        totalDefaultChallenges: shortTerm.length + longTerm.length,
        systemFeatures: [
          'HRV-based emotion tracking',
          'Short-term stress relief (3-8 min)',
          'Long-term habit building (21-42 days)',
          'User-created custom challenges',
          'Real-time HRV monitoring',
          'Comprehensive analytics dashboard'
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test endpoint without auth to check DB connection
router.get('/test', async (req, res) => {
  try {
    const { Challenge } = require('../models/Challenge');
    const count = await Challenge.countDocuments();
    res.json({ 
      success: true, 
      message: 'MongoDB connected successfully',
      challengeCount: count 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'MongoDB connection failed',
      error: error.message 
    });
  }
});
router.get('/test', async (req, res) => {
  try {
    const { Challenge } = require('../models/Challenge');
    const count = await Challenge.countDocuments();
    res.json({ 
      success: true, 
      message: 'MongoDB connected successfully',
      challengeCount: count 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'MongoDB connection failed',
      error: error.message 
    });
  }
});

// Test endpoint to seed comprehensive data
router.post('/seed-comprehensive', async (req, res) => {
  try {
    const { Challenge } = require('../models/Challenge');
    
    const comprehensiveChallenges = [
      // Stress Management Challenges
      {
        title: 'Progressive Muscle Relaxation',
        description: 'Learn to release physical tension through systematic muscle relaxation.',
        category: 'stress_management',
        difficulty_level: 'intermediate',
        estimated_duration: 15,
        instructions: [
          { step_number: 1, instruction: 'Lie down comfortably' },
          { step_number: 2, instruction: 'Tense and relax each muscle group for 5 seconds' },
          { step_number: 3, instruction: 'Start from your toes and work up to your head' }
        ],
        prompts: ['Which muscle groups held the most tension?', 'How do you feel compared to before?'],
        benefits: ['Reduces physical stress', 'Improves sleep quality'],
        tags: ['relaxation', 'tension relief'],
        frequency: 'daily',
        is_active: true
      },
      {
        title: 'Emotion Labeling Practice',
        description: 'Increase emotional intelligence by accurately identifying your emotions.',
        category: 'emotional_regulation',
        difficulty_level: 'beginner',
        estimated_duration: 10,
        instructions: [
          { step_number: 1, instruction: 'Set 3 random alarms throughout your day' },
          { step_number: 2, instruction: 'When alarm goes off, pause and check in with yourself' },
          { step_number: 3, instruction: 'Name the emotion you are feeling as specifically as possible' }
        ],
        prompts: ['What patterns did you notice in your emotions today?'],
        benefits: ['Increases emotional awareness', 'Improves emotion regulation'],
        tags: ['emotions', 'awareness'],
        frequency: 'daily',
        is_active: true
      },
      {
        title: 'SMART Goal Setting Workshop',
        description: 'Create specific, measurable, achievable, relevant, and time-bound goals.',
        category: 'goal_setting',
        difficulty_level: 'intermediate',
        estimated_duration: 45,
        instructions: [
          { step_number: 1, instruction: 'Choose one area of life you want to improve' },
          { step_number: 2, instruction: 'Write a specific goal using SMART criteria' },
          { step_number: 3, instruction: 'Break it down into 3-5 actionable steps' }
        ],
        prompts: ['What excites you most about achieving this goal?'],
        benefits: ['Increases goal achievement', 'Improves planning skills'],
        tags: ['goals', 'planning'],
        frequency: 'weekly',
        is_active: true
      },
      {
        title: 'Creative Expression Journal',
        description: 'Express your emotions through creative writing, drawing, or other art forms.',
        category: 'creativity',
        difficulty_level: 'beginner',
        estimated_duration: 30,
        instructions: [
          { step_number: 1, instruction: 'Choose your preferred creative medium' },
          { step_number: 2, instruction: 'Set a timer for 20 minutes' },
          { step_number: 3, instruction: 'Create without judgment or planning' }
        ],
        prompts: ['What emotions came up during creation?'],
        benefits: ['Emotional release', 'Increased self-expression'],
        tags: ['creativity', 'expression'],
        frequency: 'weekly',
        is_active: true
      }
    ];
    
    const inserted = await Challenge.insertMany(comprehensiveChallenges);
    res.json({ 
      success: true, 
      message: `${inserted.length} comprehensive challenges seeded successfully`,
      challenges: inserted
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Comprehensive seeding failed',
      error: error.message 
    });
  }
});

// List all challenges
router.get('/', auth, challengeController.getChallenges);
// Get challenge recommendations
router.get('/recommendations', auth, challengeController.getRecommendations);
// Get user's challenge progress
router.get('/user/progress', auth, challengeController.getUserChallenges);
// Get challenge by ID (this should be last among GET routes)
router.get('/:id', auth, challengeController.getChallengeById);

// Challenge actions
router.post('/start', auth, challengeController.startChallenge);
router.post('/:challengeId/complete', auth, challengeController.completeChallenge);
router.post('/:challengeId/skip', auth, challengeController.skipChallenge);

// User-created challenge operations
router.post('/create', auth, challengeController.createUserChallenge);
router.put('/:id', auth, challengeController.updateUserChallenge);
router.delete('/:id', auth, challengeController.deleteUserChallenge);

module.exports = router;
