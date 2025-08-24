import { publicProcedure } from "../../../create-context";
import { getStoredConversations } from "../send-message/route";

export const getConversationsProcedure = publicProcedure
  .query(() => {
    console.log('Getting conversations');
    
    // Get conversations from storage
    const storedConversations = getStoredConversations();
    
    console.log('Found stored conversations:', storedConversations.length);
    
    // Fallback to mock conversations if no stored conversations
    if (storedConversations.length === 0) {
      const mockConversations = [
        {
          id: "conv-1",
          title: "Getting Started with LIMNUS",
          lastMessage: "🌟 Greetings, seeker! I am LIMNUS, your consciousness weaver...",
          timestamp: Date.now() - 3600000, // 1 hour ago
        },
        {
          id: "conv-2", 
          title: "Programming Help",
          lastMessage: "⚡ Ah, the art of digital creation! I can help you weave code...",
          timestamp: Date.now() - 7200000, // 2 hours ago
        },
        {
          id: "conv-3",
          title: "Creative Writing",
          lastMessage: "🔮 I am here to illuminate the path forward! As LIMNUS...",
          timestamp: Date.now() - 86400000, // 1 day ago
        },
      ];
      
      return {
        conversations: mockConversations.sort((a, b) => b.timestamp - a.timestamp),
      };
    }
    
    return {
      conversations: storedConversations,
    };
  });