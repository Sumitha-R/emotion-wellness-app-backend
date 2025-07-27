const mongoose = require('mongoose');
const SoundTherapy = require('./server/models/SoundTherapy');
const BookRecommendation = require('./server/models/BookRecommendation');
const TherapyPodcast = require('./server/models/TherapyPodcast');
require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/emotion_app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

const soundTherapyData = [
  {
    title: "Deep Sleep Brainwave Entrainment",
    type: "brainwave_entrainment",
    description: "Delta wave frequencies to induce deep, restorative sleep",
    audio_url: "https://example.com/delta-sleep.mp3",
    duration: 3600, // 1 hour
    frequency: "0.5-4Hz",
    tags: ["sleep", "delta waves", "restoration"],
    therapeutic_benefits: ["deep_sleep", "relaxation", "insomnia_relief"],
    difficulty_level: "beginner",
    rating: 4.8
  },
  {
    title: "Focus Enhancement Alpha Waves",
    type: "brainwave_entrainment", 
    description: "Alpha wave frequencies to enhance concentration and mental clarity",
    audio_url: "https://example.com/alpha-focus.mp3",
    duration: 1800, // 30 minutes
    frequency: "8-12Hz",
    tags: ["focus", "alpha waves", "productivity"],
    therapeutic_benefits: ["concentration", "mental_clarity", "focus"],
    difficulty_level: "intermediate",
    rating: 4.6
  },
  {
    title: "Ocean Waves & Seagulls",
    type: "nature_sounds",
    description: "Calming ocean sounds with gentle seagull calls",
    audio_url: "https://example.com/ocean-waves.mp3",
    duration: 2400, // 40 minutes
    tags: ["ocean", "waves", "nature", "peaceful"],
    therapeutic_benefits: ["relaxation", "stress_relief", "calmness"],
    difficulty_level: "beginner",
    rating: 4.9
  },
  {
    title: "Forest Rain & Thunder",
    type: "nature_sounds",
    description: "Heavy raindrops in a lush forest with distant thunder",
    audio_url: "https://example.com/forest-rain.mp3",
    duration: 3000, // 50 minutes
    tags: ["rain", "forest", "thunder", "cozy"],
    therapeutic_benefits: ["relaxation", "sleep", "stress_relief"],
    difficulty_level: "beginner",
    rating: 4.7
  },
  {
    title: "Ambient Piano for Healing",
    type: "musical_therapy",
    description: "Soft piano melodies designed for emotional healing",
    audio_url: "https://example.com/healing-piano.mp3",
    duration: 2700, // 45 minutes
    tags: ["piano", "ambient", "healing", "emotional"],
    therapeutic_benefits: ["mood_uplift", "emotional_detox", "relaxation"],
    difficulty_level: "beginner",
    rating: 4.8
  },
  {
    title: "Root Chakra 396Hz Healing",
    type: "chakra_sound_therapy",
    description: "Solfeggio frequency for root chakra alignment and grounding",
    audio_url: "https://example.com/root-chakra.mp3",
    duration: 1200, // 20 minutes
    frequency: "396Hz",
    tags: ["chakra", "grounding", "healing", "solfeggio"],
    therapeutic_benefits: ["spiritual_wellbeing", "emotional_grounding", "trauma_healing"],
    difficulty_level: "intermediate",
    rating: 4.5
  },
  {
    title: "White Noise for Focus",
    type: "white_noise",
    description: "Pure white noise to mask distractions and enhance concentration",
    audio_url: "https://example.com/white-noise.mp3",
    duration: 1800, // 30 minutes
    tags: ["white noise", "focus", "concentration"],
    therapeutic_benefits: ["concentration", "focus", "sensory_overload_management"],
    difficulty_level: "beginner",
    rating: 4.4
  },
  {
    title: "Guided Body Scan Meditation",
    type: "guided_audio_therapy",
    description: "Gentle voice-guided body scan for deep relaxation",
    audio_url: "https://example.com/body-scan.mp3",
    duration: 1500, // 25 minutes
    tags: ["meditation", "body scan", "guided", "relaxation"],
    therapeutic_benefits: ["relaxation", "emotional_grounding", "stress_relief"],
    difficulty_level: "beginner",
    rating: 4.9
  },
  {
    title: "Gentle Rain Tapping ASMR",
    type: "asmr",
    description: "Soft rain tapping sounds for tingling relaxation",
    audio_url: "https://example.com/rain-tapping.mp3",
    duration: 900, // 15 minutes
    tags: ["asmr", "tapping", "tingling", "gentle"],
    therapeutic_benefits: ["stress_relief", "calmness", "relaxation"],
    difficulty_level: "beginner",
    rating: 4.6
  },
  {
    title: "Pink Noise for Sleep",
    type: "pink_noise",
    description: "Balanced pink noise frequencies for better sleep quality",
    audio_url: "https://example.com/pink-noise.mp3",
    duration: 3600, // 1 hour
    tags: ["pink noise", "sleep", "balance"],
    therapeutic_benefits: ["deep_sleep", "relaxation", "insomnia_relief"],
    difficulty_level: "beginner",
    rating: 4.7
  }
];

const bookRecommendationData = [
  {
    title: "The Power of Now",
    author: "Eckhart Tolle",
    cover_image_url: "https://example.com/power-of-now.jpg",
    type: "mindfulness",
    description: "A guide to spiritual enlightenment through present-moment awareness",
    read_link: "https://example.com/power-of-now",
    isbn: "9781577314806",
    publication_year: 1997,
    page_count: 236,
    tags: ["mindfulness", "spirituality", "present moment"],
    therapeutic_focus: ["anxiety_management", "mindfulness_practice", "emotional_regulation"],
    difficulty_level: "intermediate",
    rating: 4.8,
    recommended_for_mood: ["anxious", "stressed", "confused"],
    is_free: false
  },
  {
    title: "Feeling Good: The New Mood Therapy",
    author: "David D. Burns",
    cover_image_url: "https://example.com/feeling-good.jpg",
    type: "psychology",
    description: "Evidence-based cognitive behavioral therapy techniques for depression",
    read_link: "https://example.com/feeling-good",
    isbn: "9780380810338",
    publication_year: 1980,
    page_count: 736,
    tags: ["cbt", "depression", "therapy"],
    therapeutic_focus: ["depression_support", "emotional_regulation", "confidence_building"],
    difficulty_level: "intermediate",
    rating: 4.9,
    recommended_for_mood: ["sad", "confused", "healing"],
    is_free: false
  },
  {
    title: "The Gifts of Imperfection",
    author: "Brené Brown",
    cover_image_url: "https://example.com/gifts-imperfection.jpg",
    type: "self_help",
    description: "Let go of who you think you're supposed to be and embrace who you are",
    read_link: "https://example.com/gifts-imperfection",
    isbn: "9781592858491",
    publication_year: 2010,
    page_count: 137,
    tags: ["self-acceptance", "vulnerability", "courage"],
    therapeutic_focus: ["self_love", "confidence_building", "emotional_regulation"],
    difficulty_level: "beginner",
    rating: 4.7,
    recommended_for_mood: ["confused", "healing", "motivated"],
    is_free: false
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    cover_image_url: "https://example.com/atomic-habits.jpg",
    type: "personal_development",
    description: "An easy and proven way to build good habits and break bad ones",
    read_link: "https://example.com/atomic-habits",
    isbn: "9780735211292",
    publication_year: 2018,
    page_count: 320,
    tags: ["habits", "productivity", "self-improvement"],
    therapeutic_focus: ["goal_achievement", "confidence_building", "emotional_regulation"],
    difficulty_level: "beginner",
    rating: 4.8,
    recommended_for_mood: ["motivated", "curious"],
    is_free: false
  },
  {
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    cover_image_url: "https://example.com/body-keeps-score.jpg",
    type: "psychology",
    description: "Brain, mind, and body in the healing of trauma",
    read_link: "https://example.com/body-keeps-score",
    isbn: "9780143127741",
    publication_year: 2014,
    page_count: 464,
    tags: ["trauma", "healing", "neuroscience"],
    therapeutic_focus: ["trauma_recovery", "emotional_regulation", "mindfulness_practice"],
    difficulty_level: "advanced",
    rating: 4.9,
    recommended_for_mood: ["healing", "confused"],
    is_free: false
  }
];

const therapyPodcastData = [
  {
    title: "The Anxiety Guy - Episode 15: Breathing for Calm",
    host: "Dennis Simsek",
    cover_image_url: "https://example.com/anxiety-guy.jpg",
    type: "mental_health",
    description: "Learn powerful breathing techniques to manage anxiety attacks",
    audio_url: "https://example.com/anxiety-breathing.mp3",
    duration: 1800, // 30 minutes
    episode_number: 15,
    season: 1,
    tags: ["anxiety", "breathing", "panic attacks"],
    therapeutic_focus: ["anxiety_relief", "stress_management", "emotional_regulation"],
    difficulty_level: "beginner",
    rating: 4.6,
    recommended_for_mood: ["anxious", "stressed"],
    is_premium: false,
    external_links: {
      spotify: "https://spotify.com/anxiety-guy",
      apple_podcasts: "https://podcasts.apple.com/anxiety-guy"
    }
  },
  {
    title: "Therapy for Black Girls - Self-Care Sunday",
    host: "Dr. Joy Harden Bradford",
    cover_image_url: "https://example.com/therapy-black-girls.jpg",
    type: "therapy_sessions",
    description: "Creating sustainable self-care practices for mental wellness",
    audio_url: "https://example.com/self-care-sunday.mp3",
    duration: 2400, // 40 minutes
    episode_number: 23,
    season: 2,
    tags: ["self-care", "wellness", "mental health"],
    therapeutic_focus: ["self_esteem_building", "stress_management", "emotional_regulation"],
    difficulty_level: "beginner",
    rating: 4.8,
    recommended_for_mood: ["healing", "motivated"],
    is_premium: false
  },
  {
    title: "Mindfulness-Based Stress Reduction",
    host: "Jon Kabat-Zinn",
    cover_image_url: "https://example.com/mbsr.jpg",
    type: "guided_meditation",
    description: "20-minute guided mindfulness meditation for stress relief",
    audio_url: "https://example.com/mbsr-meditation.mp3",
    duration: 1200, // 20 minutes
    episode_number: 1,
    season: 1,
    tags: ["mindfulness", "meditation", "stress relief"],
    therapeutic_focus: ["stress_management", "mindfulness_training", "anxiety_relief"],
    difficulty_level: "intermediate",
    rating: 4.9,
    recommended_for_mood: ["stressed", "anxious"],
    is_premium: true
  },
  {
    title: "Grief Out Loud - Moving Through Loss",
    host: "Jana DeCristofaro",
    cover_image_url: "https://example.com/grief-out-loud.jpg",
    type: "emotional_healing",
    description: "Understanding the grief process and finding hope",
    audio_url: "https://example.com/moving-through-loss.mp3",
    duration: 2700, // 45 minutes
    episode_number: 8,
    season: 1,
    tags: ["grief", "loss", "healing"],
    therapeutic_focus: ["grief_support", "emotional_regulation", "trauma_healing"],
    difficulty_level: "intermediate",
    rating: 4.7,
    recommended_for_mood: ["sad", "healing"],
    is_premium: false
  },
  {
    title: "Sleep Stories for Adults - Forest Walk",
    host: "Michelle's Sanctuary",
    cover_image_url: "https://example.com/sleep-stories.jpg",
    type: "wellness_tips",
    description: "Calming bedtime story to help you fall asleep peacefully",
    audio_url: "https://example.com/forest-walk-sleep.mp3",
    duration: 1800, // 30 minutes
    episode_number: 42,
    season: 3,
    tags: ["sleep", "stories", "relaxation"],
    therapeutic_focus: ["sleep_improvement", "stress_management", "anxiety_relief"],
    difficulty_level: "beginner",
    rating: 4.5,
    recommended_for_mood: ["stressed", "anxious"],
    is_premium: false
  }
];

async function seedData() {
  try {
    await connectDB();
    console.log('🌱 Starting to seed sound therapy, book, and podcast data...');

    // Clear existing data
    await SoundTherapy.deleteMany({});
    await BookRecommendation.deleteMany({});
    await TherapyPodcast.deleteMany({});

    // Insert new data
    const sounds = await SoundTherapy.insertMany(soundTherapyData);
    const books = await BookRecommendation.insertMany(bookRecommendationData);
    const podcasts = await TherapyPodcast.insertMany(therapyPodcastData);

    console.log(`✅ Successfully seeded:`);
    console.log(`   - ${sounds.length} sound therapies`);
    console.log(`   - ${books.length} book recommendations`);
    console.log(`   - ${podcasts.length} therapy podcasts`);

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    mongoose.connection.close();
  }
}

seedData();
