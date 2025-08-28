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
    
    try {
      // Get messages from storage
      const storedMessages = getStoredMessages(conversationId);
      
      console.log('Found stored messages:', storedMessages?.length || 0);
      if (storedMessages && storedMessages.length > 0) {
        console.log('Message details:', storedMessages.map(m => ({ 
          role: m.role, 
          content: m.content.substring(0, 50) + '...', 
          timestamp: m.timestamp 
        })));
      }
      
      // Always return a valid structure, even if empty
      if (!storedMessages || storedMessages.length === 0) {
        console.log('No stored messages found for conversation:', conversationId);
        const result = {
          messages: [],
        };
        console.log('Returning empty messages result:', result);
        return result;
      }
      
      // Ensure messages are properly sorted by timestamp
      const sortedMessages = storedMessages.sort((a, b) => a.timestamp - b.timestamp);
      
      const result = {
        messages: sortedMessages,
      };
      console.log('Returning messages result:', { messageCount: result.messages.length });
      return result;
    } catch (error) {
      console.error('Error getting messages for conversation:', conversationId, error);
      // Always return a valid structure on error
      const errorResult = {
        messages: [],
      };
      console.log('Returning error messages result:', errorResult);
      return errorResult;
    }
  });