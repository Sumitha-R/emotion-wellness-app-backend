require('dotenv').config();
const mongoose = require('mongoose');
const { Challenge } = require('./server/models/Challenge');

const challengesData = [
  // Mindfulness Challenges
  {
    title: "5-Minute Morning Mindfulness",
    description: "Start your day with a brief mindfulness practice to set a positive tone and increase awareness.",
    category: "mindfulness",
    difficulty_level: "beginner",
    estimated_duration: 5,
    instructions: [
      { step_number: 1, instruction: "Find a quiet, comfortable place to sit" },
      { step_number: 2, instruction: "Close your eyes and take three deep breaths" },
      { step_number: 3, instruction: "Focus on your breath for the next 5 minutes" },
      { step_number: 4, instruction: "When your mind wanders, gently bring attention back to breathing" },
      { step_number: 5, instruction: "End with three deep breaths and open your eyes slowly" }
    ],
    prompts: [
      "How did you feel before the practice?",
      "What did you notice during the breathing exercise?",
      "How do you feel now compared to when you started?"
    ],
    benefits: [
      "Reduces stress and anxiety",
      "Improves focus and concentration",
      "Enhances emotional regulation",
      "Promotes a positive start to the day"
    ],
    tags: ["breathing", "meditation", "morning", "mindfulness"],
    frequency: "daily"
  },
  {
    title: "Mindful Walking Practice",
    description: "Transform a simple walk into a mindfulness exercise by focusing on each step and your surroundings.",
    category: "mindfulness",
    difficulty_level: "beginner",
    estimated_duration: 15,
    instructions: [
      { step_number: 1, instruction: "Choose a quiet path or area for walking" },
      { step_number: 2, instruction: "Begin walking at a slower pace than usual" },
      { step_number: 3, instruction: "Focus on the sensation of your feet touching the ground" },
      { step_number: 4, instruction: "Notice your surroundings without judgment" },
      { step_number: 5, instruction: "If your mind wanders, return focus to your steps" }
    ],
    prompts: [
      "What sounds did you notice during your walk?",
      "How did focusing on your steps change the experience?",
      "What emotions or thoughts arose during the practice?"
    ],
    benefits: [
      "Combines physical activity with mindfulness",
      "Increases present-moment awareness",
      "Reduces rumination and worry",
      "Connects you with nature and environment"
    ],
    tags: ["walking", "nature", "movement", "awareness"],
    frequency: "daily"
  },

  // Gratitude Challenges
  {
    title: "Three Good Things Daily",
    description: "Write down three positive things that happened today and reflect on why they were meaningful.",
    category: "gratitude",
    difficulty_level: "beginner",
    estimated_duration: 10,
    instructions: [
      { step_number: 1, instruction: "Set aside 10 minutes before bedtime" },
      { step_number: 2, instruction: "Write down three positive things from your day" },
      { step_number: 3, instruction: "For each item, write why it was good or meaningful" },
      { step_number: 4, instruction: "Reflect on your role in making these things happen" },
      { step_number: 5, instruction: "Feel the positive emotions associated with each memory" }
    ],
    prompts: [
      "What were your three good things today?",
      "Why was each of these things meaningful to you?",
      "How did you contribute to these positive experiences?"
    ],
    benefits: [
      "Increases overall life satisfaction",
      "Improves sleep quality",
      "Enhances optimism",
      "Strengthens resilience"
    ],
    tags: ["gratitude", "reflection", "positivity", "evening"],
    frequency: "daily"
  },
  {
    title: "Gratitude Letter Writing",
    description: "Write a heartfelt letter to someone who has positively impacted your life.",
    category: "gratitude",
    difficulty_level: "intermediate",
    estimated_duration: 30,
    instructions: [
      { step_number: 1, instruction: "Think of someone who has helped or inspired you" },
      { step_number: 2, instruction: "Write a detailed letter expressing your gratitude" },
      { step_number: 3, instruction: "Be specific about what they did and how it affected you" },
      { step_number: 4, instruction: "Describe how their actions made you feel" },
      { step_number: 5, instruction: "Consider sharing the letter with them" }
    ],
    prompts: [
      "Who did you choose to write to and why?",
      "What specific actions or qualities did you appreciate?",
      "How did writing this letter make you feel?",
      "Will you share this letter with them?"
    ],
    benefits: [
      "Strengthens relationships",
      "Increases appreciation for others",
      "Boosts positive emotions",
      "Enhances sense of connection"
    ],
    tags: ["gratitude", "relationships", "appreciation", "communication"],
    frequency: "weekly"
  },

  // Self-Reflection Challenges
  {
    title: "Values Clarification Exercise",
    description: "Identify and reflect on your core personal values and how they guide your decisions.",
    category: "self_reflection",
    difficulty_level: "intermediate",
    estimated_duration: 45,
    instructions: [
      { step_number: 1, instruction: "List 10-15 values that resonate with you" },
      { step_number: 2, instruction: "Narrow down to your top 5 most important values" },
      { step_number: 3, instruction: "For each value, write why it's important to you" },
      { step_number: 4, instruction: "Reflect on how these values guide your daily choices" },
      { step_number: 5, instruction: "Identify areas where you could better align with your values" }
    ],
    prompts: [
      "What are your top 5 core values?",
      "How do these values currently show up in your life?",
      "Where might you be acting inconsistently with your values?",
      "What changes could you make to better honor your values?"
    ],
    benefits: [
      "Increases self-awareness",
      "Improves decision-making",
      "Enhances authenticity",
      "Provides life direction"
    ],
    tags: ["values", "self-awareness", "authenticity", "decision-making"],
    frequency: "monthly"
  },
  {
    title: "Daily Wins and Lessons",
    description: "Reflect on your daily achievements and learning opportunities.",
    category: "self_reflection",
    difficulty_level: "beginner",
    estimated_duration: 10,
    instructions: [
      { step_number: 1, instruction: "Set aside time at the end of each day" },
      { step_number: 2, instruction: "Write down 2-3 things you accomplished today" },
      { step_number: 3, instruction: "Identify one thing you learned about yourself" },
      { step_number: 4, instruction: "Note one area where you could improve tomorrow" },
      { step_number: 5, instruction: "Acknowledge your efforts and progress" }
    ],
    prompts: [
      "What did you accomplish today, no matter how small?",
      "What did you learn about yourself today?",
      "How can you apply this learning moving forward?",
      "What will you do differently tomorrow?"
    ],
    benefits: [
      "Builds self-awareness",
      "Celebrates progress",
      "Encourages continuous improvement",
      "Develops growth mindset"
    ],
    tags: ["reflection", "growth", "achievement", "learning"],
    frequency: "daily"
  },

  // Goal Setting Challenges
  {
    title: "SMART Goal Creation",
    description: "Create a specific, measurable, achievable, relevant, and time-bound goal.",
    category: "goal_setting",
    difficulty_level: "intermediate",
    estimated_duration: 20,
    instructions: [
      { step_number: 1, instruction: "Choose an area of life you want to improve" },
      { step_number: 2, instruction: "Write a specific and clear goal statement" },
      { step_number: 3, instruction: "Define how you'll measure progress" },
      { step_number: 4, instruction: "Ensure the goal is realistic and achievable" },
      { step_number: 5, instruction: "Set a specific deadline for completion" }
    ],
    prompts: [
      "What goal did you choose and why?",
      "How will you measure success?",
      "What steps will you take to achieve this goal?",
      "What potential obstacles might you face?"
    ],
    benefits: [
      "Provides clear direction",
      "Increases motivation",
      "Improves focus",
      "Enhances achievement likelihood"
    ],
    tags: ["goals", "planning", "achievement", "focus"],
    frequency: "monthly"
  },

  // Emotional Regulation Challenges
  {
    title: "Emotion Labeling Practice",
    description: "Practice identifying and naming your emotions throughout the day.",
    category: "emotional_regulation",
    difficulty_level: "beginner",
    estimated_duration: 15,
    instructions: [
      { step_number: 1, instruction: "Set 3-4 random alarms throughout your day" },
      { step_number: 2, instruction: "When alarm goes off, pause and check in with yourself" },
      { step_number: 3, instruction: "Identify what emotion you're currently feeling" },
      { step_number: 4, instruction: "Rate the intensity on a scale of 1-10" },
      { step_number: 5, instruction: "Write down the emotion and any triggers you notice" }
    ],
    prompts: [
      "What emotions did you identify throughout the day?",
      "What patterns did you notice in your emotional states?",
      "What triggers or situations influenced your emotions?",
      "How did naming your emotions affect your experience?"
    ],
    benefits: [
      "Increases emotional awareness",
      "Improves emotional vocabulary",
      "Helps identify patterns",
      "Enhances emotional intelligence"
    ],
    tags: ["emotions", "awareness", "labeling", "mindfulness"],
    frequency: "daily"
  },

  // Stress Management Challenges
  {
    title: "Progressive Muscle Relaxation",
    description: "Practice systematically tensing and relaxing different muscle groups to reduce physical stress.",
    category: "stress_management",
    difficulty_level: "beginner",
    estimated_duration: 20,
    instructions: [
      { step_number: 1, instruction: "Find a comfortable, quiet place to lie down" },
      { step_number: 2, instruction: "Start with your toes and tense them for 5 seconds" },
      { step_number: 3, instruction: "Release the tension and notice the relaxation" },
      { step_number: 4, instruction: "Move systematically through each muscle group" },
      { step_number: 5, instruction: "End by taking deep breaths and enjoying full relaxation" }
    ],
    prompts: [
      "Which muscle groups held the most tension?",
      "How did you feel before vs. after the exercise?",
      "What did you notice about the contrast between tension and relaxation?",
      "How might you use this technique in stressful situations?"
    ],
    benefits: [
      "Reduces physical tension",
      "Promotes relaxation",
      "Improves body awareness",
      "Provides stress relief tool"
    ],
    tags: ["relaxation", "tension", "body-awareness", "stress-relief"],
    frequency: "weekly"
  },

  // Creativity Challenges
  {
    title: "Creative Expression Challenge",
    description: "Spend time engaging in a creative activity without judgment or expectation.",
    category: "creativity",
    difficulty_level: "beginner",
    estimated_duration: 30,
    instructions: [
      { step_number: 1, instruction: "Choose a creative medium (drawing, writing, music, etc.)" },
      { step_number: 2, instruction: "Set aside perfectionism and judgment" },
      { step_number: 3, instruction: "Create freely for 30 minutes" },
      { step_number: 4, instruction: "Focus on the process, not the outcome" },
      { step_number: 5, instruction: "Reflect on how the creative process felt" }
    ],
    prompts: [
      "What creative activity did you choose?",
      "How did it feel to create without judgment?",
      "What emotions came up during the creative process?",
      "What would you like to explore creatively next?"
    ],
    benefits: [
      "Reduces stress and anxiety",
      "Enhances problem-solving",
      "Boosts mood and self-expression",
      "Develops creative confidence"
    ],
    tags: ["creativity", "expression", "art", "flow"],
    frequency: "weekly"
  },

  // Social Connection Challenges
  {
    title: "Meaningful Conversation Challenge",
    description: "Have a deeper, more meaningful conversation with someone in your life.",
    category: "social_connection",
    difficulty_level: "intermediate",
    estimated_duration: 60,
    instructions: [
      { step_number: 1, instruction: "Choose someone you'd like to connect with more deeply" },
      { step_number: 2, instruction: "Ask open-ended questions about their thoughts and feelings" },
      { step_number: 3, instruction: "Listen actively without planning your response" },
      { step_number: 4, instruction: "Share something meaningful about yourself" },
      { step_number: 5, instruction: "Express appreciation for their openness" }
    ],
    prompts: [
      "Who did you choose to have this conversation with?",
      "What meaningful topics did you discuss?",
      "What did you learn about them that you didn't know before?",
      "How did this deeper connection feel?"
    ],
    benefits: [
      "Strengthens relationships",
      "Increases empathy and understanding",
      "Reduces loneliness",
      "Enhances communication skills"
    ],
    tags: ["connection", "conversation", "relationships", "empathy"],
    frequency: "weekly"
  }
];

async function seedChallenges() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('Cleared existing challenges');

    // Insert new challenges
    const insertedChallenges = await Challenge.insertMany(challengesData);
    console.log(`Successfully seeded ${insertedChallenges.length} challenges`);

    // Display seeded challenges by category
    const categories = [...new Set(challengesData.map(c => c.category))];
    for (const category of categories) {
      const count = challengesData.filter(c => c.category === category).length;
      console.log(`${category}: ${count} challenges`);
    }

  } catch (error) {
    console.error('Error seeding challenges:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
if (require.main === module) {
  seedChallenges();
}

module.exports = { challengesData };
