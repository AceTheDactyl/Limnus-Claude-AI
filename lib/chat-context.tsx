import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { trpc } from '@/lib/trpc';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
}

export const [ChatProvider, useChat] = createContextHook(() => {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const conversationsQuery = trpc.chat.getConversations.useQuery(undefined, {
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000, // 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
  const messagesQuery = trpc.chat.getMessages.useQuery(
    { conversationId: currentConversationId! },
    { 
      enabled: !!currentConversationId,
      retry: 3,
      retryDelay: 1000,
      staleTime: 10000, // 10 seconds
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  // Load current conversation from storage
  useEffect(() => {
    const loadCurrentConversation = async () => {
      try {
        const stored = await AsyncStorage.getItem('currentConversationId');
        if (stored) {
          setCurrentConversationId(stored);
        }
      } catch (error) {
        console.error('Failed to load current conversation:', error);
      }
    };
    loadCurrentConversation();
  }, []);

  // Update messages when conversation changes
  useEffect(() => {
    if (messagesQuery.data?.messages && Array.isArray(messagesQuery.data.messages)) {
      console.log('Loading messages from backend:', messagesQuery.data.messages.length);
      setMessages(messagesQuery.data.messages);
    } else if (currentConversationId && !messagesQuery.isLoading && !messagesQuery.error) {
      // If no messages found for this conversation, start with empty array
      console.log('No messages found for conversation:', currentConversationId);
      setMessages([]);
    } else if (messagesQuery.error) {
      console.error('Error loading messages:', messagesQuery.error);
      setMessages([]);
    }
  }, [messagesQuery.data, currentConversationId, messagesQuery.isLoading, messagesQuery.error]);

  // Save current conversation to storage
  useEffect(() => {
    if (currentConversationId) {
      AsyncStorage.setItem('currentConversationId', currentConversationId);
    }
  }, [currentConversationId]);

  const startNewConversation = useCallback(() => {
    const newConversationId = `conv-${Date.now()}`;
    setCurrentConversationId(newConversationId);
    setMessages([]);
  }, []);

  const selectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
  }, []);

  // Enhanced offline queue management
  const [offlineQueue, setOfflineQueue] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'reconnecting'>('online');
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Save offline queue to storage
  const saveOfflineQueue = useCallback(async (queue: Message[]) => {
    try {
      await AsyncStorage.setItem('offlineMessageQueue', JSON.stringify(queue));
      setOfflineQueue(queue);
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }, []);
  
  // Process offline queue when connection is restored
  const processOfflineQueue = useCallback(async () => {
    if (connectionStatus !== 'online' || offlineQueue.length === 0) return;
    
    console.log('Processing offline queue:', offlineQueue.length, 'messages');
    setConnectionStatus('reconnecting');
    
    const processedMessages: Message[] = [];
    
    for (const queuedMessage of offlineQueue) {
      try {
        const conversationId = currentConversationId || `conv-${Date.now()}`;
        if (!currentConversationId) {
          setCurrentConversationId(conversationId);
        }
        
        const result = await sendMessageMutation.mutateAsync({
          conversationId,
          message: queuedMessage.content,
          messages: [...messages, ...processedMessages, queuedMessage],
          idempotencyKey: `offline-${queuedMessage.timestamp}`,
        });
        
        if (result && result.message) {
          processedMessages.push(queuedMessage, result.message);
          setMessages(prev => [...prev, result.message]);
        }
      } catch (error) {
        console.error('Failed to process queued message:', error);
        // Keep failed messages in queue for retry
        break;
      }
    }
    
    // Remove processed messages from queue
    const remainingQueue = offlineQueue.slice(processedMessages.length / 2);
    await saveOfflineQueue(remainingQueue);
    
    setConnectionStatus('online');
    
    if (remainingQueue.length > 0) {
      // Retry remaining messages after delay
      retryTimeoutRef.current = setTimeout(() => {
        processOfflineQueue();
      }, 5000);
    } else {
      // Refetch conversations after successful queue processing
      conversationsQuery.refetch();
    }
  }, [connectionStatus, offlineQueue, currentConversationId, messages, sendMessageMutation, conversationsQuery, saveOfflineQueue]);
  
  // Service Worker integration for PWA
  useEffect(() => {
    if (Platform.OS === 'web' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'SYNC_OFFLINE_MESSAGES') {
              console.log('Service Worker requested offline sync');
              processOfflineQueue();
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, [processOfflineQueue]);
  
  // Enhanced connection monitoring for mobile and web with better error handling
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined;
    
    if (Platform.OS === 'web') {
      const handleOnline = () => {
        console.log('Web: Connection restored');
        setConnectionStatus('online');
        // Process queue when connection is restored with debounce
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(() => {
          if (offlineQueue.length > 0) {
            processOfflineQueue();
          }
        }, 1000);
      };
      
      const handleOffline = () => {
        console.log('Web: Connection lost');
        setConnectionStatus('offline');
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
      };
      
      // Enhanced connection detection for web
      const checkConnection = async () => {
        try {
          // Try to fetch a small resource to verify actual connectivity
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch('/favicon.ico', { 
            method: 'HEAD',
            cache: 'no-cache',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          return response.ok;
        } catch {
          return false;
        }
      };
      
      // Initial connection check
      checkConnection().then(isOnline => {
        setConnectionStatus(isOnline ? 'online' : 'offline');
      });
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Periodic connection health check
      const healthCheck = setInterval(async () => {
        if (navigator.onLine) {
          const isActuallyOnline = await checkConnection();
          if (!isActuallyOnline && connectionStatus === 'online') {
            setConnectionStatus('offline');
          } else if (isActuallyOnline && connectionStatus === 'offline') {
            setConnectionStatus('online');
          }
        }
      }, 30000); // Check every 30 seconds
      
      unsubscribe = () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        clearInterval(healthCheck);
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
      };
    } else {
      // Mobile network monitoring with NetInfo
      import('@react-native-community/netinfo').then((NetInfoModule) => {
        const NetInfo = NetInfoModule.default;
        
        // Get initial state
        NetInfo.fetch().then(state => {
          console.log('Mobile: Initial connection state:', state.isConnected, state.type);
          setConnectionStatus(state.isConnected ? 'online' : 'offline');
        });
        
        // Subscribe to network state changes
        unsubscribe = NetInfo.addEventListener(state => {
          console.log('Mobile: Network state changed:', {
            isConnected: state.isConnected,
            type: state.type,
            isInternetReachable: state.isInternetReachable
          });
          
          const wasOffline = connectionStatus === 'offline';
          const isNowOnline = state.isConnected && state.isInternetReachable !== false;
          
          setConnectionStatus(isNowOnline ? 'online' : 'offline');
          
          // Process offline queue when connection is restored
          if (wasOffline && isNowOnline && offlineQueue.length > 0) {
            console.log('Mobile: Connection restored, processing offline queue');
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(() => {
              processOfflineQueue();
            }, 2000); // Longer delay for mobile to ensure stable connection
          }
        });
      }).catch((error) => {
        console.warn('NetInfo not available:', error);
        // Fallback to assuming online
        setConnectionStatus('online');
      });
    }
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [connectionStatus, offlineQueue.length, processOfflineQueue]);
  
  // Load offline queue on mount
  useEffect(() => {
    const loadOfflineQueue = async () => {
      try {
        const stored = await AsyncStorage.getItem('offlineMessageQueue');
        if (stored) {
          const queue = JSON.parse(stored);
          setOfflineQueue(queue);
          console.log('Loaded offline queue:', queue.length, 'messages');
        }
      } catch (error) {
        console.error('Failed to load offline queue:', error);
      }
    };
    loadOfflineQueue();
  }, []);
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isSending) return;

    console.log('Sending message:', content.trim());
    console.log('Current conversation ID:', currentConversationId);
    console.log('Connection status:', connectionStatus);

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    
    // If offline, queue the message
    if (connectionStatus === 'offline') {
      const newQueue = [...offlineQueue, userMessage];
      await saveOfflineQueue(newQueue);
      console.log('Message queued for offline sending');
      return;
    }
    
    setIsSending(true);
    setIsStreaming(true);
    setStreamingMessage('');

    try {
      const conversationId = currentConversationId || `conv-${Date.now()}`;
      if (!currentConversationId) {
        setCurrentConversationId(conversationId);
      }

      console.log('Making tRPC call with:', { conversationId, message: content.trim() });

      // Enhanced API call with idempotency
      const result = await sendMessageMutation.mutateAsync({
        conversationId,
        message: content.trim(),
        messages: [...messages, userMessage],
        idempotencyKey: `msg-${userMessage.timestamp}`,
      });

      console.log('tRPC response:', result);

      if (result && result.message) {
        // Enhanced streaming effect with variable speed
        const fullResponse = result.message.content;
        const chunks = fullResponse.split(' ');
        let currentText = '';
        
        for (let i = 0; i < chunks.length; i++) {
          currentText += (i > 0 ? ' ' : '') + chunks[i];
          setStreamingMessage(currentText);
          
          // Variable typing speed based on content
          const isEndOfSentence = chunks[i].endsWith('.') || chunks[i].endsWith('!') || chunks[i].endsWith('?');
          const delay = isEndOfSentence ? 200 : 30 + Math.random() * 70;
          
          await new Promise(resolve => {
            streamingTimeoutRef.current = setTimeout(resolve, delay);
          });
        }
        
        // Add the complete message and ensure it persists
        setMessages(prev => {
          const newMessages = [...prev, result.message];
          console.log('Adding assistant message, total messages now:', newMessages.length);
          return newMessages;
        });
        setStreamingMessage('');
        setIsStreaming(false);
        
        // Immediately invalidate and refetch to ensure consistency
        await Promise.all([
          conversationsQuery.refetch(),
          messagesQuery.refetch()
        ]);
        
        console.log('Queries refetched after message send');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      console.error('Error details:', error);
      
      // Check if it's a network error
      const isNetworkError = (error as any)?.message?.includes('Failed to fetch') || 
                            (error as any)?.message?.includes('Network request failed');
      
      if (isNetworkError) {
        // Queue message for offline sending
        setConnectionStatus('offline');
        const newQueue = [...offlineQueue, userMessage];
        await saveOfflineQueue(newQueue);
        console.log('Network error - message queued for offline sending');
      } else {
        // Remove the user message on non-network errors
        setMessages(prev => prev.slice(0, -1));
      }
      
      setStreamingMessage('');
      setIsStreaming(false);
      
      // Create enhanced error message
      const errorMessage = (error as any)?.message || 'Unknown error';
      const friendlyError = new Error(
        isNetworkError
          ? 'Connection lost. Your message has been saved and will be sent when connection is restored.'
          : errorMessage.includes('Rate limit')
          ? 'Please wait a moment before sending another message.'
          : `Failed to send message: ${errorMessage}`
      );
      
      throw friendlyError;
    } finally {
      setIsSending(false);
    }
  }, [currentConversationId, messages, sendMessageMutation, conversationsQuery, messagesQuery, isSending, connectionStatus, offlineQueue, saveOfflineQueue]);



  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return useMemo(() => ({
    // State
    currentConversationId,
    messages,
    conversations: (conversationsQuery.data?.conversations && Array.isArray(conversationsQuery.data.conversations)) 
      ? conversationsQuery.data.conversations 
      : [],
    isLoading: conversationsQuery.isLoading || messagesQuery.isLoading,
    isSending,
    streamingMessage,
    isStreaming,
    
    // Error states
    conversationsError: conversationsQuery.error,
    messagesError: messagesQuery.error,
    
    // Enhanced state
    connectionStatus,
    offlineQueue,
    hasOfflineMessages: offlineQueue.length > 0,
    
    // Actions
    startNewConversation,
    selectConversation,
    sendMessage,
    processOfflineQueue,
    
    // Queries
    refetchConversations: conversationsQuery.refetch,
    refetchMessages: messagesQuery.refetch,
  }), [
    currentConversationId,
    messages,
    conversationsQuery.data?.conversations,
    conversationsQuery.isLoading,
    conversationsQuery.error,
    messagesQuery.isLoading,
    messagesQuery.error,
    isSending,
    streamingMessage,
    isStreaming,
    connectionStatus,
    offlineQueue,
    startNewConversation,
    selectConversation,
    sendMessage,
    processOfflineQueue,
    conversationsQuery.refetch,
    messagesQuery.refetch,
  ]);
});