const TherapyPodcast = require('../models/TherapyPodcast');

// Add new therapy podcast
exports.addTherapyPodcast = async (req, res) => {
  try {
    const podcastData = req.body;
    const newPodcast = new TherapyPodcast(podcastData);
    await newPodcast.save();
    
    res.status(201).json({ 
      message: 'Therapy podcast added successfully', 
      podcast: newPodcast 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to add therapy podcast', 
      error: error.message 
    });
  }
};

// Get all therapy podcasts with filtering
exports.getAllTherapyPodcasts = async (req, res) => {
  try {
    const { type, focus, mood, difficulty, host, is_premium } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (focus) query.therapeutic_focus = { $in: focus.split(',') };
    if (difficulty) query.difficulty_level = difficulty;
    if (host) query.host = new RegExp(host, 'i');
    if (is_premium !== undefined) query.is_premium = is_premium === 'true';
    
    let podcasts;
    if (mood) {
      podcasts = await TherapyPodcast.getRecommendedByMood(mood);
    } else {
      podcasts = await TherapyPodcast.find(query).sort({ rating: -1, listen_count: -1 });
    }
    
    res.status(200).json({ 
      podcasts,
      count: podcasts.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch therapy podcasts', 
      error: error.message 
    });
  }
};

// Get therapy podcast by ID
exports.getTherapyPodcastById = async (req, res) => {
  try {
    const podcast = await TherapyPodcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Therapy podcast not found' });
    }
    
    res.status(200).json({ podcast });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch therapy podcast', 
      error: error.message 
    });
  }
};

// Track podcast listen (increment listen count)
exports.trackPodcastListen = async (req, res) => {
  try {
    const podcast = await TherapyPodcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Therapy podcast not found' });
    }
    
    await podcast.incrementListenCount();
    
    res.status(200).json({ 
      message: 'Listen count updated',
      podcast: podcast
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update listen count', 
      error: error.message 
    });
  }
};

// Get podcasts by therapeutic focus
exports.getPodcastsByTherapeuticFocus = async (req, res) => {
  try {
    const { focus } = req.body;
    
    if (!focus || !Array.isArray(focus)) {
      return res.status(400).json({ message: 'Therapeutic focus array is required' });
    }
    
    const podcasts = await TherapyPodcast.getByTherapeuticFocus(focus);
    
    res.status(200).json({ 
      recommendations: podcasts,
      count: podcasts.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get podcast recommendations', 
      error: error.message 
    });
  }
};

// Get podcasts by type
exports.getPodcastsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const podcasts = await TherapyPodcast.getByType(type);
    
    res.status(200).json({ 
      podcasts,
      type,
      count: podcasts.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch podcasts by type', 
      error: error.message 
    });
  }
};

// Get podcasts by host
exports.getPodcastsByHost = async (req, res) => {
  try {
    const { host } = req.params;
    const podcasts = await TherapyPodcast.getByHost(host);
    
    res.status(200).json({ 
      podcasts,
      host,
      count: podcasts.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch podcasts by host', 
      error: error.message 
    });
  }
};

// Get podcast episodes by season
exports.getPodcastsBySeason = async (req, res) => {
  try {
    const { season } = req.params;
    const podcasts = await TherapyPodcast.find({ season: parseInt(season) })
      .sort({ episode_number: 1 });
    
    res.status(200).json({ 
      podcasts,
      season: parseInt(season),
      count: podcasts.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch podcasts by season', 
      error: error.message 
    });
  }
};

module.exports = exports;
