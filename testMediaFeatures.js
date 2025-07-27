const mongoose = require('mongoose');
const SoundTherapy = require('./server/models/SoundTherapy');
const BookRecommendation = require('./server/models/BookRecommendation');
const TherapyPodcast = require('./server/models/TherapyPodcast');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/emotion_app');

async function testMediaFeatures() {
  try {
    console.log('🧪 Testing Sound Therapy, Books, and Podcasts Features...\n');

    // Test Sound Therapy Features
    console.log('🎵 SOUND THERAPY TESTS:');
    
    // Get all sound therapies
    const allSounds = await SoundTherapy.find();
    console.log(`   📊 Total sound therapies: ${allSounds.length}`);
    
    // Test mood-based recommendations
    const anxiousSounds = await SoundTherapy.getRecommendedByMood('anxious');
    console.log(`   😰 Sound recommendations for anxious mood: ${anxiousSounds.length}`);
    if (anxiousSounds.length > 0) {
      console.log(`      → "${anxiousSounds[0].title}" (${anxiousSounds[0].type})`);
    }
    
    // Test by therapeutic benefits
    const sleepSounds = await SoundTherapy.getByBenefits(['deep_sleep', 'relaxation']);
    console.log(`   😴 Sounds for sleep benefits: ${sleepSounds.length}`);
    
    // Test by type
    const natureSounds = await SoundTherapy.find({ type: 'nature_sounds' });
    console.log(`   🌿 Nature sounds: ${natureSounds.length}`);

    console.log('\n📚 BOOK RECOMMENDATION TESTS:');
    
    // Get all books
    const allBooks = await BookRecommendation.find();
    console.log(`   📊 Total book recommendations: ${allBooks.length}`);
    
    // Test mood-based recommendations
    const healingBooks = await BookRecommendation.getRecommendedByMood('healing');
    console.log(`   🔮 Book recommendations for healing mood: ${healingBooks.length}`);
    if (healingBooks.length > 0) {
      console.log(`      → "${healingBooks[0].title}" by ${healingBooks[0].author}`);
    }
    
    // Test by therapeutic focus
    const anxietyBooks = await BookRecommendation.getByTherapeuticFocus(['anxiety_management']);
    console.log(`   😰 Books for anxiety management: ${anxietyBooks.length}`);
    
    // Test by type
    const selfHelpBooks = await BookRecommendation.getByType('self_help');
    console.log(`   💪 Self-help books: ${selfHelpBooks.length}`);

    console.log('\n🎧 THERAPY PODCAST TESTS:');
    
    // Get all podcasts
    const allPodcasts = await TherapyPodcast.find();
    console.log(`   📊 Total therapy podcasts: ${allPodcasts.length}`);
    
    // Test mood-based recommendations
    const stressedPodcasts = await TherapyPodcast.getRecommendedByMood('stressed');
    console.log(`   😤 Podcast recommendations for stressed mood: ${stressedPodcasts.length}`);
    if (stressedPodcasts.length > 0) {
      console.log(`      → "${stressedPodcasts[0].title}" by ${stressedPodcasts[0].host}`);
    }
    
    // Test by therapeutic focus
    const sleepPodcasts = await TherapyPodcast.getByTherapeuticFocus(['sleep_improvement']);
    console.log(`   😴 Podcasts for sleep improvement: ${sleepPodcasts.length}`);
    
    // Test by type
    const meditationPodcasts = await TherapyPodcast.getByType('guided_meditation');
    console.log(`   🧘 Guided meditation podcasts: ${meditationPodcasts.length}`);

    console.log('\n🔄 INTERACTION TESTS:');
    
    // Test play count increment for sound
    if (allSounds.length > 0) {
      const testSound = allSounds[0];
      const originalPlayCount = testSound.play_count;
      await testSound.incrementPlayCount();
      console.log(`   ▶️ Sound play count: ${originalPlayCount} → ${testSound.play_count}`);
    }
    
    // Test read count increment for book
    if (allBooks.length > 0) {
      const testBook = allBooks[0];
      const originalReadCount = testBook.read_count;
      await testBook.incrementReadCount();
      console.log(`   📖 Book read count: ${originalReadCount} → ${testBook.read_count}`);
    }
    
    // Test listen count increment for podcast
    if (allPodcasts.length > 0) {
      const testPodcast = allPodcasts[0];
      const originalListenCount = testPodcast.listen_count;
      await testPodcast.incrementListenCount();
      console.log(`   🎧 Podcast listen count: ${originalListenCount} → ${testPodcast.listen_count}`);
    }

    console.log('\n🎯 MOOD-BASED RECOMMENDATION SUMMARY:');
    console.log('   Mood: anxious');
    console.log(`     - Sounds: ${anxiousSounds.length} recommendations`);
    console.log(`     - Books: ${(await BookRecommendation.getRecommendedByMood('anxious')).length} recommendations`);
    console.log(`     - Podcasts: ${(await TherapyPodcast.getRecommendedByMood('anxious')).length} recommendations`);
    
    console.log('   Mood: healing');
    console.log(`     - Sounds: ${(await SoundTherapy.getRecommendedByMood('sad')).length} recommendations`);
    console.log(`     - Books: ${healingBooks.length} recommendations`);
    console.log(`     - Podcasts: ${(await TherapyPodcast.getRecommendedByMood('healing')).length} recommendations`);

    console.log('\n✅ All media features tested successfully!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error testing media features:', error);
    mongoose.connection.close();
  }
}

testMediaFeatures();
