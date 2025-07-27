const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Sample data to test API endpoints
const sampleSoundTherapy = {
  title: "Ocean Waves Relaxation",
  type: "nature_sounds",
  description: "Calming ocean sounds for stress relief",
  audio_url: "https://example.com/ocean.mp3",
  duration: 1800,
  tags: ["ocean", "relaxation", "nature"],
  therapeutic_benefits: ["relaxation", "stress_relief", "calmness"],
  difficulty_level: "beginner",
  rating: 4.8
};

const sampleBook = {
  title: "The Anxiety and Worry Workbook",
  author: "David A. Clark",
  type: "self_help",
  description: "A practical guide to managing anxiety",
  therapeutic_focus: ["anxiety_management", "emotional_regulation"],
  difficulty_level: "beginner",
  rating: 4.5,
  recommended_for_mood: ["anxious", "stressed"],
  is_free: false
};

const samplePodcast = {
  title: "Mindful Breathing for Beginners",
  host: "Dr. Sarah Johnson",
  type: "guided_meditation",
  description: "Learn basic breathing techniques for stress relief",
  audio_url: "https://example.com/breathing.mp3",
  duration: 900,
  therapeutic_focus: ["stress_management", "anxiety_relief"],
  difficulty_level: "beginner",
  rating: 4.7,
  recommended_for_mood: ["anxious", "stressed"],
  is_premium: false
};

async function testMediaAPIs() {
  try {
    console.log('🧪 Testing Media APIs...\n');

    // Test Sound Therapy API
    console.log('🎵 Testing Sound Therapy API:');
    try {
      const soundResponse = await axios.post(`${BASE_URL}/sound`, sampleSoundTherapy);
      console.log(`   ✅ POST /sound: ${soundResponse.status} - Sound therapy created`);
      
      const soundsResponse = await axios.get(`${BASE_URL}/sound`);
      console.log(`   ✅ GET /sound: ${soundsResponse.status} - Found ${soundsResponse.data.sounds?.length || 0} sounds`);
      
      // Test mood-based recommendations
      const moodSoundsResponse = await axios.get(`${BASE_URL}/sound?mood=anxious`);
      console.log(`   ✅ GET /sound?mood=anxious: ${moodSoundsResponse.status} - Found ${moodSoundsResponse.data.sounds?.length || 0} recommendations`);
    } catch (error) {
      console.log(`   ❌ Sound API Error: ${error.response?.status || error.message}`);
    }

    // Test Book Recommendation API  
    console.log('\n📚 Testing Book Recommendation API:');
    try {
      const bookResponse = await axios.post(`${BASE_URL}/books`, sampleBook);
      console.log(`   ✅ POST /books: ${bookResponse.status} - Book recommendation created`);
      
      const booksResponse = await axios.get(`${BASE_URL}/books`);
      console.log(`   ✅ GET /books: ${booksResponse.status} - Found ${booksResponse.data.books?.length || 0} books`);
      
      // Test mood-based recommendations
      const moodBooksResponse = await axios.get(`${BASE_URL}/books?mood=anxious`);
      console.log(`   ✅ GET /books?mood=anxious: ${moodBooksResponse.status} - Found ${moodBooksResponse.data.books?.length || 0} recommendations`);
    } catch (error) {
      console.log(`   ❌ Books API Error: ${error.response?.status || error.message}`);
    }

    // Test Therapy Podcast API
    console.log('\n🎧 Testing Therapy Podcast API:');
    try {
      const podcastResponse = await axios.post(`${BASE_URL}/podcasts`, samplePodcast);
      console.log(`   ✅ POST /podcasts: ${podcastResponse.status} - Therapy podcast created`);
      
      const podcastsResponse = await axios.get(`${BASE_URL}/podcasts`);
      console.log(`   ✅ GET /podcasts: ${podcastsResponse.status} - Found ${podcastsResponse.data.podcasts?.length || 0} podcasts`);
      
      // Test mood-based recommendations
      const moodPodcastsResponse = await axios.get(`${BASE_URL}/podcasts?mood=stressed`);
      console.log(`   ✅ GET /podcasts?mood=stressed: ${moodPodcastsResponse.status} - Found ${moodPodcastsResponse.data.podcasts?.length || 0} recommendations`);
    } catch (error) {
      console.log(`   ❌ Podcasts API Error: ${error.response?.status || error.message}`);
    }

    console.log('\n🎯 Available API Endpoints:');
    console.log('   Sound Therapy:');
    console.log('     POST /sound - Add new sound therapy');
    console.log('     GET /sound - Get all sound therapies');
    console.log('     GET /sound?mood=anxious - Get by mood');
    console.log('     GET /sound?type=nature_sounds - Get by type');
    console.log('     POST /sound/:id/play - Track play count');
    console.log('');
    console.log('   Book Recommendations:');
    console.log('     POST /books - Add new book');
    console.log('     GET /books - Get all books');
    console.log('     GET /books?mood=healing - Get by mood');
    console.log('     GET /books/type/:type - Get by type');
    console.log('     POST /books/:id/read - Track read count');
    console.log('');
    console.log('   Therapy Podcasts:');
    console.log('     POST /podcasts - Add new podcast');
    console.log('     GET /podcasts - Get all podcasts');
    console.log('     GET /podcasts?mood=confused - Get by mood');
    console.log('     GET /podcasts/type/:type - Get by type');
    console.log('     POST /podcasts/:id/listen - Track listen count');

    console.log('\n✅ Media API testing completed!');

  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
}

testMediaAPIs();
