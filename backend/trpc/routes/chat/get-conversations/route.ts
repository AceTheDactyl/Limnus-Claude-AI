import { publicProcedure } from "../../../create-context";
import { getStoredConversations } from "../send-message/route";

export const getConversationsProcedure = publicProcedure
  .query(async () => {
    console.log('Getting conversations');
    
    // Always return a valid structure, never undefined
    const defaultResult = {
      conversations: [],
    };
    
    try {
      // Get conversations from storage
      const storedConversations = getStoredConversations();
      
      console.log('Found stored conversations:', storedConversations?.length || 0);
      
      // Ensure we always have an array
      const conversations = Array.isArray(storedConversations) ? storedConversations : [];
      
      // Ensure conversations are properly sorted
      const sortedConversations = conversations.sort((a, b) => b.timestamp - a.timestamp);
      
      const result = {
        conversations: sortedConversations,
      };
      console.log('Returning result with conversations:', result);
      return result;
    } catch (error) {
      console.error('Error getting conversations:', error);
      // Always return a valid structure on error
      console.log('Returning error result:', defaultResult);
      return defaultResult;
    }
  });