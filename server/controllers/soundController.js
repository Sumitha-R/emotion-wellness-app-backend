const SoundTherapy = require('../models/SoundTherapy');

// Add new sound therapy
exports.addSoundTherapy = async (req, res) => {
  try {
    const soundData = req.body;
    const newSound = new SoundTherapy(soundData);
    await newSound.save();
    
    res.status(201).json({ 
      message: 'Sound therapy added successfully', 
      sound: newSound 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to add sound therapy', 
      error: error.message 
    });
  }
};

// Get all sound therapies with filtering
exports.getAllSoundTherapies = async (req, res) => {
  try {
    const { type, benefits, mood, difficulty } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (benefits) query.therapeutic_benefits = { $in: benefits.split(',') };
    if (difficulty) query.difficulty_level = difficulty;
    
    let sounds;
    if (mood) {
      sounds = await SoundTherapy.getRecommendedByMood(mood);
    } else {
      sounds = await SoundTherapy.find(query).sort({ rating: -1, play_count: -1 });
    }
    
    res.status(200).json({ 
      sounds,
      count: sounds.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch sound therapies', 
      error: error.message 
    });
  }
};

// Get sound therapy by ID
exports.getSoundTherapyById = async (req, res) => {
  try {
    const sound = await SoundTherapy.findById(req.params.id);
    if (!sound) {
      return res.status(404).json({ message: 'Sound therapy not found' });
    }
    
    res.status(200).json({ sound });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch sound therapy', 
      error: error.message 
    });
  }
};

// Play sound therapy (increment play count)
exports.playSoundTherapy = async (req, res) => {
  try {
    const sound = await SoundTherapy.findById(req.params.id);
    if (!sound) {
      return res.status(404).json({ message: 'Sound therapy not found' });
    }
    
    await sound.incrementPlayCount();
    
    res.status(200).json({ 
      message: 'Play count updated',
      sound: sound
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update play count', 
      error: error.message 
    });
  }
};

// Get recommendations by therapeutic benefits
exports.getRecommendationsByBenefits = async (req, res) => {
  try {
    const { benefits } = req.body;
    
    if (!benefits || !Array.isArray(benefits)) {
      return res.status(400).json({ message: 'Benefits array is required' });
    }
    
    const sounds = await SoundTherapy.getByBenefits(benefits);
    
    res.status(200).json({ 
      recommendations: sounds,
      count: sounds.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get recommendations', 
      error: error.message 
    });
  }
};

// Get sound therapies by type
exports.getSoundTherapiesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const sounds = await SoundTherapy.find({ type }).sort({ rating: -1 });
    
    res.status(200).json({ 
      sounds,
      type,
      count: sounds.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch sound therapies by type', 
      error: error.message 
    });
  }
}; 