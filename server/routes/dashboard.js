const express = require('express');
const router = express.Router();
const { 
  getMoodGraph,
  getDashboardAnalytics,
  getEmotionLineGraph,
  getMonthlyImprovement,
  logEmotion,
  getHRVEmotionLineGraph,
  getHRVStats,
  logHRVData,
  getEmojiDashboard
} = require('../controllers/dashboard');
const { 
  addEmotion, 
  getEmotions, 
  getEmotionAnalytics, 
  updateEmotion, 
  deleteEmotion 
} = require('../controllers/emotion');
const auth = require('../middlewares/auth');

// Dashboard analytics routes
router.get('/analytics', auth, getDashboardAnalytics);
router.get('/emoji-dashboard', auth, getEmojiDashboard);
router.get('/emotion-line-graph', auth, getEmotionLineGraph);
router.get('/monthly-improvement', auth, getMonthlyImprovement);
router.post('/log-emotion', auth, logEmotion);

// HRV-specific endpoints
router.get('/hrv/line-graph', auth, getHRVEmotionLineGraph);
router.get('/hrv/stats', auth, getHRVStats);
router.post('/hrv/log', auth, logHRVData);

// Legacy mood graph route (backward compatibility)
router.get('/mood-graph', auth, getMoodGraph);

// Emotion routes
router.post('/emotions', auth, addEmotion);
router.get('/emotions', auth, getEmotions);
router.get('/emotions/analytics', auth, getEmotionAnalytics);
router.put('/emotions/:id', auth, updateEmotion);
router.delete('/emotions/:id', auth, deleteEmotion);

module.exports = router; 