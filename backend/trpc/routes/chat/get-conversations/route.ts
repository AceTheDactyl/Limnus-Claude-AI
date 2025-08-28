import { publicProcedure } from "../../../create-context";
import { getStoredConversations } from "../send-message/route";

export const getConversationsProcedure = publicProcedure
  .query(() => {
    console.log('Getting conversations');
    
    try {
      // Get conversations from storage
      const storedConversations = getStoredConversations();
      
      console.log('Found stored conversations:', storedConversations.length);
      
      // Always return a valid structure, even if empty
      if (!storedConversations || storedConversations.length === 0) {
        console.log('No stored conversations found, returning empty array');
        return {
          conversations: [],
        };
      }
      
      // Ensure conversations are properly sorted
      const sortedConversations = storedConversations.sort((a, b) => b.timestamp - a.timestamp);
      
      return {
        conversations: sortedConversations,
      };
    } catch (error) {
      console.error('Error getting conversations:', error);
      // Always return a valid structure on error
      return {
        conversations: [],
      };
    }
  });