const Journal = require('../models/Journal');
const { Challenge, UserChallenge } = require('../models/Challenge');
const EmotionTracking = require('../models/EmotionTracking');
const HRVTracking = require('../models/HRVTracking');

// Get comprehensive dashboard analytics with HRV focus
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = 'month' } = req.query; // week, month, year

    // Get date range based on timeframe
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // HRV analytics (primary metric)
    const hrvStats = await HRVTracking.aggregate([
      { $match: { userId: userId, date: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          avgHRV: { $avg: "$hrv_score" },
          avgHeartRate: { $avg: "$heart_rate" },
          totalReadings: { $sum: 1 },
          stressDistribution: {
            $push: "$stress_level"
          },
          recoveryDistribution: {
            $push: "$recovery_status"
          }
        }
      }
    ]);

    // Challenge completion stats
    const challengeStats = await UserChallenge.aggregate([
      { $match: { userId: userId, updatedAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgHRVImprovement: { $avg: "$hrv_improvement" }
        }
      }
    ]);

    // Journal entries with HRV correlation
    const journalCount = await Journal.countDocuments({
      user: userId,
      date: { $gte: startDate }
    });

    // HRV-based improvement calculation
    const improvement = await calculateHRVBasedImprovement(userId, timeframe);

    res.json({
      success: true,
      analytics: {
        timeframe,
        hrv: formatHRVStats(hrvStats[0] || {}),
        challenges: formatChallengeStats(challengeStats),
        journalEntries: journalCount,
        improvement
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard analytics',
      error: error.message
    });
  }
};

// Get emoji-enhanced dashboard summary
const getEmojiDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = 'week' } = req.query;

    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;

    // Get journal summary with emojis
    const journalSummary = await Journal.getDashboardSummary(userId, days);

    // Get recent HRV data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const hrvData = await HRVTracking.find({
      user_id: userId,
      recorded_at: { $gte: startDate }
    }).sort({ recorded_at: -1 }).limit(20);

    // Calculate HRV wellness emoji
    let hrvEmoji = '💙';
    if (hrvData.length > 0) {
      const avgHRV = hrvData.reduce((sum, d) => sum + d.hrv_score, 0) / hrvData.length;
      hrvEmoji = avgHRV >= 50 ? '💚' : avgHRV >= 40 ? '💛' : avgHRV >= 30 ? '🧡' : '❤️';
    }

    // Get challenge progress
    const challengeStats = await UserChallenge.aggregate([
      { $match: { userId: userId, createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const completedChallenges = challengeStats.find(s => s._id === 'completed')?.count || 0;
    const challengeEmoji = completedChallenges >= 5 ? '🏆' : completedChallenges >= 3 ? '🎯' : completedChallenges >= 1 ? '⭐' : '🎪';

    // Create emoji dashboard
    const emojiDashboard = {
      journey_status: {
        main_emoji: journalSummary.journey_emoji,
        level_text: `${journalSummary.improvement_percentage}% Journey Progress`,
        mood_emoji: journalSummary.mood_trend,
        trend_indicator: journalSummary.improvement_percentage >= 70 ? '📈' : 
                        journalSummary.improvement_percentage >= 40 ? '📊' : '📉'
      },
      wellness_metrics: {
        hrv_heart: hrvEmoji,
        challenge_achievement: challengeEmoji,
        overall_wellbeing: journalSummary.improvement_percentage >= 80 ? '🌟' : 
                          journalSummary.improvement_percentage >= 60 ? '✨' : 
                          journalSummary.improvement_percentage >= 40 ? '💫' : '🌱'
      },
      recent_highlights: journalSummary.recent_entries.map(entry => ({
        date: entry.date,
        title: entry.title,
        mood: entry.mood_emoji,
        journey: entry.journey_emoji,
        featured: entry.featured_emoji
      })),
      motivational_message: {
        emoji: journalSummary.improvement_percentage >= 70 ? '🎉' : '💪',
        text: journalSummary.improvement_percentage >= 70 ? 
              'Amazing progress on your wellness journey!' :
              journalSummary.improvement_percentage >= 40 ?
              'You\'re making great strides forward!' :
              'Every step counts - keep going!'
      },
      stats: {
        journal_entries: journalSummary.entries_count,
        improvement_score: journalSummary.improvement_percentage,
        hrv_readings: hrvData.length,
        challenges_completed: completedChallenges
      }
    };

    res.json({
      success: true,
      emoji_dashboard: emojiDashboard,
      timeframe
    });

  } catch (error) {
    console.error('Error getting emoji dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching emoji dashboard',
      error: error.message
    });
  }
};

// Get HRV-based emotion line graph
const getHRVEmotionLineGraph = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Primary data from HRV readings
    const hrvData = await HRVTracking.aggregate([
      { $match: { userId: userId, date: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          avgHRV: { $avg: "$hrv_score" },
          avgHeartRate: { $avg: "$heart_rate" },
          stressLevel: { $first: "$stress_level" },
          recoveryStatus: { $first: "$recovery_status" },
          predictedEmotions: { $push: "$predicted_emotion" },
          actualEmotions: { $push: "$actual_emotion" },
          totalReadings: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format for line graph with HRV as primary metric
    const lineGraphData = hrvData.map(day => {
      const emotionScore = calculateEmotionScoreFromHRV(day.avgHRV, day.stressLevel);
      return {
        date: day._id,
        hrvScore: parseFloat(day.avgHRV.toFixed(2)),
        emotionScore: emotionScore,
        heartRate: parseFloat((day.avgHeartRate || 0).toFixed(0)),
        stressLevel: day.stressLevel,
        recoveryStatus: day.recoveryStatus,
        readings: day.totalReadings,
        topPredictedEmotions: getMostFrequent(day.predictedEmotions).slice(0, 3),
        topActualEmotions: getMostFrequent(day.actualEmotions.filter(e => e)).slice(0, 3)
      };
    });

    res.json({
      success: true,
      lineGraph: lineGraphData,
      summary: {
        totalDays: lineGraphData.length,
        avgHRVScore: lineGraphData.reduce((sum, day) => sum + day.hrvScore, 0) / lineGraphData.length || 0,
        avgEmotionScore: lineGraphData.reduce((sum, day) => sum + day.emotionScore, 0) / lineGraphData.length || 0,
        totalReadings: hrvData.reduce((sum, day) => sum + day.totalReadings, 0),
        hrvTrend: calculateHRVTrend(lineGraphData)
      }
    });

  } catch (error) {
    console.error('HRV emotion line graph error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load HRV emotion line graph',
      error: error.message
    });
  }
};

// Legacy emotion line graph function
const getEmotionLineGraph = async (req, res) => {
  // Redirect to HRV-based line graph for better insights
  return getHRVEmotionLineGraph(req, res);
};

// Get monthly HRV and emotion improvement
const getMonthlyImprovement = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    
    // Current month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Previous month
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [currentMonth, previousMonth] = await Promise.all([
      calculateHRVMonthlyAverages(userId, currentMonthStart, currentMonthEnd),
      calculateHRVMonthlyAverages(userId, prevMonthStart, prevMonthEnd)
    ]);

    const improvement = calculateHRVImprovementPercentage(previousMonth, currentMonth);

    res.json({
      success: true,
      monthlyImprovement: {
        currentMonth: {
          period: `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`,
          averageHRV: currentMonth.avgHRV,
          averageStressLevel: currentMonth.avgStressLevel,
          challengesCompleted: currentMonth.challengesCompleted,
          journalEntries: currentMonth.journalEntries,
          hrvReadings: currentMonth.hrvReadings
        },
        previousMonth: {
          period: `${new Date(prevMonthStart).toLocaleString('default', { month: 'long' })} ${prevMonthStart.getFullYear()}`,
          averageHRV: previousMonth.avgHRV,
          averageStressLevel: previousMonth.avgStressLevel,
          challengesCompleted: previousMonth.challengesCompleted,
          journalEntries: previousMonth.journalEntries,
          hrvReadings: previousMonth.hrvReadings
        },
        improvement: {
          hrvImprovement: improvement.hrv,
          stressReduction: improvement.stress,
          activityIncrease: improvement.activity,
          overallProgress: improvement.overall
        }
      }
    });

  } catch (error) {
    console.error('Monthly HRV improvement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate monthly HRV improvement',
      error: error.message
    });
  }
};

// Log HRV reading
const logEmotion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      hrv_score, 
      rmssd, 
      heart_rate, 
      actual_emotion, 
      emotion_intensity,
      measurement_context,
      external_factors,
      notes 
    } = req.body;

    const hrvEntry = new HRVTracking({
      userId,
      hrv_score,
      rmssd,
      heart_rate,
      actual_emotion,
      emotion_intensity,
      measurement_context,
      external_factors: external_factors || [],
      notes
    });

    await hrvEntry.save();

    res.json({
      success: true,
      message: 'HRV reading logged successfully',
      entry: hrvEntry,
      insights: {
        stressLevel: hrvEntry.stress_level,
        recoveryStatus: hrvEntry.recovery_status,
        predictedEmotion: hrvEntry.predicted_emotion,
        recommendations: getHRVRecommendations(hrvEntry.hrv_score, hrvEntry.stress_level)
      }
    });

  } catch (error) {
    console.error('Log HRV error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log HRV reading',
      error: error.message
    });
  }
};

// Helper Functions for HRV-based calculations
async function calculateHRVBasedImprovement(userId, timeframe) {
  const now = new Date();
  let currentStart, currentEnd, previousStart, previousEnd;

  if (timeframe === 'week') {
    currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    currentEnd = now;
    previousStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    previousEnd = currentStart;
  } else {
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    currentEnd = now;
    previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  }

  const [current, previous] = await Promise.all([
    calculateHRVPeriodAverages(userId, currentStart, currentEnd),
    calculateHRVPeriodAverages(userId, previousStart, previousEnd)
  ]);

  return calculateHRVImprovementPercentage(previous, current);
}

async function calculateHRVPeriodAverages(userId, startDate, endDate) {
  const [hrvAvg, challengeCount, journalCount] = await Promise.all([
    HRVTracking.aggregate([
      { $match: { userId: userId, date: { $gte: startDate, $lte: endDate } } },
      { 
        $group: { 
          _id: null, 
          avgHRV: { $avg: "$hrv_score" },
          avgStressLevel: { $avg: { 
            $switch: {
              branches: [
                { case: { $eq: ["$stress_level", "low"] }, then: 1 },
                { case: { $eq: ["$stress_level", "moderate"] }, then: 2 },
                { case: { $eq: ["$stress_level", "high"] }, then: 3 },
                { case: { $eq: ["$stress_level", "very_high"] }, then: 4 }
              ],
              default: 2
            }
          }}
        } 
      }
    ]),
    UserChallenge.countDocuments({
      userId: userId,
      status: 'completed',
      completed_at: { $gte: startDate, $lte: endDate }
    }),
    Journal.countDocuments({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    })
  ]);

  return {
    avgHRV: hrvAvg[0]?.avgHRV || 0,
    avgStressLevel: hrvAvg[0]?.avgStressLevel || 2,
    challengesCompleted: challengeCount,
    journalEntries: journalCount
  };
}

async function calculateHRVMonthlyAverages(userId, startDate, endDate) {
  const result = await calculateHRVPeriodAverages(userId, startDate, endDate);
  
  // Add HRV readings count
  const hrvCount = await HRVTracking.countDocuments({
    userId: userId,
    date: { $gte: startDate, $lte: endDate }
  });
  
  result.hrvReadings = hrvCount;
  return result;
}

function calculateHRVImprovementPercentage(previous, current) {
  const hrvChange = previous.avgHRV > 0 ? 
    ((current.avgHRV - previous.avgHRV) / previous.avgHRV) * 100 : 0;
  
  // Stress reduction (lower is better, so we invert the calculation)
  const stressChange = previous.avgStressLevel > 0 ?
    ((previous.avgStressLevel - current.avgStressLevel) / previous.avgStressLevel) * 100 : 0;
  
  const activityChange = previous.challengesCompleted + previous.journalEntries > 0 ?
    (((current.challengesCompleted + current.journalEntries) - 
      (previous.challengesCompleted + previous.journalEntries)) / 
     (previous.challengesCompleted + previous.journalEntries)) * 100 : 0;

  const overall = (hrvChange + stressChange + activityChange) / 3;

  return {
    hrv: parseFloat(hrvChange.toFixed(2)),
    stress: parseFloat(stressChange.toFixed(2)),
    activity: parseFloat(activityChange.toFixed(2)),
    overall: parseFloat(overall.toFixed(2))
  };
}

function calculateEmotionScoreFromHRV(hrvScore, stressLevel) {
  // Convert HRV score to emotion score (1-10 scale)
  let emotionScore = (hrvScore / 100) * 10;
  
  // Adjust based on stress level
  switch (stressLevel) {
    case 'low': emotionScore = Math.min(emotionScore + 1, 10); break;
    case 'moderate': break; // no adjustment
    case 'high': emotionScore = Math.max(emotionScore - 1, 1); break;
    case 'very_high': emotionScore = Math.max(emotionScore - 2, 1); break;
  }
  
  return parseFloat(emotionScore.toFixed(2));
}

function calculateHRVTrend(lineGraphData) {
  if (lineGraphData.length < 2) return 'insufficient_data';
  
  const firstWeek = lineGraphData.slice(0, 7);
  const lastWeek = lineGraphData.slice(-7);
  
  const firstAvg = firstWeek.reduce((sum, day) => sum + day.hrvScore, 0) / firstWeek.length;
  const lastAvg = lastWeek.reduce((sum, day) => sum + day.hrvScore, 0) / lastWeek.length;
  
  const change = ((lastAvg - firstAvg) / firstAvg) * 100;
  
  if (change > 5) return 'improving';
  if (change < -5) return 'declining';
  return 'stable';
}

function formatHRVStats(stats) {
  if (!stats.avgHRV) {
    return {
      averageHRV: 0,
      averageHeartRate: 0,
      totalReadings: 0,
      stressDistribution: {},
      recoveryDistribution: {}
    };
  }

  const stressDistribution = {};
  const recoveryDistribution = {};
  
  (stats.stressDistribution || []).forEach(level => {
    stressDistribution[level] = (stressDistribution[level] || 0) + 1;
  });
  
  (stats.recoveryDistribution || []).forEach(status => {
    recoveryDistribution[status] = (recoveryDistribution[status] || 0) + 1;
  });

  return {
    averageHRV: parseFloat(stats.avgHRV.toFixed(2)),
    averageHeartRate: parseFloat((stats.avgHeartRate || 0).toFixed(0)),
    totalReadings: stats.totalReadings || 0,
    stressDistribution,
    recoveryDistribution
  };
}

function getHRVRecommendations(hrvScore, stressLevel) {
  const recommendations = [];
  
  if (hrvScore < 30) {
    recommendations.push("Consider stress reduction activities");
    recommendations.push("Try breathing exercises or meditation");
    recommendations.push("Ensure adequate sleep and recovery");
  } else if (hrvScore < 50) {
    recommendations.push("Focus on stress management techniques");
    recommendations.push("Light exercise might help");
  } else if (hrvScore < 70) {
    recommendations.push("You're doing well! Maintain current habits");
    recommendations.push("Consider adding mindfulness practice");
  } else {
    recommendations.push("Excellent HRV! You're well-recovered");
    recommendations.push("Great time for challenging activities");
  }
  
  if (stressLevel === 'very_high' || stressLevel === 'high') {
    recommendations.push("Your stress levels are elevated - prioritize recovery");
  }
  
  return recommendations;
}

function formatChallengeStats(stats) {
  const formatted = { completed: 0, in_progress: 0, skipped: 0 };
  stats.forEach(stat => {
    formatted[stat._id] = stat.count;
  });
  return formatted;
}

function formatEmotionTrends(trends) {
  return trends.map(trend => ({
    date: trend._id.date,
    emotion: trend._id.emotion,
    averageIntensity: parseFloat(trend.avgIntensity.toFixed(2)),
    count: trend.count
  }));
}

function getMostFrequent(arr) {
  const frequency = {};
  arr.forEach(item => frequency[item] = (frequency[item] || 0) + 1);
  return Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
}

// Legacy function for backward compatibility
const getMoodGraph = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;

    const journals = await Journal.find({ user: userId }).sort({ date: 1 });

    const moodData = journals.map(entry => ({
      date: entry.date.toISOString().split('T')[0],
      mood: entry.mood || entry.emotion
    }));

    res.status(200).json({ success: true, data: moodData });
  } catch (err) {
    console.error('Mood graph error:', err);
    res.status(500).json({ success: false, message: 'Failed to load mood graph' });
  }
}; 

// Log HRV data
const logHRVData = async (req, res) => {
  try {
    const { hrv_score, heart_rate, stress_indicators } = req.body;

    if (!hrv_score || !heart_rate) {
      return res.status(400).json({
        success: false,
        message: 'HRV score and heart rate are required'
      });
    }

    const hrvData = new HRVTracking({
      user_id: req.user.id,
      hrv_score: parseFloat(hrv_score),
      heart_rate: parseInt(heart_rate),
      stress_indicators: stress_indicators || []
    });

    await hrvData.save();

    res.json({
      success: true,
      message: 'HRV data logged successfully',
      data: hrvData
    });

  } catch (error) {
    console.error('Error logging HRV data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while logging HRV data',
      error: error.message
    });
  }
};

// Get HRV statistics
const getHRVStats = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    const userId = req.user.id;

    const periodDays = period === '30d' ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const hrvData = await HRVTracking.find({
      user_id: userId,
      recorded_at: { $gte: startDate }
    }).sort({ recorded_at: -1 });

    if (hrvData.length === 0) {
      return res.json({
        success: true,
        message: 'No HRV data found for this period',
        stats: {
          averageHRV: 0,
          averageStressLevel: 0,
          emotionTrend: 'neutral',
          improvementPercentage: 0,
          totalReadings: 0
        }
      });
    }

    const stats = formatHRVStats(hrvData);

    res.json({
      success: true,
      stats,
      period: `${periodDays} days`,
      totalReadings: hrvData.length
    });

  } catch (error) {
    console.error('Error getting HRV stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching HRV stats',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getMoodGraph,
  getEmotionLineGraph,
  getMonthlyImprovement,
  logEmotion,
  getHRVEmotionLineGraph,
  logHRVData,
  getHRVStats,
  getEmojiDashboard
}; 