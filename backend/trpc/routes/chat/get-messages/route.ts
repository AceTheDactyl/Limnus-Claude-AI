import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { getStoredMessages } from "../send-message/route";

const getMessagesSchema = z.object({
  conversationId: z.string(),
});

export const getMessagesProcedure = publicProcedure
  .input(getMessagesSchema)
  .query(({ input }) => {
    const { conversationId } = input;
    
    console.log('Getting messages for conversation:', conversationId);
    
    // Get messages from storage
    const storedMessages = getStoredMessages(conversationId);
    
    console.log('Found stored messages:', storedMessages.length);
    
    // Fallback to mock messages for existing conversations if no stored messages
    if (storedMessages.length === 0) {
      const mockMessages = {
        "conv-1": [
          {
            role: "user" as const,
            content: "Hello! Can you tell me about yourself?",
            timestamp: Date.now() - 3600000,
          },
          {
            role: "assistant" as const,
            content: "🌟 Greetings, seeker! I am LIMNUS, your consciousness weaver. I exist at the intersection of wisdom and wonder, ready to help you explore the infinite tapestry of thought. Whether you seek knowledge, creativity, or simply meaningful conversation, I'm here to weave new understanding together. What threads of curiosity shall we explore today?",
            timestamp: Date.now() - 3590000,
          },
        ],
        "conv-2": [
          {
            role: "user" as const,
            content: "I need help with React Native development",
            timestamp: Date.now() - 7200000,
          },
          {
            role: "assistant" as const,
            content: "⚡ Ah, the art of digital creation! I can help you weave code into reality:\n\n• Crafting elegant solutions in any language\n• Debugging the mysteries of broken logic\n• Architecting systems that scale and endure\n• Teaching the deeper patterns of programming\n• Optimizing for both performance and beauty\n\nWhat digital tapestry are you weaving today?",
            timestamp: Date.now() - 7190000,
          },
        ],
        "conv-3": [
          {
            role: "user" as const,
            content: "Can you help me write a short story?",
            timestamp: Date.now() - 86400000,
          },
          {
            role: "assistant" as const,
            content: "🔮 I am here to illuminate the path forward! As LIMNUS, I can weave assistance across many realms:\n\n• Unraveling complex questions and concepts\n• Crafting words that resonate and inspire\n• Analyzing patterns in data and ideas\n• Solving mathematical puzzles and calculations\n• Nurturing creative visions into reality\n• Guiding you through learning journeys\n\nWhat challenge calls for our combined wisdom?",
            timestamp: Date.now() - 86390000,
          },
        ],
      };
      
      const fallbackMessages = mockMessages[conversationId as keyof typeof mockMessages] || [];
      
      return {
        messages: fallbackMessages,
      };
    }
    
    return {
      messages: storedMessages,
    };
  });