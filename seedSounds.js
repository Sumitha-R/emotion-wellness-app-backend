require('dotenv').config();
const mongoose = require('mongoose');
const SoundTherapy = require('./server/models/soundTherapy');

const samples = [
  // Brain Frequency Category
  {
    title: "Alpha Waves - 8-12Hz Focus",
    audioUrl: "http://localhost:5000/sounds/alpha_waves_focus.mp3",
    category: "brain_frequency",
    duration: 1800 // 30 minutes
  },
  {
    title: "Beta Waves - 13-30Hz Concentration",
    audioUrl: "http://localhost:5000/sounds/beta_waves_concentration.mp3",
    category: "brain_frequency",
    duration: 2400 // 40 minutes
  },
  {
    title: "Theta Waves - 4-8Hz Deep Meditation",
    audioUrl: "http://localhost:5000/sounds/theta_waves_meditation.mp3",
    category: "brain_frequency",
    duration: 3600 // 60 minutes
  },
  {
    title: "Delta Waves - 0.5-4Hz Deep Sleep",
    audioUrl: "http://localhost:5000/sounds/delta_waves_sleep.mp3",
    category: "brain_frequency",
    duration: 5400 // 90 minutes
  },
  {
    title: "Gamma Waves - 30-100Hz Creativity",
    audioUrl: "http://localhost:5000/sounds/gamma_waves_creativity.mp3",
    category: "brain_frequency",
    duration: 1200 // 20 minutes
  },
  {
    title: "Binaural Beats - 40Hz Attention",
    audioUrl: "http://localhost:5000/sounds/binaural_beats_attention.mp3",
    category: "brain_frequency",
    duration: 1800 // 30 minutes
  },
  {
    title: "Schumann Resonance - 7.83Hz Earth Frequency",
    audioUrl: "http://localhost:5000/sounds/schumann_resonance.mp3",
    category: "brain_frequency",
    duration: 2700 // 45 minutes
  },
  {
    title: "SMR Waves - 12-15Hz Calm Focus",
    audioUrl: "http://localhost:5000/sounds/smr_waves_calm_focus.mp3",
    category: "brain_frequency",
    duration: 2100 // 35 minutes
  },
  {
    title: "Alpha-Theta Bridge - 6-10Hz Visualization",
    audioUrl: "http://localhost:5000/sounds/alpha_theta_bridge.mp3",
    category: "brain_frequency",
    duration: 2400 // 40 minutes
  },
  {
    title: "432Hz Tuning - Universal Healing Frequency",
    audioUrl: "http://localhost:5000/sounds/432hz_healing_frequency.mp3",
    category: "brain_frequency",
    duration: 3000 // 50 minutes
  },

  // Healing Category
  {
    title: "Reiki Healing Session",
    audioUrl: "http://localhost:5000/sounds/reiki_healing_session.mp3",
    category: "healing",
    duration: 3600 // 60 minutes
  },
  {
    title: "Chakra Balancing Tones",
    audioUrl: "http://localhost:5000/sounds/chakra_balancing_tones.mp3",
    category: "healing",
    duration: 2100 // 35 minutes
  },
  {
    title: "Crystal Bowl Healing",
    audioUrl: "http://localhost:5000/sounds/crystal_bowl_healing.mp3",
    category: "healing",
    duration: 2700 // 45 minutes
  },
  {
    title: "Tibetan Singing Bowls Therapy",
    audioUrl: "http://localhost:5000/sounds/tibetan_singing_bowls.mp3",
    category: "healing",
    duration: 3300 // 55 minutes
  },
  {
    title: "Emotional Release Frequencies",
    audioUrl: "http://localhost:5000/sounds/emotional_release_frequencies.mp3",
    category: "healing",
    duration: 1800 // 30 minutes
  },
  {
    title: "Anxiety Relief Soundscape",
    audioUrl: "http://localhost:5000/sounds/anxiety_relief_soundscape.mp3",
    category: "healing",
    duration: 2400 // 40 minutes
  },
  {
    title: "Depression Healing Frequencies",
    audioUrl: "http://localhost:5000/sounds/depression_healing_frequencies.mp3",
    category: "healing",
    duration: 3000 // 50 minutes
  },
  {
    title: "Stress Relief White Noise",
    audioUrl: "http://localhost:5000/sounds/stress_relief_white_noise.mp3",
    category: "healing",
    duration: 2700 // 45 minutes
  },
  {
    title: "Inner Child Healing Journey",
    audioUrl: "http://localhost:5000/sounds/inner_child_healing.mp3",
    category: "healing",
    duration: 4200 // 70 minutes
  },
  {
    title: "PTSD Therapeutic Soundscape",
    audioUrl: "http://localhost:5000/sounds/ptsd_therapeutic_soundscape.mp3",
    category: "healing",
    duration: 3600 // 60 minutes
  },

  // Musical Category
  {
    title: "Krishna Flute Meditation",
    audioUrl: "http://localhost:5000/sounds/krishna_flute_meditation.mp3",
    category: "musical",
    duration: 3600 // 60 minutes
  },
  {
    title: "Piano Relaxation Melodies",
    audioUrl: "http://localhost:5000/sounds/piano_relaxation_melodies.mp3",
    category: "musical",
    duration: 2700 // 45 minutes
  },
  {
    title: "Ambient Guitar Therapy",
    audioUrl: "http://localhost:5000/sounds/ambient_guitar_therapy.mp3",
    category: "musical",
    duration: 3300 // 55 minutes
  },
  {
    title: "Harp Celestial Harmonies",
    audioUrl: "http://localhost:5000/sounds/harp_celestial_harmonies.mp3",
    category: "musical",
    duration: 2400 // 40 minutes
  },
  {
    title: "Violin Emotional Journey",
    audioUrl: "http://localhost:5000/sounds/violin_emotional_journey.mp3",
    category: "musical",
    duration: 3000 // 50 minutes
  },
  {
    title: "Classical Therapy Compilation",
    audioUrl: "http://localhost:5000/sounds/classical_therapy_compilation.mp3",
    category: "musical",
    duration: 4800 // 80 minutes
  },
  {
    title: "Celtic Healing Melodies",
    audioUrl: "http://localhost:5000/sounds/celtic_healing_melodies.mp3",
    category: "musical",
    duration: 2100 // 35 minutes
  },
  {
    title: "Native American Flute Peace",
    audioUrl: "http://localhost:5000/sounds/native_american_flute_peace.mp3",
    category: "musical",
    duration: 2700 // 45 minutes
  },
  {
    title: "Zen Temple Bells & Chimes",
    audioUrl: "http://localhost:5000/sounds/zen_temple_bells_chimes.mp3",
    category: "musical",
    duration: 1800 // 30 minutes
  },
  {
    title: "Lullaby Therapy for Adults",
    audioUrl: "http://localhost:5000/sounds/lullaby_therapy_adults.mp3",
    category: "musical",
    duration: 3600 // 60 minutes
  },

  // Joyful Category
  {
    title: "Morning Energy Boost",
    audioUrl: "http://localhost:5000/sounds/morning_energy_boost.mp3",
    category: "joyful",
    duration: 1200 // 20 minutes
  },
  {
    title: "Happiness Frequency Mix",
    audioUrl: "http://localhost:5000/sounds/happiness_frequency_mix.mp3",
    category: "joyful",
    duration: 1800 // 30 minutes
  },
  {
    title: "Uplifting Bird Songs",
    audioUrl: "http://localhost:5000/sounds/uplifting_bird_songs.mp3",
    category: "joyful",
    duration: 2400 // 40 minutes
  },
  {
    title: "Children's Laughter Therapy",
    audioUrl: "http://localhost:5000/sounds/children_laughter_therapy.mp3",
    category: "joyful",
    duration: 900 // 15 minutes
  },
  {
    title: "Celebration Soundscape",
    audioUrl: "http://localhost:5000/sounds/celebration_soundscape.mp3",
    category: "joyful",
    duration: 1500 // 25 minutes
  },
  {
    title: "Positive Affirmation Background",
    audioUrl: "http://localhost:5000/sounds/positive_affirmation_background.mp3",
    category: "joyful",
    duration: 2100 // 35 minutes
  },
  {
    title: "Sunshine Vibes Ambient",
    audioUrl: "http://localhost:5000/sounds/sunshine_vibes_ambient.mp3",
    category: "joyful",
    duration: 1800 // 30 minutes
  },
  {
    title: "Dance of Life Rhythms",
    audioUrl: "http://localhost:5000/sounds/dance_of_life_rhythms.mp3",
    category: "joyful",
    duration: 2700 // 45 minutes
  },
  {
    title: "Gratitude Meditation Music",
    audioUrl: "http://localhost:5000/sounds/gratitude_meditation_music.mp3",
    category: "joyful",
    duration: 2400 // 40 minutes
  },
  {
    title: "Spring Awakening Sounds",
    audioUrl: "http://localhost:5000/sounds/spring_awakening_sounds.mp3",
    category: "joyful",
    duration: 3000 // 50 minutes
  },

  // Natural Category
  {
    title: "Ocean Waves Eternal",
    audioUrl: "http://localhost:5000/sounds/ocean_waves_eternal.mp3",
    category: "natural",
    duration: 3600 // 60 minutes
  },
  {
    title: "Rainforest Ambiance",
    audioUrl: "http://localhost:5000/sounds/rainforest_ambiance.mp3",
    category: "natural",
    duration: 4200 // 70 minutes
  },
  {
    title: "Mountain Stream Serenity",
    audioUrl: "http://localhost:5000/sounds/mountain_stream_serenity.mp3",
    category: "natural",
    duration: 3300 // 55 minutes
  },
  {
    title: "Thunderstorm Relaxation",
    audioUrl: "http://localhost:5000/sounds/thunderstorm_relaxation.mp3",
    category: "natural",
    duration: 2700 // 45 minutes
  },
  {
    title: "Wind Through Trees",
    audioUrl: "http://localhost:5000/sounds/wind_through_trees.mp3",
    category: "natural",
    duration: 3600 // 60 minutes
  },
  {
    title: "Crackling Fireplace Comfort",
    audioUrl: "http://localhost:5000/sounds/crackling_fireplace_comfort.mp3",
    category: "natural",
    duration: 5400 // 90 minutes
  },
  {
    title: "Desert Night Sounds",
    audioUrl: "http://localhost:5000/sounds/desert_night_sounds.mp3",
    category: "natural",
    duration: 2400 // 40 minutes
  },
  {
    title: "Garden Birds Morning Chorus",
    audioUrl: "http://localhost:5000/sounds/garden_birds_morning_chorus.mp3",
    category: "natural",
    duration: 1800 // 30 minutes
  },
  {
    title: "Whale Songs Deep Ocean",
    audioUrl: "http://localhost:5000/sounds/whale_songs_deep_ocean.mp3",
    category: "natural",
    duration: 3000 // 50 minutes
  },
  {
    title: "Forest Night Symphony",
    audioUrl: "http://localhost:5000/sounds/forest_night_symphony.mp3",
    category: "natural",
    duration: 4800 // 80 minutes
  }
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