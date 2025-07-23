const Journal = require("../models/Journal");

exports.createJournal = async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    const newEntry = new Journal({ userId, title, content });
    await newEntry.save();
    res.status(201).json({ message: "Journal entry added successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add journal entry
exports.addJournal = async (req, res) => {
  try {
    const { userId, title, content, mood } = req.body;
    const newJournal = new Journal({ userId, title, content, mood });
    await newJournal.save();
    res.status(201).json({ message: 'Journal saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all journal entries for a user
exports.getUserJournals = async (req, res) => {
  try {
    const { userId } = req.params;
    const journals = await Journal.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(journals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 