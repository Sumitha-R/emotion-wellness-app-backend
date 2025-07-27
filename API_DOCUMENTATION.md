# Emotion Wellness Companion - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Routes

### POST /user/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST /user/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 📝 Journal Routes

### POST /journal/add
Add a new journal entry. **Requires authentication.**

**Request Body:**
```json
{
  "title": "My Day",
  "content": "Today was a good day because...",
  "mood": "happy",
  "tags": ["gratitude", "work", "family"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Journal entry added successfully",
  "journal": {
    "id": "journal_id",
    "title": "My Day",
    "content": "Today was a good day because...",
    "mood": "happy",
    "tags": ["gratitude", "work", "family"],
    "userId": "user_id",
    "createdAt": "2025-07-24T10:30:00Z"
  }
}
```

### GET /journal
Get user's journal entries with optional filtering. **Requires authentication.**

**Query Parameters:**
- `mood` (optional): Filter by mood
- `tag` (optional): Filter by tag
- `limit` (optional): Number of entries to return (default: 20)
- `offset` (optional): Number of entries to skip (default: 0)
- `startDate` (optional): Filter entries from this date
- `endDate` (optional): Filter entries until this date

**Response:**
```json
{
  "success": true,
  "journals": [
    {
      "id": "journal_id",
      "title": "My Day",
      "content": "Today was a good day because...",
      "mood": "happy",
      "tags": ["gratitude", "work"],
      "createdAt": "2025-07-24T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## 🎵 Sound Therapy Routes

### GET /sound
Get available sound therapy tracks with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (brain_frequency, healing, musical, joyful, natural)
- `limit` (optional): Number of tracks to return (default: 20)
- `offset` (optional): Number of tracks to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "sounds": [
    {
      "id": "sound_id",
      "title": "Alpha Waves - 8-12Hz Focus",
      "audioUrl": "http://localhost:5000/sounds/alpha_waves_focus.mp3",
      "category": "brain_frequency",
      "duration": 1800,
      "createdAt": "2025-07-24T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 85,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### GET /sound/categories
Get available sound therapy categories.

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "name": "brain_frequency",
      "count": 15,
      "description": "Brainwave entrainment frequencies"
    },
    {
      "name": "healing",
      "count": 20,
      "description": "Healing and therapeutic sounds"
    },
    {
      "name": "musical",
      "count": 18,
      "description": "Musical compositions for wellness"
    },
    {
      "name": "joyful",
      "count": 16,
      "description": "Uplifting and joyful sounds"
    },
    {
      "name": "natural",
      "count": 16,
      "description": "Nature sounds and ambient audio"
    }
  ]
}
```

---

## 😊 Emotion Tracking Routes

### POST /dashboard/emotions
Log a new emotion entry. **Requires authentication.**

**Request Body:**
```json
{
  "emotionType": "happy",
  "intensity": 8,
  "triggers": ["good news", "sunny weather"],
  "description": "Feeling great after receiving positive feedback",
  "mood_context": {
    "location": "home",
    "weather": "sunny",
    "activity": "working",
    "social_situation": "alone"
  },
  "coping_strategies_used": ["deep_breathing", "music"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emotion logged successfully",
  "emotion": {
    "id": "emotion_id",
    "userId": "user_id",
    "emotionType": "happy",
    "intensity": 8,
    "triggers": ["good news", "sunny weather"],
    "description": "Feeling great after receiving positive feedback",
    "timestamp": "2025-07-24T10:30:00Z",
    "mood_context": {
      "location": "home",
      "weather": "sunny",
      "activity": "working",
      "social_situation": "alone"
    }
  }
}
```

### GET /dashboard/emotions
Get user's emotion entries with filtering. **Requires authentication.**

**Query Parameters:**
- `emotionType` (optional): Filter by emotion type
- `startDate` (optional): Filter from this date
- `endDate` (optional): Filter until this date
- `limit` (optional): Number of entries (default: 20)
- `offset` (optional): Number to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "emotions": [
    {
      "id": "emotion_id",
      "emotionType": "happy",
      "intensity": 8,
      "triggers": ["good news"],
      "description": "Feeling great",
      "timestamp": "2025-07-24T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 30,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### GET /dashboard/emotions/analytics
Get emotion analytics and insights. **Requires authentication.**

**Query Parameters:**
- `period` (optional): time period (week, month, quarter, year) - default: month

**Response:**
```json
{
  "success": true,
  "analytics": {
    "mostFrequentEmotion": "happy",
    "averageIntensity": 6.8,
    "totalEntries": 45,
    "emotionDistribution": {
      "happy": 15,
      "calm": 12,
      "anxious": 8,
      "sad": 5,
      "excited": 5
    },
    "intensityTrends": [
      {
        "date": "2025-07-20",
        "averageIntensity": 7.2
      },
      {
        "date": "2025-07-21",
        "averageIntensity": 6.5
      }
    ],
    "commonTriggers": [
      {
        "trigger": "work stress",
        "count": 8
      },
      {
        "trigger": "good news",
        "count": 6
      }
    ]
  }
}
```

---

## 🎯 Challenge Routes

### GET /challenges
Get available challenges with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (mindfulness, gratitude, self_reflection, etc.)
- `difficulty_level` (optional): Filter by difficulty (beginner, intermediate, advanced)
- `frequency` (optional): Filter by frequency (daily, weekly, monthly, one_time)
- `limit` (optional): Number of challenges (default: 20)
- `offset` (optional): Number to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "challenges": [
    {
      "id": "challenge_id",
      "title": "5-Minute Morning Mindfulness",
      "description": "Start your day with a brief mindfulness practice...",
      "category": "mindfulness",
      "difficulty_level": "beginner",
      "estimated_duration": 5,
      "frequency": "daily",
      "benefits": [
        "Reduces stress and anxiety",
        "Improves focus and concentration"
      ],
      "tags": ["breathing", "meditation", "morning"]
    }
  ],
  "pagination": {
    "total": 12,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

### GET /challenges/:id
Get a specific challenge by ID. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "challenge": {
    "id": "challenge_id",
    "title": "5-Minute Morning Mindfulness",
    "description": "Start your day with a brief mindfulness practice...",
    "category": "mindfulness",
    "difficulty_level": "beginner",
    "estimated_duration": 5,
    "instructions": [
      {
        "step_number": 1,
        "instruction": "Find a quiet, comfortable place to sit"
      },
      {
        "step_number": 2,
        "instruction": "Close your eyes and take three deep breaths"
      }
    ],
    "prompts": [
      "How did you feel before the practice?",
      "What did you notice during the breathing exercise?"
    ],
    "benefits": [
      "Reduces stress and anxiety",
      "Improves focus and concentration"
    ],
    "frequency": "daily"
  },
  "userProgress": {
    "status": "not_started",
    "completion_streak": 0
  }
}
```

### POST /challenges/start
Start a challenge. **Requires authentication.**

**Request Body:**
```json
{
  "challengeId": "challenge_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Challenge started successfully",
  "userChallenge": {
    "id": "user_challenge_id",
    "userId": "user_id",
    "challengeId": "challenge_id",
    "status": "in_progress",
    "started_at": "2025-07-24T10:30:00Z"
  },
  "challenge": {
    "title": "5-Minute Morning Mindfulness",
    "estimated_duration": 5
  }
}
```

### POST /challenges/:challengeId/complete
Complete a challenge. **Requires authentication.**

**Request Body:**
```json
{
  "user_response": "I felt much calmer after the breathing exercise...",
  "rating": 4,
  "feedback": "Great exercise, will do again tomorrow"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Challenge completed successfully",
  "userChallenge": {
    "id": "user_challenge_id",
    "status": "completed",
    "completed_at": "2025-07-24T10:35:00Z",
    "user_response": "I felt much calmer after the breathing exercise...",
    "rating": 4,
    "completion_streak": 1
  }
}
```

### GET /challenges/user
Get user's challenge progress. **Requires authentication.**

**Query Parameters:**
- `status` (optional): Filter by status (not_started, in_progress, completed, skipped)
- `limit` (optional): Number of entries (default: 20)
- `offset` (optional): Number to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "userChallenges": [
    {
      "id": "user_challenge_id",
      "status": "completed",
      "started_at": "2025-07-24T10:30:00Z",
      "completed_at": "2025-07-24T10:35:00Z",
      "rating": 4,
      "completion_streak": 1,
      "challengeId": {
        "title": "5-Minute Morning Mindfulness",
        "category": "mindfulness",
        "difficulty_level": "beginner"
      }
    }
  ],
  "statistics": {
    "completed": 5,
    "in_progress": 2,
    "skipped": 1,
    "not_started": 0
  },
  "pagination": {
    "total": 8,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

### GET /challenges/recommendations
Get personalized challenge recommendations. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "challenge_id",
      "title": "Gratitude Letter Writing",
      "description": "Write a heartfelt letter to someone who has positively impacted your life.",
      "category": "gratitude",
      "difficulty_level": "intermediate",
      "estimated_duration": 30,
      "benefits": [
        "Strengthens relationships",
        "Increases appreciation for others"
      ]
    }
  ]
}
```

---

## 📊 Dashboard Routes

### GET /dashboard/mood-graph
Get mood analytics and trends. **Requires authentication.**

**Query Parameters:**
- `period` (optional): time period (week, month, quarter) - default: month

**Response:**
```json
{
  "success": true,
  "moodData": {
    "averageMood": 7.2,
    "moodTrend": "improving",
    "weeklyData": [
      {
        "week": "2025-07-14",
        "averageMood": 6.8,
        "entries": 12
      },
      {
        "week": "2025-07-21",
        "averageMood": 7.6,
        "entries": 15
      }
    ],
    "moodDistribution": {
      "happy": 25,
      "calm": 20,
      "neutral": 15,
      "anxious": 10,
      "sad": 5
    }
  }
}
```

---

## 📋 Error Responses

All endpoints may return these common error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request data",
  "error": "Specific error description"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error while processing request",
  "error": "Specific error description"
}
```

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

3. **Seed the database:**
   ```bash
   node seedSounds.js
   node seedChallenges.js
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Test the API:**
   Use tools like Thunder Client, Postman, or curl to test the endpoints.

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- JWT tokens expire after 7 days by default
- File uploads for audio are not yet implemented
- Rate limiting is not currently implemented
- All successful responses include `"success": true`
- Pagination is available on list endpoints with `limit` and `offset` parameters
