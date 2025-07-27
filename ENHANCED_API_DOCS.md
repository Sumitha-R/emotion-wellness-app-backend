# Emotion Wellness Companion - Enhanced API Documentation

## 🚀 Base URL
```
http://localhost:5000
```

## 🔐 Authentication
All protected endpoints require JWT authentication via Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📊 NEW: Dashboard Analytics Endpoints

### Get Comprehensive Dashboard Analytics
**GET** `/dashboard/analytics`

**Query Parameters:**
- `timeframe` (optional): `week`, `month`, `year` (default: `month`)

**Response:**
```json
{
  "success": true,
  "analytics": {
    "timeframe": "month",
    "challenges": {
      "completed": 5,
      "in_progress": 2,
      "skipped": 1
    },
    "emotions": [
      {
        "date": "2025-07-24",
        "emotion": "happy",
        "averageIntensity": 8.5,
        "count": 3
      }
    ],
    "journalEntries": 12,
    "improvement": {
      "mood": 15.5,
      "activity": 20.0,
      "overall": 17.75
    }
  }
}
```

### Get Emotion Line Graph Data 📈
**GET** `/dashboard/emotion-line-graph`

**Query Parameters:**
- `days` (optional): Number of days to include (default: 30)

**Response:**
```json
{
  "success": true,
  "lineGraph": [
    {
      "date": "2025-07-24",
      "moodScore": 7.5,
      "entries": 4,
      "topEmotions": ["happy", "calm", "grateful"]
    }
  ],
  "summary": {
    "totalDays": 30,
    "avgMoodScore": 7.2,
    "totalEntries": 85
  }
}
```

### Get Monthly Improvement Percentage 📊
**GET** `/dashboard/monthly-improvement`

**Response:**
```json
{
  "success": true,
  "monthlyImprovement": {
    "currentMonth": {
      "period": "July 2025",
      "averageMood": 7.5,
      "challengesCompleted": 12,
      "journalEntries": 20
    },
    "previousMonth": {
      "period": "June 2025",
      "averageMood": 6.8,
      "challengesCompleted": 8,
      "journalEntries": 15
    },
    "improvement": {
      "moodImprovement": 10.29,
      "activityIncrease": 39.13,
      "overallProgress": 24.71
    }
  }
}
```

### Log Emotion Entry
**POST** `/dashboard/log-emotion`

**Request Body:**
```json
{
  "emotion": "happy",
  "intensity": 8,
  "context": "Completed a challenging workout",
  "triggers": ["exercise", "achievement"],
  "coping_strategies_used": ["deep breathing"]
}
```

---

## 🎯 Enhanced Challenge System

### List All Challenges (6+ Categories)
**GET** `/challenge`

**Available Categories:**
- `mindfulness` - Breathing exercises, meditation
- `gratitude` - Appreciation practices
- `self_reflection` - Values clarification, journaling
- `goal_setting` - SMART goals, planning
- `emotional_regulation` - Emotion labeling, reframing
- `stress_management` - Progressive relaxation, worry time
- `creativity` - Creative expression, art therapy
- `physical_wellness` - Mindful movement
- `social_connection` - Meaningful conversations
- `daily_habit` - Digital wellness, routines
- `personal_growth` - Comfort zone expansion

**Sample Challenges Added:**
1. **Progressive Muscle Relaxation** (stress_management)
2. **Emotion Labeling Practice** (emotional_regulation)  
3. **SMART Goal Setting Workshop** (goal_setting)
4. **Creative Expression Journal** (creativity)
5. **And many more...**

---

## 📈 Monthly Improvement Calculation Logic

The system calculates improvement percentages by comparing current vs previous month:

### Calculation Formula:
```javascript
// Mood Improvement
moodImprovement = ((currentAvgMood - previousAvgMood) / previousAvgMood) * 100

// Activity Increase  
activityIncrease = ((currentActivities - previousActivities) / previousActivities) * 100

// Overall Progress
overallProgress = (moodImprovement + activityIncrease) / 2
```

### Example:
- **Previous Month**: Avg Mood 6.8, Activities 23
- **Current Month**: Avg Mood 7.5, Activities 32
- **Result**: 
  - Mood Improvement: 10.29%
  - Activity Increase: 39.13%
  - Overall Progress: 24.71%

---

## 💡 Frontend Integration Examples

### Line Graph Implementation
```javascript
// Perfect for Chart.js or any charting library
const response = await fetch('/dashboard/emotion-line-graph?days=30', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { lineGraph } = await response.json();

// lineGraph contains: {date, moodScore, entries, topEmotions}
// Use moodScore for Y-axis, date for X-axis
```

### Progress Dashboard
```javascript
const improvement = await fetch('/dashboard/monthly-improvement', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { monthlyImprovement } = await improvement.json();

// Display progress percentages:
console.log(`Mood improved by ${monthlyImprovement.improvement.moodImprovement}%`);
console.log(`Activity increased by ${monthlyImprovement.improvement.activityIncrease}%`);
console.log(`Overall progress: ${monthlyImprovement.improvement.overallProgress}%`);
```

---

## ✅ What's New & Tested

### ✅ Successfully Implemented:
1. **6+ Challenge Categories** with diverse exercises
2. **Emotion Tracking System** with 20+ emotion types
3. **Line Graph Data API** for mood visualization  
4. **Monthly Improvement Calculator** with percentage analysis
5. **Comprehensive Dashboard Analytics**
6. **MongoDB Integration** fully tested and working

### ✅ API Endpoints Tested:
- `/challenge` - Lists 6+ challenges ✅
- `/challenge/start` - Challenge initiation ✅
- `/challenge/:id/complete` - Completion with ratings ✅
- `/dashboard/analytics` - Comprehensive stats ✅
- `/dashboard/emotion-line-graph` - Graph data ✅
- `/dashboard/monthly-improvement` - Progress % ✅
- `/dashboard/log-emotion` - Emotion logging ✅

### 📊 Sample Data Available:
- **6 Challenges** across different categories
- **4 Emotion Entries** for testing graphs
- **1 Completed Challenge** with 5-star rating
- **Test User** with valid authentication

---

## 🚀 Ready for Frontend!

Your emotion wellness backend now includes:
- **Advanced Analytics** with percentage improvements
- **Line Graph Data** for mood visualization
- **Diverse Challenge Library** (10+ categories)
- **Monthly Progress Tracking** 
- **Comprehensive Dashboard** APIs

Perfect for creating engaging frontend dashboards with charts showing emotional progress over time! 📈✨
