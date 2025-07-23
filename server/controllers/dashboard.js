// server/controllers/dashboard.js

// Add analytics/dashboard controller functions here

const Journal = require('../models/Journal');

exports.getMoodGraph = async (req, res) => {
  try {
    const userId = req.query.userId;

    const journals = await Journal.find({ user: userId }).sort({ date: 1 });

    const moodData = journals.map(entry => ({
      date: entry.date.toISOString().split('T')[0],
      mood: entry.mood || entry.emotion  // adjust this if you use `emotion` instead of `mood`
    }));

    res.status(200).json({ success: true, data: moodData });
  } catch (err) {
    console.error('Mood graph error:', err);
    res.status(500).json({ success: false, message: 'Failed to load mood graph' });
  }
}; 