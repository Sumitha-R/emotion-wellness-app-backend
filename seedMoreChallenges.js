require('dotenv').config();
const mongoose = require('mongoose');
const { Challenge } = require('./server/models/Challenge');

const comprehensiveChallenges = [
  // Stress Management Challenges
  {
    title: 'Progressive Muscle Relaxation',
    description: 'Learn to release physical tension through systematic muscle relaxation.',
    category: 'stress_management',
    difficulty_level: 'intermediate',
    estimated_duration: 15,
    instructions: [
      { step_number: 1, instruction: 'Lie down comfortably' },
      { step_number: 2, instruction: 'Tense and relax each muscle group for 5 seconds' },
      { step_number: 3, instruction: 'Start from your toes and work up to your head' },
      { step_number: 4, instruction: 'Focus on the contrast between tension and relaxation' }
    ],
    prompts: ['Which muscle groups held the most tension?', 'How do you feel compared to before?'],
    benefits: ['Reduces physical stress', 'Improves sleep quality', 'Increases body awareness'],
    tags: ['relaxation', 'tension relief', 'sleep'],
    frequency: 'daily',
    is_active: true
  },
  {
    title: 'Worry Time Technique',
    description: 'Schedule dedicated time for worries to prevent them from consuming your day.',
    category: 'stress_management',
    difficulty_level: 'intermediate',
    estimated_duration: 20,
    instructions: [
      { step_number: 1, instruction: 'Set aside 15-20 minutes as your designated worry time' },
      { step_number: 2, instruction: 'Write down all your worries during this time' },
      { step_number: 3, instruction: 'Categorize them as actionable or non-actionable' },
      { step_number: 4, instruction: 'Make action plans for actionable worries' },
      { step_number: 5, instruction: 'Practice letting go of non-actionable worries' }
    ],
    prompts: ['What percentage of your worries were actionable?', 'How did it feel to contain your worries to a specific time?'],
    benefits: ['Reduces anxiety', 'Improves problem-solving', 'Increases mental clarity'],
    tags: ['anxiety', 'planning', 'mental health'],
    frequency: 'daily',
    is_active: true
  },

  // Emotional Regulation Challenges
  {
    title: 'Emotion Labeling Practice',
    description: 'Increase emotional intelligence by accurately identifying and naming your emotions.',
    category: 'emotional_regulation',
    difficulty_level: 'beginner',
    estimated_duration: 10,
    instructions: [
      { step_number: 1, instruction: 'Set 3 random alarms throughout your day' },
      { step_number: 2, instruction: 'When alarm goes off, pause and check in with yourself' },
      { step_number: 3, instruction: 'Name the emotion you are feeling as specifically as possible' },
      { step_number: 4, instruction: 'Rate the intensity from 1-10' },
      { step_number: 5, instruction: 'Write it down with the time and context' }
    ],
    prompts: ['What patterns did you notice in your emotions today?', 'Which emotions were hardest to identify?'],
    benefits: ['Increases emotional awareness', 'Improves emotion regulation', 'Enhances self-understanding'],
    tags: ['emotions', 'awareness', 'tracking'],
    frequency: 'daily',
    is_active: true
  },
  {
    title: 'Cognitive Reframing Exercise',
    description: 'Transform negative thought patterns into more balanced perspectives.',
    category: 'emotional_regulation',
    difficulty_level: 'advanced',
    estimated_duration: 25,
    instructions: [
      { step_number: 1, instruction: 'Identify a negative thought that bothered you today' },
      { step_number: 2, instruction: 'Write down the evidence supporting this thought' },
      { step_number: 3, instruction: 'Write down evidence against this thought' },
      { step_number: 4, instruction: 'Create a more balanced, realistic thought' },
      { step_number: 5, instruction: 'Notice how your feelings change with the new thought' }
    ],
    prompts: ['How did your emotions shift after reframing?', 'What patterns do you notice in your thinking?'],
    benefits: ['Reduces negative thinking', 'Improves mood', 'Increases resilience'],
    tags: ['cognitive therapy', 'reframing', 'mental health'],
    frequency: 'weekly',
    is_active: true
  },

  // Self-Reflection Challenges
  {
    title: 'Values Clarification Exercise',
    description: 'Identify and reflect on your core values to guide decision-making.',
    category: 'self_reflection',
    difficulty_level: 'intermediate',
    estimated_duration: 30,
    instructions: [
      { step_number: 1, instruction: 'List 20 values that resonate with you' },
      { step_number: 2, instruction: 'Narrow down to your top 10 values' },
      { step_number: 3, instruction: 'Rank your top 5 most important values' },
      { step_number: 4, instruction: 'Reflect on how well your current life aligns with these values' },
      { step_number: 5, instruction: 'Identify one change you could make to better honor your values' }
    ],
    prompts: ['Which values surprised you as being most important?', 'Where do you see the biggest gap between your values and current life?'],
    benefits: ['Increases self-awareness', 'Improves decision-making', 'Enhances life satisfaction'],
    tags: ['values', 'purpose', 'self-discovery'],
    frequency: 'monthly',
    is_active: true
  },

  // Goal Setting Challenges
  {
    title: 'SMART Goal Setting Workshop',
    description: 'Create specific, measurable, achievable, relevant, and time-bound goals.',
    category: 'goal_setting',
    difficulty_level: 'intermediate',
    estimated_duration: 45,
    instructions: [
      { step_number: 1, instruction: 'Choose one area of life you want to improve' },
      { step_number: 2, instruction: 'Write a specific goal using SMART criteria' },
      { step_number: 3, instruction: 'Break it down into 3-5 actionable steps' },
      { step_number: 4, instruction: 'Set deadlines for each step' },
      { step_number: 5, instruction: 'Identify potential obstacles and solutions' }
    ],
    prompts: ['What excites you most about achieving this goal?', 'What might prevent you from succeeding?'],
    benefits: ['Increases goal achievement', 'Improves planning skills', 'Boosts motivation'],
    tags: ['goals', 'planning', 'success'],
    frequency: 'weekly',
    is_active: true
  },

  // Physical Wellness Challenges
  {
    title: 'Mindful Movement Practice',
    description: 'Connect with your body through conscious, gentle movement.',
    category: 'physical_wellness',
    difficulty_level: 'beginner',
    estimated_duration: 20,
    instructions: [
      { step_number: 1, instruction: 'Find a comfortable space to move freely' },
      { step_number: 2, instruction: 'Start with gentle stretching' },
      { step_number: 3, instruction: 'Focus on how each movement feels' },
      { step_number: 4, instruction: 'Move only in ways that feel good to your body' },
      { step_number: 5, instruction: 'End with 2 minutes of stillness' }
    ],
    prompts: ['How did your body feel before and after?', 'What movements felt most natural?'],
    benefits: ['Improves body awareness', 'Reduces physical tension', 'Enhances mood'],
    tags: ['movement', 'body awareness', 'physical health'],
    frequency: 'daily',
    is_active: true
  },

  // Creativity Challenges
  {
    title: 'Creative Expression Journal',
    description: 'Express your emotions through creative writing, drawing, or other art forms.',
    category: 'creativity',
    difficulty_level: 'beginner',
    estimated_duration: 30,
    instructions: [
      { step_number: 1, instruction: 'Choose your preferred creative medium (writing, drawing, music, etc.)' },
      { step_number: 2, instruction: 'Set a timer for 20 minutes' },
      { step_number: 3, instruction: 'Create without judgment or planning' },
      { step_number: 4, instruction: 'Let your emotions guide your creation' },
      { step_number: 5, instruction: 'Reflect on what you created and how it felt' }
    ],
    prompts: ['What emotions came up during creation?', 'What surprises emerged in your work?'],
    benefits: ['Emotional release', 'Increased self-expression', 'Stress reduction'],
    tags: ['creativity', 'expression', 'art therapy'],
    frequency: 'weekly',
    is_active: true
  },

  // Social Connection Challenges
  {
    title: 'Meaningful Conversation Challenge',
    description: 'Deepen your relationships through intentional, meaningful conversations.',
    category: 'social_connection',
    difficulty_level: 'intermediate',
    estimated_duration: 60,
    instructions: [
      { step_number: 1, instruction: 'Choose someone you want to connect with more deeply' },
      { step_number: 2, instruction: 'Prepare 3-5 meaningful questions' },
      { step_number: 3, instruction: 'Set aside uninterrupted time for conversation' },
      { step_number: 4, instruction: 'Practice active listening without planning your response' },
      { step_number: 5, instruction: 'Share something vulnerable about yourself' }
    ],
    prompts: ['What did you learn about the other person?', 'How did it feel to be more vulnerable?'],
    benefits: ['Strengthens relationships', 'Increases intimacy', 'Reduces loneliness'],
    tags: ['relationships', 'communication', 'connection'],
    frequency: 'weekly',
    is_active: true
  },

  // Daily Habit Challenges
  {
    title: 'Digital Sunset Practice',
    description: 'Create better sleep and mental health by establishing a digital curfew.',
    category: 'daily_habit',
    difficulty_level: 'intermediate',
    estimated_duration: 120,
    instructions: [
      { step_number: 1, instruction: 'Choose a time 1-2 hours before bed for digital sunset' },
      { step_number: 2, instruction: 'Turn off all screens and devices' },
      { step_number: 3, instruction: 'Engage in calming activities (reading, bath, meditation)' },
      { step_number: 4, instruction: 'Prepare your environment for sleep' },
      { step_number: 5, instruction: 'Reflect on your day or practice gratitude' }
    ],
    prompts: ['How was your sleep quality?', 'What was challenging about avoiding screens?'],
    benefits: ['Improves sleep quality', 'Reduces anxiety', 'Increases mindfulness'],
    tags: ['sleep', 'digital wellness', 'evening routine'],
    frequency: 'daily',
    is_active: true
  },

  // Personal Growth Challenges
  {
    title: 'Comfort Zone Expansion',
    description: 'Grow by taking on small challenges that push your boundaries.',
    category: 'personal_growth',
    difficulty_level: 'advanced',
    estimated_duration: 60,
    instructions: [
      { step_number: 1, instruction: 'Identify something that makes you slightly uncomfortable but is safe' },
      { step_number: 2, instruction: 'Break it down into the smallest possible first step' },
      { step_number: 3, instruction: 'Take that first step today' },
      { step_number: 4, instruction: 'Notice your thoughts and feelings throughout' },
      { step_number: 5, instruction: 'Celebrate your courage regardless of the outcome' }
    ],
    prompts: ['What did you learn about yourself?', 'How did your confidence change?'],
    benefits: ['Builds confidence', 'Increases resilience', 'Expands possibilities'],
    tags: ['growth', 'courage', 'confidence'],
    frequency: 'weekly',
    is_active: true
  }
];

async function seedComprehensiveChallenges() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const inserted = await Challenge.insertMany(comprehensiveChallenges);
    console.log(`✅ ${inserted.length} comprehensive challenges seeded successfully!`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.disconnect();
  }
}

seedComprehensiveChallenges();
