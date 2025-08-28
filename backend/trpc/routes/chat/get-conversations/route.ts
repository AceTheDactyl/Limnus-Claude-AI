import { publicProcedure } from "../../../create-context";
import { getStoredConversations } from "../send-message/route";

export const getConversationsProcedure = publicProcedure
  .query(() => {
    console.log('Getting conversations');
    
    try {
      // Get conversations from storage
      const storedConversations = getStoredConversations();
      
      console.log('Found stored conversations:', storedConversations?.length || 0);
      
      // Ensure we always have an array
      const conversations = Array.isArray(storedConversations) ? storedConversations : [];
      
      // Always return a valid structure, even if empty
      if (conversations.length === 0) {
        console.log('No stored conversations found, returning empty array');
        const result = {
          conversations: [],
        };
        console.log('Returning result:', result);
        return result;
      }
      
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
      const errorResult = {
        conversations: [],
      };
      console.log('Returning error result:', errorResult);
      return errorResult;
    }
  });