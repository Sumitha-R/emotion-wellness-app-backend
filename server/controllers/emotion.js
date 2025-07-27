const Emotion = require('../models/Emotion');

// Add new emotion entry
const addEmotion = async (req, res) => {
  try {
    const { 
      emotionType, 
      intensity, 
      triggers, 
      description, 
      mood_context, 
      coping_strategies_used, 
      tags 
    } = req.body;

    const newEmotion = new Emotion({
      userId: req.user.id,
      emotionType,
      intensity,
      triggers,
      description,
      mood_context,
      coping_strategies_used,
      tags
    });

    await newEmotion.save();

    res.status(201).json({
      success: true,
      message: 'Emotion entry added successfully',
      emotion: newEmotion
    });
  } catch (error) {
    console.error('Error adding emotion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding emotion',
      error: error.message
    });
  }
};

// Get user's emotion history
const getEmotions = async (req, res) => {
  try {
    const { limit = 20, offset = 0, emotion_type, start_date, end_date } = req.query;
    
    let query = { userId: req.user.id };
    
    // Filter by emotion type if provided
    if (emotion_type) {
      query.emotionType = emotion_type;
    }
    
    // Filter by date range if provided
    if (start_date || end_date) {
      query.timestamp = {};
      if (start_date) query.timestamp.$gte = new Date(start_date);
      if (end_date) query.timestamp.$lte = new Date(end_date);
    }

    const emotions = await Emotion.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Emotion.countDocuments(query);

    res.json({
      success: true,
      emotions,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching emotions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching emotions',
      error: error.message
    });
  }
};

// Get emotion analytics
const getEmotionAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Emotion frequency analysis
    const emotionFrequency = await Emotion.aggregate([
      {
        $match: {
          userId: req.user.id,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$emotionType',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Daily mood trends
    const dailyTrends = await Emotion.aggregate([
      {
        $match: {
          userId: req.user.id,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          avgIntensity: { $avg: '$intensity' },
          count: { $sum: 1 },
          emotions: { $push: '$emotionType' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Most common triggers
    const commonTriggers = await Emotion.aggregate([
      {
        $match: {
          userId: req.user.id,
          timestamp: { $gte: startDate }
        }
      },
      {
        $unwind: '$triggers'
      },
      {
        $group: {
          _id: '$triggers',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      analytics: {
        emotionFrequency,
        dailyTrends,
        commonTriggers,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error fetching emotion analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics',
      error: error.message
    });
  }
};

// Update emotion entry
const updateEmotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const emotion = await Emotion.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!emotion) {
      return res.status(404).json({
        success: false,
        message: 'Emotion entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Emotion entry updated successfully',
      emotion
    });
  } catch (error) {
    console.error('Error updating emotion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating emotion',
      error: error.message
    });
  }
};

// Delete emotion entry
const deleteEmotion = async (req, res) => {
  try {
    const { id } = req.params;

    const emotion = await Emotion.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!emotion) {
      return res.status(404).json({
        success: false,
        message: 'Emotion entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Emotion entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting emotion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting emotion',
      error: error.message
    });
  }
};

module.exports = {
  addEmotion,
  getEmotions,
  getEmotionAnalytics,
  updateEmotion,
  deleteEmotion
};
