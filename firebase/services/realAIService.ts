// firebase/services/realAIService.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

// ========== SESSION MEMORY ==========
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

let sessionHistory: ChatMessage[] = [];

export const clearSessionHistory = () => {
  sessionHistory = [];
  console.log("🧹 Session history cleared");
};

// ========== GUARDRAILS ==========
const isValidHealthQuestion = (message: string, conversationHistory: ChatMessage[] = []): { isValid: boolean; reason?: string } => {
  const lowerMsg = message.toLowerCase();
  
  // Follow-up indicators
  const followUpIndicators = [
    'what are the', 'give me', 'examples of', 'more about', 'tell me more',
    'elaborate', 'explain', 'can you', 'could you', 'please provide',
    'list', 'show me', 'how about', 'what about', 'and', 'also'
  ];
  
  // Check if this is a follow-up to a previous health-related conversation
  let isFollowUp = false;
  if (conversationHistory.length > 0) {
    const recentHealthContext = conversationHistory.slice(-4).some(msg => {
      if (msg.role === 'user') {
        const healthTopics = ['milestone', 'vaccine', 'health', 'baby', 'child', 'fever', 'sleep', 'eating', 'development'];
        return healthTopics.some(topic => msg.content.toLowerCase().includes(topic));
      }
      return false;
    });
    
    if (recentHealthContext && followUpIndicators.some(indicator => lowerMsg.includes(indicator))) {
      isFollowUp = true;
    }
  }
  
  // Allowed topics
  const allowedTopics = [
    'baby', 'child', 'infant', 'toddler', 'newborn', 'kid',
    'health', 'doctor', 'pediatric', 'vaccine', 'vaccination',
    'fever', 'cold', 'cough', 'rash', 'allergy', 'symptom',
    'milestone', 'crawling', 'walking', 'talking', 'speech',
    'sleep', 'growth', 'development', 'behavior', 'feeding',
    'examples', 'example', 'more', 'list', 'details'
  ];
  
  // Blocked topics
  const blockedTopics = [
    'stock market', 'crypto', 'bitcoin', 'trading', 'investment',
    'movie', 'celebrity', 'politics', 'election', 'war', 'sports'
  ];
  
  // Check blocked topics
  for (const topic of blockedTopics) {
    if (lowerMsg.includes(topic)) {
      return { 
        isValid: false, 
        reason: "I'm a child health assistant. I can only answer questions about child health and development." 
      };
    }
  }
  
  // Allow follow-ups
  if (isFollowUp) {
    return { isValid: true };
  }
  
  // Check allowed topics
  const isRelevant = allowedTopics.some(topic => lowerMsg.includes(topic));
  const greetings = ['hi', 'hello', 'hey', 'how are you', 'thanks', 'thank you'];
  const isGreeting = greetings.some(g => lowerMsg === g || lowerMsg.includes(g));
  
  if (!isRelevant && !isGreeting && lowerMsg.length > 3) {
    return {
      isValid: false,
      reason: "I'm a child health assistant. Please ask me questions about your child's health, development, vaccines, or wellness."
    };
  }
  
  return { isValid: true };
};

// ========== MAIN AI FUNCTION ==========
export const getAIResponse = async (userMessage: string, childAge?: number): Promise<{ success: boolean; message: string }> => {
  try {
    // STEP 1: Guardrail check
    const guardCheck = isValidHealthQuestion(userMessage, sessionHistory);
    if (!guardCheck.isValid) {
      return {
        success: true,
        message: guardCheck.reason || "I'm a child health assistant. I can only answer questions about child health and development."
      };
    }
    
    // STEP 2: Get ALL previous messages for context
    const fullHistory = [...sessionHistory];
    
    // STEP 3: Build messages with FULL history
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are Dr. Riley, a warm and caring pediatric health assistant. 
        
IMPORTANT: You MUST remember the conversation history! When a user asks a follow-up question, refer back to what was discussed earlier.

Your memory is active. Always connect current questions to previous conversation.

Your ROLE:
- Help parents understand child health and development
- Provide accurate, age-appropriate information
- Be encouraging and supportive
- REMEMBER previous questions and answers

Your EXPERTISE:
- Child development milestones
- Vaccination schedules
- Common childhood illnesses
- Nutrition and feeding
- Sleep patterns
- Behavioral concerns

If a user asks something irrelevant, kindly remind them you're a child health assistant.`
      },
      ...fullHistory,
      {
        role: 'user',
        content: childAge 
          ? `My child is ${childAge} months old. ${userMessage}`
          : userMessage
      }
    ];
    
    // STEP 4: Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const aiMessage = response.choices[0].message.content || "I'm not sure how to respond.";
    
    // STEP 5: Save to session history
    sessionHistory.push(
      { role: 'user', content: userMessage, timestamp: new Date() },
      { role: 'assistant', content: aiMessage, timestamp: new Date() }
    );
    
    // Keep only last 30 messages
    if (sessionHistory.length > 30) {
      sessionHistory = sessionHistory.slice(-30);
    }
    
    return {
      success: true,
      message: aiMessage
    };

  } catch (error) {
    console.error("❌ OpenAI Error:", error);
    return {
      success: false,
      message: "I'm having trouble connecting. Please try again in a moment."
    };
  }
};