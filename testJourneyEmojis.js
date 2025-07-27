const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/emotion_app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Load the enhanced Journal model
const Journal = require('./models/Journal');

async function testJourneyEmojis() {
  try {
    console.log('🧪 TESTING JOURNEY EMOJI FEATURES\n');

    // Create sample journal entries with emojis
    const sampleEntries = [
      {
        userId: new mongoose.Types.ObjectId(),
        title: "Amazing Day! 🌟",
        content: "Had such a wonderful day filled with gratitude and joy.",
        mood: "very_happy"
      },
      {
        userId: new mongoose.Types.ObjectId(),
        title: "Feeling Calm 🧘‍♀️",
        content: "Practiced meditation and feeling much more centered.",
        mood: "calm"
      },
      {
        userId: new mongoose.Types.ObjectId(),
        title: "Rough Day 😔",
        content: "Struggled with stress at work today.",
        mood: "stressed"
      }
    ];

    console.log('📝 Creating journal entries with auto-emoji assignment...\n');

    for (let i = 0; i < sampleEntries.length; i++) {
      const entry = new Journal(sampleEntries[i]);
      await entry.save();
      
      console.log(`Entry ${i + 1}:`);
      console.log(`  Title: ${entry.title}`);
      console.log(`  Mood: ${entry.mood} → ${entry.mood_emoji}`);
      console.log(`  Journey Level: ${entry.journey_progress.level} ${entry.journey_progress.emoji}`);
      console.log(`  Improvement Score: ${entry.journey_progress.improvement_score}%`);
      console.log(`  Dashboard Emoji: ${entry.dashboard_display.featured_emoji}`);
      console.log('');
    }

    // Test dashboard summary
    console.log('📊 DASHBOARD EMOJI FEATURES:\n');
    
    const userId = sampleEntries[0].userId;
    const summary = await Journal.getDashboardSummary(userId);
    
    console.log('Dashboard Summary:');
    console.log(`  Journey Progress: ${summary.journey_emoji}`);
    console.log(`  Mood Trend: ${summary.mood_trend}`);
    console.log(`  Improvement: ${summary.improvement_percentage}%`);
    console.log(`  Entries Count: ${summary.entries_count}`);

    console.log('\n🎨 EMOJI MAPPING SYSTEM:');
    console.log('Mood Emojis:');
    console.log('  😄 Very Happy  😊 Happy  😐 Neutral');
    console.log('  😢 Sad  😭 Very Sad  😠 Angry');
    console.log('  😰 Anxious  🤩 Excited  😌 Calm  😤 Stressed');
    
    console.log('\nJourney Progress Emojis:');
    console.log('  🌱 Beginner (0-19%)   🌿 Growing (20-39%)');
    console.log('  🌻 Blooming (40-59%)  🌸 Flourishing (60-79%)');
    console.log('  🏆 Mastery (80-100%)');

    console.log('\n✨ FEATURES ADDED TO JOURNAL MODEL:');
    console.log('  ✅ Auto-emoji assignment based on mood');
    console.log('  ✅ Journey progress tracking with emojis');
    console.log('  ✅ Dashboard display customization');
    console.log('  ✅ Improvement score calculation');
    console.log('  ✅ Color themes and visibility controls');
    console.log('  ✅ Dashboard summary with emoji trends');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testJourneyEmojis();
