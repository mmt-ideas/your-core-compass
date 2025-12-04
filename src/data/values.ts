export interface Value {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const personalValues: Value[] = [
  // Achievement & Growth
  { id: "achievement", name: "Achievement", description: "Accomplishing goals and experiencing success through effort and skill.", category: "Achievement" },
  { id: "growth", name: "Growth", description: "Continuous learning, personal development, and becoming a better version of yourself.", category: "Achievement" },
  { id: "excellence", name: "Excellence", description: "Striving for the highest quality in everything you do.", category: "Achievement" },
  { id: "mastery", name: "Mastery", description: "Developing deep expertise and competence in your chosen field.", category: "Achievement" },
  { id: "ambition", name: "Ambition", description: "Having strong desires and determination to achieve your goals.", category: "Achievement" },
  
  // Leadership & Influence
  { id: "leadership", name: "Leadership", description: "Guiding and inspiring others toward shared goals and vision.", category: "Leadership" },
  { id: "influence", name: "Influence", description: "Having meaningful impact on others and the world around you.", category: "Leadership" },
  { id: "power", name: "Power", description: "Having authority and control over resources and decisions.", category: "Leadership" },
  { id: "recognition", name: "Recognition", description: "Being acknowledged and appreciated for your contributions.", category: "Leadership" },
  
  // Relationships & Community
  { id: "family", name: "Family", description: "Deep connections and commitment to loved ones and relatives.", category: "Relationships" },
  { id: "friendship", name: "Friendship", description: "Meaningful bonds with people who support and understand you.", category: "Relationships" },
  { id: "community", name: "Community", description: "Being part of and contributing to a group larger than yourself.", category: "Relationships" },
  { id: "belonging", name: "Belonging", description: "Feeling accepted and connected to others.", category: "Relationships" },
  { id: "collaboration", name: "Collaboration", description: "Working together with others to achieve common goals.", category: "Relationships" },
  
  // Purpose & Service
  { id: "service", name: "Service", description: "Contributing to the wellbeing of others and making a difference.", category: "Purpose" },
  { id: "purpose", name: "Purpose", description: "Having a clear sense of meaning and direction in life.", category: "Purpose" },
  { id: "legacy", name: "Legacy", description: "Creating something lasting that outlives you.", category: "Purpose" },
  { id: "contribution", name: "Contribution", description: "Adding value and making meaningful contributions to the world.", category: "Purpose" },
  
  // Freedom & Independence
  { id: "freedom", name: "Freedom", description: "Having the ability to act, speak, and think without restraint.", category: "Freedom" },
  { id: "autonomy", name: "Autonomy", description: "Self-governance and independence in making your own choices.", category: "Freedom" },
  { id: "adventure", name: "Adventure", description: "Seeking new experiences, excitement, and stepping outside comfort zones.", category: "Freedom" },
  { id: "flexibility", name: "Flexibility", description: "Having options and the ability to adapt to changing circumstances.", category: "Freedom" },
  
  // Integrity & Character
  { id: "integrity", name: "Integrity", description: "Acting in alignment with your values and being honest and ethical.", category: "Character" },
  { id: "authenticity", name: "Authenticity", description: "Being true to yourself and living genuinely.", category: "Character" },
  { id: "honesty", name: "Honesty", description: "Being truthful, transparent, and sincere in all dealings.", category: "Character" },
  { id: "courage", name: "Courage", description: "Facing fears and challenges with bravery and determination.", category: "Character" },
  { id: "humility", name: "Humility", description: "Having a modest view of one's importance while being open to learning.", category: "Character" },
  
  // Wellbeing & Balance
  { id: "health", name: "Health", description: "Physical, mental, and emotional wellbeing.", category: "Wellbeing" },
  { id: "balance", name: "Balance", description: "Harmony between different areas of life.", category: "Wellbeing" },
  { id: "peace", name: "Peace", description: "Inner calm, serenity, and freedom from conflict.", category: "Wellbeing" },
  { id: "joy", name: "Joy", description: "Experiencing happiness, pleasure, and positive emotions.", category: "Wellbeing" },
  
  // Creativity & Innovation
  { id: "creativity", name: "Creativity", description: "Expressing yourself through original ideas and artistic endeavors.", category: "Creativity" },
  { id: "innovation", name: "Innovation", description: "Creating new solutions and pushing boundaries of what's possible.", category: "Creativity" },
  { id: "curiosity", name: "Curiosity", description: "A strong desire to learn, explore, and understand.", category: "Creativity" },
  
  // Security & Stability
  { id: "security", name: "Security", description: "Having stability, safety, and predictability in life.", category: "Security" },
  { id: "stability", name: "Stability", description: "Consistency and reliability in your circumstances.", category: "Security" },
  { id: "wealth", name: "Wealth", description: "Financial abundance and material prosperity.", category: "Security" },
  
  // Wisdom & Knowledge
  { id: "wisdom", name: "Wisdom", description: "Deep understanding gained through experience and reflection.", category: "Wisdom" },
  { id: "knowledge", name: "Knowledge", description: "Acquiring information, facts, and understanding.", category: "Wisdom" },
  { id: "truth", name: "Truth", description: "Seeking and valuing what is accurate and real.", category: "Wisdom" },
];

export const getValueById = (id: string): Value | undefined => {
  return personalValues.find(v => v.id === id);
};
