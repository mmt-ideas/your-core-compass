export interface Value {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Culturally diverse values list (30-50 as per PRD)
export const personalValues: Value[] = [
  // Achievement & Growth
  { id: "achievement", name: "Achievement", description: "Accomplishing meaningful goals through your efforts and dedication.", category: "Growth" },
  { id: "growth", name: "Growth", description: "Continuous learning, personal development, and evolving as a person.", category: "Growth" },
  { id: "excellence", name: "Excellence", description: "Pursuing high quality and doing your best work.", category: "Growth" },
  { id: "mastery", name: "Mastery", description: "Developing deep competence and skill in areas that matter to you.", category: "Growth" },
  { id: "learning", name: "Learning", description: "Expanding your knowledge and understanding of the world.", category: "Growth" },
  
  // Leadership & Influence
  { id: "leadership", name: "Leadership", description: "Guiding and supporting others toward shared goals.", category: "Leadership" },
  { id: "influence", name: "Influence", description: "Having meaningful impact on others and your environment.", category: "Leadership" },
  { id: "service", name: "Service", description: "Contributing to the wellbeing of others and your community.", category: "Leadership" },
  { id: "responsibility", name: "Responsibility", description: "Being accountable and reliable in your commitments.", category: "Leadership" },
  
  // Relationships & Connection
  { id: "family", name: "Family", description: "Deep bonds and commitment to those you consider family.", category: "Connection" },
  { id: "friendship", name: "Friendship", description: "Meaningful relationships with people who understand and support you.", category: "Connection" },
  { id: "community", name: "Community", description: "Being part of and contributing to groups that matter to you.", category: "Connection" },
  { id: "belonging", name: "Belonging", description: "Feeling accepted, included, and connected to others.", category: "Connection" },
  { id: "collaboration", name: "Collaboration", description: "Working together with others toward common purposes.", category: "Connection" },
  { id: "compassion", name: "Compassion", description: "Showing care and understanding for the experiences of others.", category: "Connection" },
  
  // Purpose & Meaning
  { id: "purpose", name: "Purpose", description: "Having a clear sense of meaning and direction in your life.", category: "Purpose" },
  { id: "legacy", name: "Legacy", description: "Creating something lasting that reflects what matters to you.", category: "Purpose" },
  { id: "contribution", name: "Contribution", description: "Adding value and making a positive difference.", category: "Purpose" },
  { id: "spirituality", name: "Spirituality", description: "Connection to something larger than yourself.", category: "Purpose" },
  { id: "faith", name: "Faith", description: "Trust in beliefs, traditions, or practices that guide you.", category: "Purpose" },
  
  // Freedom & Independence
  { id: "freedom", name: "Freedom", description: "The ability to make your own choices and live on your terms.", category: "Freedom" },
  { id: "autonomy", name: "Autonomy", description: "Independence in making decisions that affect your life.", category: "Freedom" },
  { id: "adventure", name: "Adventure", description: "Exploring new experiences and stepping outside your comfort zone.", category: "Freedom" },
  { id: "flexibility", name: "Flexibility", description: "Adaptability and openness to change.", category: "Freedom" },
  
  // Integrity & Character
  { id: "integrity", name: "Integrity", description: "Acting in alignment with your values and being honest.", category: "Character" },
  { id: "authenticity", name: "Authenticity", description: "Being true to yourself and living genuinely.", category: "Character" },
  { id: "honesty", name: "Honesty", description: "Being truthful and transparent in your words and actions.", category: "Character" },
  { id: "courage", name: "Courage", description: "Facing challenges and fears with determination.", category: "Character" },
  { id: "humility", name: "Humility", description: "Staying grounded and open to learning from others.", category: "Character" },
  { id: "respect", name: "Respect", description: "Treating yourself and others with dignity and consideration.", category: "Character" },
  
  // Wellbeing & Balance
  { id: "health", name: "Health", description: "Physical, mental, and emotional wellbeing.", category: "Wellbeing" },
  { id: "balance", name: "Balance", description: "Harmony between different areas of your life.", category: "Wellbeing" },
  { id: "peace", name: "Peace", description: "Inner calm and freedom from unnecessary stress.", category: "Wellbeing" },
  { id: "joy", name: "Joy", description: "Experiencing happiness and positive emotions.", category: "Wellbeing" },
  { id: "wellness", name: "Wellness", description: "Holistic care for your mind, body, and spirit.", category: "Wellbeing" },
  
  // Creativity & Expression
  { id: "creativity", name: "Creativity", description: "Expressing yourself through original ideas and creation.", category: "Creativity" },
  { id: "innovation", name: "Innovation", description: "Finding new solutions and approaches to challenges.", category: "Creativity" },
  { id: "curiosity", name: "Curiosity", description: "A desire to explore, question, and understand.", category: "Creativity" },
  { id: "beauty", name: "Beauty", description: "Appreciation for aesthetics and what inspires you.", category: "Creativity" },
  
  // Security & Stability
  { id: "security", name: "Security", description: "Having stability and safety in your life.", category: "Security" },
  { id: "stability", name: "Stability", description: "Consistency and reliability in your circumstances.", category: "Security" },
  { id: "prosperity", name: "Prosperity", description: "Having resources and abundance to live well.", category: "Security" },
  
  // Wisdom & Knowledge
  { id: "wisdom", name: "Wisdom", description: "Deep understanding gained through experience and reflection.", category: "Wisdom" },
  { id: "knowledge", name: "Knowledge", description: "Acquiring information and understanding.", category: "Wisdom" },
  { id: "truth", name: "Truth", description: "Seeking and valuing what is accurate and real.", category: "Wisdom" },
  
  // Justice & Fairness
  { id: "justice", name: "Justice", description: "Fairness, equality, and standing up for what is right.", category: "Justice" },
  { id: "fairness", name: "Fairness", description: "Treating people equitably and without bias.", category: "Justice" },
  { id: "equality", name: "Equality", description: "Everyone having the same rights and opportunities.", category: "Justice" },
];

export const getValueById = (id: string): Value | undefined => {
  return personalValues.find(v => v.id === id);
};

export const getValuesByCategory = (): Record<string, Value[]> => {
  return personalValues.reduce((acc, value) => {
    if (!acc[value.category]) {
      acc[value.category] = [];
    }
    acc[value.category].push(value);
    return acc;
  }, {} as Record<string, Value[]>);
};

// Example values for manual entry suggestions
export const exampleValues = [
  "Integrity",
  "Curiosity", 
  "Learning",
  "Connection",
  "Creativity",
  "Courage",
  "Stability",
  "Wellness"
];

// Reflective prompts for values clarity
export const valuesReflectionPrompts = [
  "What does this value look like when it shows up in your life?",
  "When have you felt connected to this value?",
  "What would be missing if this value were absent?",
  "How does this value guide your decisions?",
  "When do you feel most aligned with this value?",
];

// Reflective prompts for manual entry
export const manualEntryPrompts = [
  "What qualities matter most in challenging moments?",
  "Which values guide your decisions?",
  "What feels non-negotiable for you?",
  "What do you want to be known for?",
];

// Decision alignment prompts
export const decisionAlignmentPrompts = [
  "How does this decision support the values you selected?",
  "Are there any tensions between this decision and your values?",
  "What alternatives might better align with your values?",
  "What would choosing differently mean for these values?",
  "How will you feel about this decision in a year from now?",
];

// Micro reflection prompts
export const microReflectionPrompts = [
  "Which value did you express today?",
  "Where did you feel aligned or misaligned with your values?",
  "What small moment connected you to what matters most?",
  "Which value felt present in a challenge you faced?",
  "What are you grateful for that reflects your values?",
  "When did you notice yourself living your values today?",
];
