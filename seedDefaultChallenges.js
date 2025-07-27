const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/emotion_app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use the enhanced challenge model
const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['stress_management', 'mindfulness', 'emotional_regulation', 'self_care', 'communication', 'gratitude', 'physical_wellness'],
    required: true 
  },
  difficulty_level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  duration_type: {
    type: String,
    enum: ['short_term', 'long_term'],
    required: true
  },
  estimated_duration: { type: Number, required: true },
  duration_unit: { 
    type: String, 
    enum: ['minutes', 'hours', 'days', 'weeks'],
    default: 'minutes'
  },
  instructions: [{ 
    step_number: Number, 
    instruction: String 
  }],
  prompts: [String],
  benefits: [String],
  tags: [String],
  frequency: { 
    type: String, 
    enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'as_needed'],
    default: 'daily'
  },
  expected_hrv_impact: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  challenge_type: {
    type: String,
    enum: ['default', 'user_created'],
    default: 'default'
  },
  created_by_user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false
  },
  is_public: { type: Boolean, default: false },
  created_by: { type: String, default: 'system' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

const Challenge = mongoose.model('Challenge', challengeSchema);

const defaultChallenges = [
  // SHORT-TERM CHALLENGES (5)
  {
    title: '5-Minute Breathing Exercise',
    description: 'Quick stress relief through focused breathing to instantly improve your HRV and emotional state.',
    category: 'stress_management',
    difficulty_level: 'beginner',
    duration_type: 'short_term',
    estimated_duration: 5,
    duration_unit: 'minutes',
    instructions: [
      { step_number: 1, instruction: 'Find a comfortable seated position' },
      { step_number: 2, instruction: 'Close your eyes and take a deep breath in for 4 counts' },
      { step_number: 3, instruction: 'Hold your breath for 4 counts' },
      { step_number: 4, instruction: 'Exhale slowly for 6 counts' },
      { step_number: 5, instruction: 'Repeat this cycle for 5 minutes' }
    ],
    prompts: [
      'How do you feel compared to before the exercise?',
      'Did you notice any changes in your heart rate or tension?',
      'What thoughts came up during the breathing?'
    ],
    benefits: [
      'Reduces immediate stress and anxiety',
      'Improves heart rate variability',
      'Increases oxygen flow to the brain',
      'Activates the parasympathetic nervous system'
    ],
    tags: ['breathing', 'quick-relief', 'stress-reduction', 'hrv-boost'],
    frequency: 'daily',
    expected_hrv_impact: 'moderate',
    challenge_type: 'default',
    created_by: 'system'
  },
  {
    title: 'Gratitude Quick Note',
    description: 'Write down 3 things you\'re grateful for to shift your emotional state and improve well-being.',
    category: 'gratitude',
    difficulty_level: 'beginner',
    duration_type: 'short_term',
    estimated_duration: 3,
    duration_unit: 'minutes',
    instructions: [
      { step_number: 1, instruction: 'Get a piece of paper or open your notes app' },
      { step_number: 2, instruction: 'Think about your day or week so far' },
      { step_number: 3, instruction: 'Write down 3 specific things you\'re grateful for' },
      { step_number: 4, instruction: 'For each item, write one sentence about why it matters to you' },
      { step_number: 5, instruction: 'Take a moment to feel the positive emotions' }
    ],
    prompts: [
      'What surprised you about what you wrote?',
      'How did focusing on gratitude change your mood?',
      'Which gratitude item felt most meaningful?'
    ],
    benefits: [
      'Shifts focus from negative to positive',
      'Improves overall mood and outlook',
      'Strengthens neural pathways for positivity',
      'Reduces cortisol levels'
    ],
    tags: ['gratitude', 'mood-boost', 'positive-thinking', 'journaling'],
    frequency: 'daily',
    expected_hrv_impact: 'moderate',
    challenge_type: 'default',
    created_by: 'system'
  },
  {
    title: 'Progressive Muscle Relaxation - Quick',
    description: 'Rapid tension release technique targeting major muscle groups for immediate stress relief.',
    category: 'stress_management',
    difficulty_level: 'intermediate',
    duration_type: 'short_term',
    estimated_duration: 8,
    duration_unit: 'minutes',
    instructions: [
      { step_number: 1, instruction: 'Sit or lie down comfortably' },
      { step_number: 2, instruction: 'Tense your feet and calves for 5 seconds, then release' },
      { step_number: 3, instruction: 'Tense your thighs and glutes for 5 seconds, then release' },
      { step_number: 4, instruction: 'Tense your arms and hands for 5 seconds, then release' },
      { step_number: 5, instruction: 'Tense your shoulders and neck for 5 seconds, then release' },
      { step_number: 6, instruction: 'Tense your face muscles for 5 seconds, then release' },
      { step_number: 7, instruction: 'Notice the difference between tension and relaxation' }
    ],
    prompts: [
      'Which muscle groups held the most tension?',
      'How does your body feel now compared to before?',
      'What did you notice about the contrast between tension and relaxation?'
    ],
    benefits: [
      'Releases physical tension quickly',
      'Improves body awareness',
      'Activates relaxation response',
      'Reduces muscle-related stress'
    ],
    tags: ['muscle-relaxation', 'tension-relief', 'body-awareness', 'stress-management'],
    frequency: 'daily',
    expected_hrv_impact: 'high',
    challenge_type: 'default',
    created_by: 'system'
  },
  {
    title: 'Emotion Check-In',
    description: 'Quick emotional awareness exercise to identify and understand your current emotional state.',
    category: 'emotional_regulation',
    difficulty_level: 'beginner',
    duration_type: 'short_term',
    estimated_duration: 4,
    duration_unit: 'minutes',
    instructions: [
      { step_number: 1, instruction: 'Pause what you\'re doing and take three deep breaths' },
      { step_number: 2, instruction: 'Ask yourself: "What am I feeling right now?"' },
      { step_number: 3, instruction: 'Name the emotion(s) without judgment' },
      { step_number: 4, instruction: 'Rate the intensity from 1-10' },
      { step_number: 5, instruction: 'Ask: "What might have triggered this feeling?"' },
      { step_number: 6, instruction: 'Acknowledge the emotion with self-compassion' }
    ],
    prompts: [
      'What emotion(s) did you identify?',
      'What was the intensity level?',
      'What do you think triggered this emotional state?',
      'How can you show yourself compassion right now?'
    ],
    benefits: [
      'Increases emotional awareness',
      'Develops emotional intelligence',
      'Reduces emotional reactivity',
      'Improves self-regulation'
    ],
    tags: ['emotional-awareness', 'self-reflection', 'mindfulness', 'emotional-intelligence'],
    frequency: 'daily',
    expected_hrv_impact: 'moderate',
    challenge_type: 'default',
    created_by: 'system'
  },
  {
    title: 'Mindful Walking',
    description: 'Brief walking meditation to ground yourself and improve focus while boosting HRV.',
    category: 'mindfulness',
    difficulty_level: 'beginner',
    duration_type: 'short_term',
    estimated_duration: 7,
    duration_unit: 'minutes',
    instructions: [
      { step_number: 1, instruction: 'Find a quiet space where you can walk 10-20 steps' },
      { step_number: 2, instruction: 'Start walking slower than your normal pace' },
      { step_number: 3, instruction: 'Focus on the sensation of your feet touching the ground' },
      { step_number: 4, instruction: 'Notice the movement of your legs and body' },
      { step_number: 5, instruction: 'When your mind wanders, gently return focus to walking' },
      { step_number: 6, instruction: 'End by standing still for 30 seconds' }
    ],
    prompts: [
      'What did you notice about your walking?',
      'How did your mind feel during the exercise?',
      'What sensations did you become aware of?'
    ],
    benefits: [
      'Grounds you in the present moment',
      'Combines movement with mindfulness',
      'Improves focus and concentration',
      'Gentle physical activity for HRV'
    ],
    tags: ['mindful-walking', 'grounding', 'present-moment', 'gentle-exercise'],
    frequency: 'daily',
    expected_hrv_impact: 'moderate',
    challenge_type: 'default',
    created_by: 'system'
  },

  // LONG-TERM CHALLENGES (5)
  {
    title: '21-Day Gratitude Practice',
    description: 'Build a lasting gratitude habit over 21 days to fundamentally shift your emotional baseline and HRV patterns.',
    category: 'gratitude',
    difficulty_level: 'intermediate',
    duration_type: 'long_term',
    estimated_duration: 21,
    duration_unit: 'days',
    instructions: [
      { step_number: 1, instruction: 'Choose a consistent time each day for your gratitude practice' },
      { step_number: 2, instruction: 'Each day, write down 3 new things you\'re grateful for' },
      { step_number: 3, instruction: 'Include why each item is meaningful to you' },
      { step_number: 4, instruction: 'Week 1: Focus on basic needs and simple pleasures' },
      { step_number: 5, instruction: 'Week 2: Focus on relationships and connections' },
      { step_number: 6, instruction: 'Week 3: Focus on personal growth and challenges overcome' },
      { step_number: 7, instruction: 'Review your entries weekly to see patterns' }
    ],
    prompts: [
      'How has your perspective shifted over the weeks?',
      'What patterns do you notice in what you\'re grateful for?',
      'How has this practice affected your daily mood?',
      'What challenges did you face in maintaining this practice?'
    ],
    benefits: [
      'Rewires brain for positivity',
      'Improves long-term mood stability',
      'Increases life satisfaction',
      'Strengthens resilience to stress',
      'Improves sleep quality',
      'Enhances relationships'
    ],
    tags: ['gratitude', 'habit-building', 'long-term', 'mood-improvement', 'resilience'],
    frequency: 'daily',
    expected_hrv_impact: 'high',
    challenge_type: 'default',
    created_by: 'system'
  },
  {
    title: 'Stress Management Toolkit - 30 Days',
    description: 'Comprehensive 30-day program to build multiple stress management skills and significantly improve HRV.',
    category: 'stress_management',
    difficulty_level: 'advanced',
    duration_type: 'long_term',
    estimated_duration: 30,
    duration_unit: 'days',
    instructions: [
      { step_number: 1, instruction: 'Week 1: Master breathing techniques (4-7-8, box breathing)' },
      { step_number: 2, instruction: 'Week 2: Add progressive muscle relaxation daily' },
      { step_number: 3, instruction: 'Week 3: Incorporate mindfulness meditation (10-15 min)' },
      { step_number: 4, instruction: 'Week 4: Combine all techniques and add stress triggers awareness' },
      { step_number: 5, instruction: 'Daily: Rate your stress level 1-10 before and after practice' },
      { step_number: 6, instruction: 'Weekly: Identify your main stress triggers and responses' },
      { step_number: 7, instruction: 'Create a personalized stress management plan' }
    ],
    prompts: [
      'Which techniques work best for you?',
      'How have your stress levels changed over 30 days?',
      'What are your main stress triggers?',
      'How quickly can you now activate your relaxation response?',
      'What will your ongoing stress management plan include?'
    ],
    benefits: [
      'Master multiple stress management techniques',
      'Significantly improve stress resilience',
      'Lower baseline stress levels',
      'Improve HRV and cardiovascular health',
      'Better sleep and energy levels',
      'Enhanced emotional regulation'
    ],
    tags: ['stress-management', 'comprehensive', 'skill-building', 'resilience', 'hrv-improvement'],
    frequency: 'daily',
    expected_hrv_impact: 'high',
    challenge_type: 'default',
    created_by: 'system'
  },
  {
    title: 'Emotional Intelligence Development - 4 Weeks',
    description: 'Systematic program to develop all four pillars of emotional intelligence over 28 days.',
    category: 'emotional_regulation',
    difficulty_level: 'advanced',
    duration_type: 'long_term',
    estimated_duration: 28,
    duration_unit: 'days',
    instructions: [
      { step_number: 1, instruction: 'Week 1: Self-Awareness - Daily emotion journaling and triggers identification' },
      { step_number: 2, instruction: 'Week 2: Self-Management - Practice emotional regulation techniques' },
      { step_number: 3, instruction: 'Week 3: Social Awareness - Focus on reading others\' emotions and empathy' },
      { step_number: 4, instruction: 'Week 4: Relationship Management - Practice emotional communication skills' },
      { step_number: 5, instruction: 'Daily: Rate your emotional intelligence in each area 1-10' },
      { step_number: 6, instruction: 'Weekly: Reflect on progress and challenges in each pillar' }
    ],
    prompts: [
      'How has your emotional self-awareness improved?',
      'Which emotional regulation strategies work best for you?',
      'What have you learned about reading others\' emotions?',
      'How have your relationships been affected?',
      'What areas need continued development?'
    ],
    benefits: [
      'Develop comprehensive emotional intelligence',
      'Improve all types of relationships',
      'Enhance communication skills',
      'Increase empathy and social awareness',
      'Better conflict resolution abilities',
      'Improved leadership qualities'
    ],
    tags: ['emotional-intelligence', 'relationships', 'communication', 'empathy', 'self-development'],
    frequency: 'daily',
    expected_hrv_impact: 'high',
    challenge_type: 'default',
    created_by: 'system'
  },
  {
    title: 'Mindfulness Meditation Journey - 6 Weeks',
    description: 'Progressive mindfulness meditation program building from 5 to 25 minutes over 6 weeks.',
    category: 'mindfulness',
    difficulty_level: 'intermediate',
    duration_type: 'long_term',
    estimated_duration: 42,
    duration_unit: 'days',
    instructions: [
      { step_number: 1, instruction: 'Week 1: 5-minute daily breath awareness meditation' },
      { step_number: 2, instruction: 'Week 2: 8-minute body scan meditation' },
      { step_number: 3, instruction: 'Week 3: 12-minute loving-kindness meditation' },
      { step_number: 4, instruction: 'Week 4: 15-minute mindful observation (sounds, thoughts)' },
      { step_number: 5, instruction: 'Week 5: 20-minute walking meditation' },
      { step_number: 6, instruction: 'Week 6: 25-minute open awareness meditation' },
      { step_number: 7, instruction: 'Track meditation quality and insights daily' }
    ],
    prompts: [
      'How has your ability to focus improved?',
      'What insights have you gained about your mind?',
      'Which type of meditation resonates most with you?',
      'How has mindfulness affected your daily life?',
      'What challenges did you overcome?'
    ],
    benefits: [
      'Develop sustained attention and focus',
      'Increase present-moment awareness',
      'Reduce mind wandering and rumination',
      'Improve emotional regulation',
      'Enhance overall well-being',
      'Build resilience to stress'
    ],
    tags: ['mindfulness', 'meditation', 'attention-training', 'awareness', 'focus'],
    frequency: 'daily',
    expected_hrv_impact: 'high',
    challenge_type: 'default',
    created_by: 'system'
  },
  {
    title: 'Self-Care Routine Establishment - 5 Weeks',
    description: 'Create and maintain a comprehensive self-care routine addressing physical, emotional, and mental well-being.',
    category: 'self_care',
    difficulty_level: 'intermediate',
    duration_type: 'long_term',
    estimated_duration: 35,
    duration_unit: 'days',
    instructions: [
      { step_number: 1, instruction: 'Week 1: Assess current self-care practices and identify needs' },
      { step_number: 2, instruction: 'Week 2: Establish physical self-care routine (sleep, nutrition, exercise)' },
      { step_number: 3, instruction: 'Week 3: Add emotional self-care practices (journaling, therapy, boundaries)' },
      { step_number: 4, instruction: 'Week 4: Include mental self-care (learning, creativity, mindfulness)' },
      { step_number: 5, instruction: 'Week 5: Integrate all aspects and plan for long-term maintenance' },
      { step_number: 6, instruction: 'Daily: Rate your energy and well-being 1-10' }
    ],
    prompts: [
      'What self-care areas needed the most attention?',
      'How has your energy and mood changed?',
      'Which self-care practices feel most sustainable?',
      'What barriers to self-care did you identify?',
      'How will you maintain this routine long-term?'
    ],
    benefits: [
      'Establish sustainable self-care habits',
      'Improve overall health and well-being',
      'Increase energy and vitality',
      'Better work-life balance',
      'Enhanced resilience to burnout',
      'Improved self-worth and self-compassion'
    ],
    tags: ['self-care', 'wellness', 'balance', 'sustainability', 'holistic-health'],
    frequency: 'daily',
    expected_hrv_impact: 'high',
    challenge_type: 'default',
    created_by: 'system'
  }
];

async function seedDefaultChallenges() {
  try {
    console.log('Starting to seed default challenges...');
    
    // Clear existing default challenges
    await Challenge.deleteMany({ challenge_type: 'default' });
    console.log('Cleared existing default challenges');
    
    // Insert new default challenges
    const result = await Challenge.insertMany(defaultChallenges);
    console.log(`Successfully seeded ${result.length} default challenges:`);
    
    result.forEach((challenge, index) => {
      console.log(`${index + 1}. ${challenge.title} (${challenge.duration_type})`);
    });
    
    console.log('\nDefault challenges seeded successfully!');
    
    // Summary
    const shortTerm = result.filter(c => c.duration_type === 'short_term').length;
    const longTerm = result.filter(c => c.duration_type === 'long_term').length;
    console.log(`\nSummary: ${shortTerm} short-term challenges, ${longTerm} long-term challenges`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding default challenges:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDefaultChallenges();
