const { Challenge, UserChallenge } = require('../models/Challenge');

// Get all available challenges (including user-created)
const getChallenges = async (req, res) => {
  try {
    const { 
      category, 
      difficulty_level, 
      frequency,
      duration_type,
      challenge_type = 'all',
      limit = 20, 
      offset = 0 
    } = req.query;

    let query = { is_active: true };

    // Filter logic
    if (category) query.category = category;
    if (difficulty_level) query.difficulty_level = difficulty_level;
    if (frequency) query.frequency = frequency;
    if (duration_type) query.duration_type = duration_type;
    
    // Challenge type filtering
    if (challenge_type === 'default') {
      query.challenge_type = 'default';
    } else if (challenge_type === 'user_created') {
      query.$or = [
        { challenge_type: 'user_created', created_by_user: req.user.id }, // User's own challenges
        { challenge_type: 'user_created', is_public: true } // Public user challenges
      ];
    } else if (challenge_type === 'my_challenges') {
      query.created_by_user = req.user.id;
    }

    const challenges = await Challenge.find(query)
      .populate('created_by_user', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Challenge.countDocuments(query);

    res.json({
      success: true,
      challenges,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching challenges',
      error: error.message
    });
  }
};

// Create user challenge
const createUserChallenge = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty_level,
      duration_type,
      estimated_duration,
      duration_unit,
      instructions,
      prompts,
      benefits,
      tags,
      frequency,
      expected_hrv_impact,
      is_public
    } = req.body;

    const challenge = new Challenge({
      title,
      description,
      category,
      difficulty_level,
      duration_type,
      estimated_duration,
      duration_unit,
      instructions,
      prompts: prompts || [],
      benefits: benefits || [],
      tags: tags || [],
      frequency,
      expected_hrv_impact: expected_hrv_impact || 'moderate',
      challenge_type: 'user_created',
      created_by_user: req.user.id,
      is_public: is_public || false,
      created_by: req.user.name || 'user'
    });

    await challenge.save();

    res.json({
      success: true,
      message: 'Challenge created successfully',
      challenge
    });

  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating challenge',
      error: error.message
    });
  }
};

// Update user challenge
const updateUserChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const challenge = await Challenge.findOne({
      _id: id,
      created_by_user: req.user.id
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found or you do not have permission to edit it'
      });
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        challenge[key] = updates[key];
      }
    });

    await challenge.save();

    res.json({
      success: true,
      message: 'Challenge updated successfully',
      challenge
    });

  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating challenge',
      error: error.message
    });
  }
};

// Delete user challenge
const deleteUserChallenge = async (req, res) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findOne({
      _id: id,
      created_by_user: req.user.id
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found or you do not have permission to delete it'
      });
    }

    // Soft delete - mark as inactive
    challenge.is_active = false;
    await challenge.save();

    res.json({
      success: true,
      message: 'Challenge deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting challenge',
      error: error.message
    });
  }
};

// Get a specific challenge by ID
const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if user has attempted this challenge
    const userProgress = await UserChallenge.findOne({
      userId: req.user.id,
      challengeId: id
    });

    res.json({
      success: true,
      challenge,
      userProgress
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching challenge',
      error: error.message
    });
  }
};

// Start a challenge
const startChallenge = async (req, res) => {
  try {
    const { challengeId } = req.body;

    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if user already has this challenge in progress
    let userChallenge = await UserChallenge.findOne({
      userId: req.user.id,
      challengeId
    });

    if (userChallenge) {
      if (userChallenge.status === 'completed') {
        // Allow restarting completed challenges
        userChallenge.status = 'in_progress';
        userChallenge.started_at = new Date();
        userChallenge.completed_at = null;
        userChallenge.user_response = '';
      } else if (userChallenge.status === 'in_progress') {
        return res.status(400).json({
          success: false,
          message: 'Challenge already in progress'
        });
      } else {
        // Challenge was skipped or not started
        userChallenge.status = 'in_progress';
        userChallenge.started_at = new Date();
      }
    } else {
      // Create new user challenge
      userChallenge = new UserChallenge({
        userId: req.user.id,
        challengeId,
        status: 'in_progress',
        started_at: new Date()
      });
    }

    await userChallenge.save();

    res.json({
      success: true,
      message: 'Challenge started successfully',
      userChallenge,
      challenge
    });
  } catch (error) {
    console.error('Error starting challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting challenge',
      error: error.message
    });
  }
};

// Complete a challenge
const completeChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { user_response, rating, feedback } = req.body;

    const userChallenge = await UserChallenge.findOne({
      userId: req.user.id,
      challengeId
    });

    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found or not started'
      });
    }

    if (userChallenge.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Challenge is not in progress'
      });
    }

    // Update completion details
    userChallenge.status = 'completed';
    userChallenge.completed_at = new Date();
    userChallenge.user_response = user_response;
    userChallenge.rating = rating;
    userChallenge.feedback = feedback;

    // Update completion streak
    const previousCompletions = await UserChallenge.find({
      userId: req.user.id,
      status: 'completed'
    }).sort({ completed_at: -1 }).limit(1);

    if (previousCompletions.length > 0) {
      userChallenge.completion_streak = previousCompletions[0].completion_streak + 1;
    } else {
      userChallenge.completion_streak = 1;
    }

    await userChallenge.save();

    res.json({
      success: true,
      message: 'Challenge completed successfully',
      userChallenge
    });
  } catch (error) {
    console.error('Error completing challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing challenge',
      error: error.message
    });
  }
};

// Skip a challenge
const skipChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const userChallenge = await UserChallenge.findOne({
      userId: req.user.id,
      challengeId
    });

    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    userChallenge.status = 'skipped';
    await userChallenge.save();

    res.json({
      success: true,
      message: 'Challenge skipped',
      userChallenge
    });
  } catch (error) {
    console.error('Error skipping challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while skipping challenge',
      error: error.message
    });
  }
};

// Get user's challenge progress
const getUserChallenges = async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    let query = { userId: req.user.id };
    if (status) query.status = status;

    const userChallenges = await UserChallenge.find(query)
      .populate('challengeId')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await UserChallenge.countDocuments(query);

    // Get completion statistics
    const stats = await UserChallenge.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statsObj = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      success: true,
      userChallenges,
      statistics: statsObj,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user challenges',
      error: error.message
    });
  }
};

// Get challenge recommendations
const getRecommendations = async (req, res) => {
  try {
    // Simple recommendation: challenges not yet attempted by user
    const attemptedChallenges = await UserChallenge.find({
      userId: req.user.id
    }).distinct('challengeId');

    const recommendations = await Challenge.find({
      _id: { $nin: attemptedChallenges },
      is_active: true
    })
    .limit(5)
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recommendations',
      error: error.message
    });
  }
};

module.exports = {
  getChallenges,
  getChallengeById,
  startChallenge,
  completeChallenge,
  skipChallenge,
  getUserChallenges,
  getRecommendations,
  createUserChallenge,
  updateUserChallenge,
  deleteUserChallenge
};
