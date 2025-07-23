require('dotenv').config();
const mongoose = require('mongoose');
const SoundTherapy = require('./server/models/soundTherapy');

const samples = [
  {
    title: "Flute Therapy Session",
    audioUrl: "http://localhost:5000/sounds/flute_therapy.mp3",
    category: "healing",
    description: "A calming flute session for emotional healing and mental clarity.",
    duration: 3600
  },
  {
    title: "Flute Therapy Session",
    audioUrl: "http://localhost:5000/sounds/flute_therapy.mp3",
    category: "musical",
    description: "A meditative Krishna flute therapy, ideal for relaxation and focus.",
    duration: 3600
  }
  // ... other sound entries if needed
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/emotion_wellness', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');

  await SoundTherapy.deleteMany({});
  console.log('Deleted old sound data');

  await SoundTherapy.insertMany(samples);
  console.log('🎵 Sample sound therapy entries added');

  await mongoose.disconnect();
  console.log('Seeding complete and disconnected');
})
.catch((err) => {
  console.error('⚠️ Error seeding data:', err);
}); 