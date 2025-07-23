const SoundTherapy = require('../models/soundTherapy');

// Add new sound
exports.addSound = async (req, res) => {
  try {
    const { title, audioUrl, category, description, duration } = req.body;

    const newSound = new SoundTherapy({
      title,
      audioUrl,
      category,
      description,
      duration,
    });

    await newSound.save();
    res.status(201).json({ message: 'Sound therapy added successfully', sound: newSound });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add sound therapy', error: error.message });
  }
};

// Get all sounds or filter by category
exports.getSounds = async (req, res) => {
  try {
    const { category } = req.query;

    let sounds;
    if (category) {
      sounds = await SoundTherapy.find({ category });
    } else {
      sounds = await SoundTherapy.find();
    }

    res.status(200).json({ sounds });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sounds', error: error.message });
  }
}; 