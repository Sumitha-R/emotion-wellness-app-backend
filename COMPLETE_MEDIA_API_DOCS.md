# 🎵📚🎧 Sound Therapy, Books & Podcasts API Documentation

## Overview
This documentation covers the complete media therapy API endpoints for Sound Therapy, Book Recommendations, and Therapy Podcasts in your emotion wellness backend.

## 🎵 Sound Therapy API

### Models & Types

#### Sound Therapy Types:
- `brainwave_entrainment` - Uses rhythmic auditory stimulation to synchronize brain activity
- `nature_sounds` - Rain, ocean, forest, birds, wind, etc.
- `musical_therapy` - Soft ambient or instrumental music for mood regulation
- `chakra_sound_therapy` - Specific frequencies or chants to realign inner energy
- `white_noise` - Consistent frequencies to block distractions
- `pink_noise` - Balanced frequencies for sleep improvement
- `guided_audio_therapy` - Voice-based meditations or affirmations with sound
- `asmr` - Trigger-based sounds like whispering, tapping, etc.

#### Therapeutic Benefits:
- `deep_sleep`, `concentration`, `relaxation`, `mental_clarity`
- `mood_uplift`, `anxiety_reduction`, `spiritual_wellbeing`, `emotional_detox`
- `focus`, `sensory_overload_management`, `trauma_healing`, `emotional_grounding`
- `stress_relief`, `insomnia_relief`, `calmness`

### API Endpoints

```javascript
// Add new sound therapy
POST /sound
{
  "title": "Ocean Waves Relaxation",
  "type": "nature_sounds",
  "description": "Calming ocean sounds for stress relief",
  "audio_url": "https://example.com/ocean.mp3",
  "duration": 1800,
  "frequency": "40Hz", // Optional for brainwave entrainment
  "tags": ["ocean", "relaxation", "nature"],
  "therapeutic_benefits": ["relaxation", "stress_relief", "calmness"],
  "difficulty_level": "beginner",
  "rating": 4.8,
  "is_premium": false
}

// Get all sound therapies with filtering
GET /sound?type=nature_sounds&mood=anxious&difficulty=beginner&benefits=relaxation,calmness

// Get specific sound therapy
GET /sound/:id

// Track play count
POST /sound/:id/play

// Get recommendations by therapeutic benefits
POST /sound/recommendations/benefits
{
  "benefits": ["anxiety_reduction", "relaxation"]
}

// Get sound therapies by type
GET /sound/type/nature_sounds
```

---

## 📚 Book Recommendations API

### Models & Types

#### Book Types:
- `self_help`, `motivation`, `mental_wellness`, `psychology`
- `mindfulness`, `emotional_intelligence`, `personal_development`
- `healing`, `spirituality`, `stress_management`

#### Therapeutic Focus:
- `anxiety_management`, `depression_support`, `stress_relief`, `confidence_building`
- `relationship_healing`, `trauma_recovery`, `mindfulness_practice`, `emotional_regulation`
- `goal_achievement`, `self_love`, `forgiveness`, `gratitude_practice`

### API Endpoints

```javascript
// Add new book recommendation
POST /books
{
  "title": "The Power of Now",
  "author": "Eckhart Tolle",
  "type": "mindfulness",
  "description": "A guide to spiritual enlightenment through present-moment awareness",
  "read_link": "https://example.com/power-of-now",
  "isbn": "9781577314806",
  "publication_year": 1997,
  "page_count": 236,
  "tags": ["mindfulness", "spirituality", "present moment"],
  "therapeutic_focus": ["anxiety_management", "mindfulness_practice"],
  "difficulty_level": "intermediate",
  "rating": 4.8,
  "recommended_for_mood": ["anxious", "stressed", "confused"],
  "is_free": false
}

// Get all book recommendations with filtering
GET /books?type=self_help&mood=healing&difficulty=beginner&is_free=true

// Get specific book
GET /books/:id

// Track read count
POST /books/:id/read

// Get recommendations by therapeutic focus
POST /books/recommendations/focus
{
  "focus": ["anxiety_management", "emotional_regulation"]
}

// Get books by type
GET /books/type/self_help

// Search books by author
GET /books/search/author?author=Eckhart Tolle
```

---

## 🎧 Therapy Podcasts API

### Models & Types

#### Podcast Types:
- `mental_health`, `mindfulness`, `therapy_sessions`, `guided_meditation`
- `emotional_healing`, `psychology_education`, `wellness_tips`, `life_coaching`
- `spiritual_guidance`, `stress_management`

#### Therapeutic Focus:
- `anxiety_relief`, `depression_support`, `stress_management`, `relationship_counseling`
- `trauma_healing`, `addiction_recovery`, `self_esteem_building`, `emotional_regulation`
- `mindfulness_training`, `grief_support`, `anger_management`, `sleep_improvement`

### API Endpoints

```javascript
// Add new therapy podcast
POST /podcasts
{
  "title": "Mindful Breathing for Beginners",
  "host": "Dr. Sarah Johnson",
  "type": "guided_meditation",
  "description": "Learn basic breathing techniques for stress relief",
  "audio_url": "https://example.com/breathing.mp3",
  "duration": 900,
  "episode_number": 1,
  "season": 1,
  "tags": ["breathing", "meditation", "stress"],
  "therapeutic_focus": ["stress_management", "anxiety_relief"],
  "difficulty_level": "beginner",
  "rating": 4.7,
  "recommended_for_mood": ["anxious", "stressed"],
  "is_premium": false,
  "external_links": {
    "spotify": "https://spotify.com/...",
    "apple_podcasts": "https://podcasts.apple.com/..."
  }
}

// Get all therapy podcasts with filtering
GET /podcasts?type=guided_meditation&mood=stressed&host=Dr.%20Sarah&is_premium=false

// Get specific podcast
GET /podcasts/:id

// Track listen count
POST /podcasts/:id/listen

// Get recommendations by therapeutic focus
POST /podcasts/recommendations/focus
{
  "focus": ["anxiety_relief", "stress_management"]
}

// Get podcasts by type
GET /podcasts/type/guided_meditation

// Get podcasts by host
GET /podcasts/host/Dr.%20Sarah%20Johnson

// Get podcasts by season
GET /podcasts/season/1
```

---

## 🎯 Mood-Based Recommendations

All three APIs support mood-based filtering. The system automatically maps moods to appropriate therapeutic content:

### Mood Mappings:

**Anxious/Stressed:**
- Sounds: `relaxation`, `stress_relief`, `calmness`
- Books: Focus on `anxiety_management`, `stress_relief`
- Podcasts: `anxiety_relief`, `stress_management`

**Sad/Healing:**
- Sounds: `mood_uplift`, `emotional_detox`, `spiritual_wellbeing`
- Books: `depression_support`, `self_love`, `healing`
- Podcasts: `emotional_healing`, `grief_support`

**Angry:**
- Sounds: `calmness`, `emotional_grounding`
- Books: `anger_management`, `emotional_regulation`
- Podcasts: `anger_management`, `emotional_regulation`

**Tired/Unfocused:**
- Sounds: `deep_sleep`, `concentration`, `focus`
- Books: `mindfulness_practice`, `goal_achievement`
- Podcasts: `sleep_improvement`, `mindfulness_training`

### Usage Examples:

```javascript
// Get personalized recommendations for anxious mood
GET /sound?mood=anxious
GET /books?mood=anxious  
GET /podcasts?mood=anxious

// Get healing content for emotional recovery
GET /sound?mood=sad
GET /books?mood=healing
GET /podcasts?mood=healing
```

---

## 📊 Tracking & Analytics

All media types support usage tracking:

- **Sound Therapy**: `play_count` - tracks how many times each sound is played
- **Books**: `read_count` - tracks how many times each book is accessed
- **Podcasts**: `listen_count` - tracks how many times each podcast is listened to

### Tracking Endpoints:
```javascript
POST /sound/:id/play      // Increment play count
POST /books/:id/read      // Increment read count
POST /podcasts/:id/listen // Increment listen count
```

---

## 🔄 Integration with Emotion Tracking

These media APIs integrate seamlessly with your existing emotion tracking system:

1. **Mood Detection**: Based on journal entries and HRV data
2. **Automatic Recommendations**: System suggests appropriate media content
3. **Progress Tracking**: Monitor how media consumption affects emotional well-being
4. **Personalization**: Learn user preferences over time

### Dashboard Integration:
```javascript
// Example: Get recommendations based on current emotion state
const userMood = await detectCurrentMood(userId);
const soundRecommendations = await axios.get(`/sound?mood=${userMood}`);
const bookRecommendations = await axios.get(`/books?mood=${userMood}`);
const podcastRecommendations = await axios.get(`/podcasts?mood=${userMood}`);
```

---

## ✅ Complete Feature Set

Your emotion wellness backend now includes:

1. **Emotion Tracking** with HRV integration
2. **Challenge System** with short-term/long-term challenges
3. **Journal System** with emoji progress tracking
4. **Dashboard Analytics** with emoji visualization
5. **Sound Therapy** - 8 different types with mood-based recommendations
6. **Book Recommendations** - 10 categories with therapeutic focus
7. **Therapy Podcasts** - 10 types with external platform integration

All systems are production-ready with comprehensive API endpoints! 🚀
