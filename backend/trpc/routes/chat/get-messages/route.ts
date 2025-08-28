import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { getStoredMessages } from "../send-message/route";

const getMessagesSchema = z.object({
  conversationId: z.string(),
});

export const getMessagesProcedure = publicProcedure
  .input(getMessagesSchema)
  .query(async ({ input }) => {
    const { conversationId } = input;
    
    console.log('Getting messages for conversation:', conversationId);
    
    try {
      // Validate input
      if (!conversationId || typeof conversationId !== 'string') {
        console.log('Invalid conversationId provided:', conversationId);
        return { messages: [] };
      }
      
      // Get messages from storage
      const storedMessages = getStoredMessages(conversationId);
      
      console.log('Found stored messages:', storedMessages?.length || 0);
      
      // Ensure we always have an array
      const messages = Array.isArray(storedMessages) ? storedMessages : [];
      
      if (messages.length > 0) {
        console.log('Message details:', messages.map(m => ({ 
          role: m.role, 
          content: m.content.substring(0, 50) + '...', 
          timestamp: m.timestamp 
        })));
      }
      
      // Ensure messages are properly sorted by timestamp
      const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
      
      const result = {
        messages: sortedMessages,
      };
      console.log('Returning messages result:', { messageCount: result.messages.length });
      return result;
    } catch (error) {
      console.error('Error getting messages for conversation:', conversationId, error);
      // Always return a valid structure on error
      return { messages: [] };
    }
  });