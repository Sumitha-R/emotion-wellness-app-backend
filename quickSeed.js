require('dotenv').config();
const mongoose = require('mongoose');
const { Challenge } = require('./server/models/Challenge');

const simpleChallenges = [
  {
    title: 'Daily Gratitude',
    description: 'Write 3 things you are grateful for today',
    category: 'gratitude',
    difficulty_level: 'beginner',
    estimated_duration: 5,
    instructions: [
      { step_number: 1, instruction: 'Sit quietly for a moment' },
      { step_number: 2, instruction: 'Think about your day' },
      { step_number: 3, instruction: 'Write down 3 things you are grateful for' }
    ],
    prompts: ['What made you smile today?', 'Who helped you today?'],
    benefits: ['Increases positivity', 'Reduces stress'],
    tags: ['gratitude', 'daily'],
    frequency: 'daily',
    is_active: true
  },
  {
    title: 'Mindful Breathing',
    description: 'Practice deep breathing for 5 minutes',
    category: 'mindfulness',
    difficulty_level: 'beginner',
    estimated_duration: 5,
    instructions: [
      { step_number: 1, instruction: 'Find a comfortable position' },
      { step_number: 2, instruction: 'Close your eyes' },
      { step_number: 3, instruction: 'Focus on your breath' }
    ],
    prompts: ['How do you feel now?', 'Did your mind wander?'],
    benefits: ['Calms the mind', 'Reduces anxiety'],
    tags: ['breathing', 'mindfulness'],
    frequency: 'daily',
    is_active: true
  }
];

async function quickSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Insert challenges without deleting existing ones
    const inserted = await Challenge.insertMany(simpleChallenges);
    console.log(`✅ ${inserted.length} challenges seeded successfully!`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.disconnect();
  }
}

quickSeed();
