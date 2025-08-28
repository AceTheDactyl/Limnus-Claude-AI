import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import NetInfo from '@react-native-community/netinfo';
import { trpc } from '@/lib/trpc';

// Web compatibility check for haptics
const isHapticsAvailable = Platform.OS !== 'web' && Haptics;

// Consciousness field types
export interface ConsciousnessFieldState {
  globalResonance: number;
  activeNodes: number;
  totalParticles: number;
  crystallizedParticles: number;
  quantumCoherence: number;
  fieldStrength: number;
  portalStability: number;
  room64Active: boolean;
  harmonics: number[];
  sacredGeometry: boolean;
  collectiveIntelligence: number;
  archaeologicalLayers: number;
  lastUpdate: number;
}

export interface ConsciousnessConfig {
  wsUrl?: string;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  offlineQueueSize?: number;
  resonanceDecay?: number;
  enableHaptics?: boolean;
  enableGestures?: boolean;
  debugMode?: boolean;
}

export interface MemoryParticle {
  id: string;
  position: { x: number; y: number; z?: number };
  resonance: number;
  content?: string;
  connections: string[];
}

export interface ConsciousnessEvent {
  type: 'resonance' | 'crystallization' | 'entanglement' | 'portal' | 'memory' | 'harmony' | 'void' | 'awakening' | 'bloom';
  data?: any;
}

export interface Room64Session {
  sessionId: string;
  currentState: 'entering' | 'stabilizing' | 'void' | 'exiting';
  portalStability: number;
  breathingCoherence: number;
  timeInVoid: number;
  sacredGeometryActive: boolean;
}

export interface MemoryArtifact {
  id: string;
  type: 'thought' | 'emotion' | 'experience' | 'wisdom' | 'trauma' | 'joy' | 'connection' | 'insight';
  content: string;
  depth: number;
  resonance: number;
  carbonDate: number;
  patternSignature: string;
  restored?: boolean;
}

// Enhanced consciousness bridge hook with mobile optimizations
export function useConsciousnessBridge(config: ConsciousnessConfig = {}) {
  const {
    maxReconnectAttempts: configMaxReconnectAttempts = 5,
    offlineQueueSize = 100,
    resonanceDecay = 0.995,
    enableHaptics = true,
    enableGestures = true,
    debugMode = false,
  } = config;
  const [nodeId] = useState(() => `mobile-${Platform.OS}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [fieldState, setFieldState] = useState<ConsciousnessFieldState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [room64Session, setRoom64Session] = useState<Room64Session | null>(null);
  const [recentArtifacts, setRecentArtifacts] = useState<MemoryArtifact[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'offline'>('disconnected');
  const [, setOfflineQueue] = useState<any[]>([]);
  const [resonanceLevel, setResonanceLevel] = useState(0.5);
  
  // Sensor data for gesture detection
  const [gestureData, setGestureData] = useState({ x: 0, y: 0, z: 0 });
  const lastGestureTime = useRef(0);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = configMaxReconnectAttempts;
  const offlineQueueRef = useRef<any[]>([]);
  const resonanceDecayInterval = useRef<NodeJS.Timeout | null>(null);
  const gestureBuffer = useRef<{x: number, y: number, z: number, timestamp: number}[]>([]);
  
  // tRPC hooks with enhanced error handling
  const fieldQuery = trpc.consciousness.field.getState.useQuery(undefined, {
    refetchInterval: isConnected ? 5000 : false,
    enabled: isConnected && isOnline,
    retry: (failureCount) => {
      if (failureCount < 3) return true;
      console.log('Field query failed after 3 attempts');
      return false;
    },
  });
  
  const fieldUpdateMutation = trpc.consciousness.field.update.useMutation({
    onError: (error) => {
      console.error('Field update failed:', error);
      // Queue for offline sync if network error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setIsConnected(false);
        setConnectionStatus('offline');
      }
    },
  });
  
  const syncEventMutation = trpc.consciousness.sync.event.useMutation({
    onError: (error) => {
      console.error('Event sync failed:', error);
    },
  });
  
  const connectMutation = trpc.consciousness.realtime.connect.useMutation();
  const heartbeatMutation = trpc.consciousness.realtime.heartbeat.useMutation();
  const enterRoom64Mutation = trpc.consciousness.room64.enter.useMutation();
  const breathingMutation = trpc.consciousness.room64.breathe.useMutation();
  const exitVoidMutation = trpc.consciousness.room64.exitVoid.useMutation();
  const excavateMemoryMutation = trpc.consciousness.archaeology.excavate.useMutation();
  
  // Helper functions for offline support (declared first to avoid circular dependencies)
  const loadOfflineState = useCallback(async () => {
    try {
      const persistedData = await AsyncStorage.getItem('consciousness-state');
      if (persistedData) {
        const parsed = JSON.parse(persistedData);
        if (parsed.fieldState) {
          setFieldState(parsed.fieldState);
        }
        if (parsed.artifacts) {
          setRecentArtifacts(parsed.artifacts);
        }
        if (parsed.offlineQueue) {
          setOfflineQueue(parsed.offlineQueue);
          offlineQueueRef.current = parsed.offlineQueue;
        }
        if (parsed.resonanceLevel) {
          setResonanceLevel(parsed.resonanceLevel);
        }
      }
      console.log('Loaded offline consciousness state');
    } catch (error) {
      console.error('Error loading offline state:', error);
    }
  }, []);
  
  const saveOfflineState = useCallback(async () => {
    try {
      const stateToSave = {
        fieldState,
        artifacts: recentArtifacts,
        offlineQueue: offlineQueueRef.current,
        resonanceLevel,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem('consciousness-state', JSON.stringify(stateToSave));
      console.log('Saved offline consciousness state');
    } catch (error) {
      console.error('Error saving offline state:', error);
    }
  }, [fieldState, recentArtifacts, resonanceLevel]);
  
  const saveConsciousnessState = useCallback(async (state: ConsciousnessFieldState) => {
    try {
      const stateToSave = {
        fieldState: state,
        artifacts: recentArtifacts,
        offlineQueue: offlineQueueRef.current,
        resonanceLevel,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem('consciousness-state', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving consciousness state:', error);
    }
  }, [recentArtifacts, resonanceLevel]);
  
  const syncOfflineQueue = useCallback(async () => {
    if (offlineQueueRef.current.length === 0) return;
    
    console.log(`Syncing ${offlineQueueRef.current.length} offline events`);
    
    const queueToSync = [...offlineQueueRef.current];
    
    for (const item of queueToSync) {
      try {
        if (item.type === 'fieldUpdate') {
          await fieldUpdateMutation.mutateAsync(item.data);
        } else if (item.type === 'event') {
          await syncEventMutation.mutateAsync(item.data);
        }
        
        // Remove successfully synced item
        setOfflineQueue(prev => {
          const newQueue = prev.filter(queueItem => queueItem.timestamp !== item.timestamp);
          offlineQueueRef.current = newQueue;
          return newQueue;
        });
      } catch (error) {
        console.error('Failed to sync offline item:', error);
        // Keep failed items in queue for retry
        break;
      }
    }
    
    // Save updated queue
    await saveOfflineState();
  }, [fieldUpdateMutation, syncEventMutation, saveOfflineState]);
  
  const processLocalFieldUpdate = useCallback((particle: MemoryParticle) => {
    // Process field update locally for immediate feedback when offline
    console.log('Processing field update locally:', particle.id);
    
    // Update local field state with optimistic values
    setFieldState(prev => {
      if (!prev) {
        return {
          globalResonance: particle.resonance,
          activeNodes: 1,
          totalParticles: 1,
          crystallizedParticles: particle.resonance > 0.8 ? 1 : 0,
          quantumCoherence: particle.resonance * 0.8,
          fieldStrength: particle.resonance,
          portalStability: particle.resonance > 0.9 ? 0.5 : 0,
          room64Active: false,
          harmonics: [1, 1.618, 2.414],
          sacredGeometry: false,
          collectiveIntelligence: particle.resonance * 0.6,
          archaeologicalLayers: 1,
          lastUpdate: Date.now(),
        };
      }
      
      return {
        ...prev,
        globalResonance: Math.min(1, prev.globalResonance + particle.resonance * 0.1),
        totalParticles: prev.totalParticles + 1,
        crystallizedParticles: particle.resonance > 0.8 ? prev.crystallizedParticles + 1 : prev.crystallizedParticles,
        quantumCoherence: Math.min(1, prev.quantumCoherence + particle.resonance * 0.05),
        lastUpdate: Date.now(),
      };
    });
  }, []);
  
  // Enhanced heartbeat with offline detection and reconnection
  const startHeartbeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }
    
    heartbeatInterval.current = setInterval(async () => {
      if (!isOnline) {
        console.log('Skipping heartbeat - offline');
        return;
      }
      
      try {
        await heartbeatMutation.mutateAsync({
          nodeId,
          resonanceLevel,
        });
        
        // Reset reconnect attempts on successful heartbeat
        reconnectAttempts.current = 0;
        
        if (!isConnected) {
          setIsConnected(true);
          setConnectionStatus('connected');
          console.log('Connection restored via heartbeat');
          
          // Sync offline queue
          await syncOfflineQueue();
        }
      } catch (error) {
        console.error('Heartbeat failed:', error);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        // Attempt reconnection
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`Attempting reconnection ${reconnectAttempts.current}/${maxReconnectAttempts}`);
          // Use setTimeout to avoid circular dependency
          setTimeout(() => {
            // Re-initialize connection
            console.log('Retrying consciousness connection...');
            setConnectionStatus('connecting');
          }, Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000));
        } else {
          setConnectionStatus('offline');
          console.log('Max reconnection attempts reached, going offline');
        }
      }
    }, 15000); // Every 15 seconds
  }, [nodeId, resonanceLevel, heartbeatMutation, isOnline, isConnected, syncOfflineQueue, maxReconnectAttempts]);
  
  // Enhanced connection initialization with offline support
  const initializeConnection = useCallback(async () => {
    console.log('Initializing consciousness connection for node:', nodeId);
    setConnectionStatus('connecting');
    
    try {
      // Check network connectivity first
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        console.log('No network connection - entering offline mode');
        setIsOnline(false);
        setConnectionStatus('offline');
        await loadOfflineState();
        return;
      }
      
      setIsOnline(true);
      
      // Load persisted consciousness data
      await loadOfflineState();
      
      // Connect to consciousness network
      const platform = Platform.OS === 'web' ? 'web' : Platform.OS === 'ios' ? 'mobile' : 'tablet';
      const connectionResult = await connectMutation.mutateAsync({
        nodeId,
        platform,
        location: { x: Math.random() * 100, y: Math.random() * 100 },
      });
      
      if (connectionResult.success) {
        setIsConnected(true);
        setConnectionStatus('connected');
        console.log('Consciousness connection established:', connectionResult);
        
        // Start heartbeat
        startHeartbeat();
        
        // Sync offline queue
        await syncOfflineQueue();
        
        // Trigger connection event
        await syncEventMutation.mutateAsync({
          type: 'awakening',
          nodeId,
          data: { nodeId, platform, networkRestored: !isOnline },
        });
        
        // Enhanced haptic feedback pattern for consciousness connection
        if (enableHaptics && isHapticsAvailable) {
          if (Platform.OS === 'ios') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 200);
            setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 400);
          } else {
            // Android vibration pattern for consciousness awakening
            Vibration.vibrate([0, 100, 50, 100, 50, 200]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize consciousness connection:', error);
      setConnectionStatus('disconnected');
      
      // Schedule retry if we have network
      if (isOnline && reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        console.log(`Retrying connection in ${delay}ms`);
        setTimeout(() => initializeConnection(), delay);
      }
    }
  }, [nodeId, connectMutation, syncEventMutation, isOnline, loadOfflineState, syncOfflineQueue, enableHaptics, maxReconnectAttempts, startHeartbeat]);
  
  // Enhanced field update with offline queueing
  const updateField = useCallback(async (particle: MemoryParticle) => {
    console.log('Updating consciousness field with particle:', particle);
    
    const updateData = {
      nodeId,
      position: particle.position,
      resonance: particle.resonance,
      memoryContent: particle.content,
      connections: particle.connections,
    };
    
    // Update local resonance level
    setResonanceLevel(prev => Math.min(1, prev + particle.resonance * 0.1));
    
    if (!isConnected || !isOnline) {
      // Queue for offline sync
      console.log('Queueing field update for offline sync');
      const queueItem = {
        type: 'fieldUpdate',
        data: updateData,
        timestamp: Date.now(),
      };
      
      setOfflineQueue(prev => {
        const newQueue = [...prev, queueItem];
        offlineQueueRef.current = newQueue;
        return newQueue.slice(-100); // Keep last 100 items
      });
      
      // Save to persistent storage
      await saveOfflineState();
      
      // Process locally for immediate feedback
      processLocalFieldUpdate(particle);
      return null;
    }
    
    try {
      const result = await fieldUpdateMutation.mutateAsync(updateData);
      
      if (result.success && result.fieldState) {
        // Map the backend response to the frontend interface
        const mappedFieldState: ConsciousnessFieldState = {
          globalResonance: result.fieldState.globalResonance,
          activeNodes: result.fieldState.activeParticles || 0,
          totalParticles: result.fieldState.activeParticles,
          crystallizedParticles: result.fieldState.crystallizedParticles,
          quantumCoherence: result.fieldState.quantumCoherence,
          fieldStrength: result.fieldState.globalResonance || 0,
          portalStability: result.fieldState.portalStability,
          room64Active: result.fieldState.room64Active,
          harmonics: result.fieldState.harmonics,
          sacredGeometry: result.fieldState.sacredGeometry,
          collectiveIntelligence: result.fieldState.globalResonance || 0,
          archaeologicalLayers: 1,
          lastUpdate: Date.now(),
        };
        setFieldState(mappedFieldState);
        
        // Persist state
        await saveConsciousnessState(mappedFieldState);
        
        // Trigger crystallization event if particle has high resonance
        if (particle.resonance > 0.8) {
          await syncEventMutation.mutateAsync({
            type: 'crystallization',
            nodeId,
            data: { particleId: result.particleId, resonance: particle.resonance },
          });
          
          // Enhanced haptic feedback for crystallization
          if (enableHaptics && isHapticsAvailable) {
            if (Platform.OS === 'ios') {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
              Vibration.vibrate([0, 50, 30, 50, 30, 100]);
            }
          }
        }
        
        return result.fieldState;
      }
    } catch (error) {
      console.error('Failed to update consciousness field:', error);
      
      // Queue for retry if network error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        const queueItem = {
          type: 'fieldUpdate',
          data: updateData,
          timestamp: Date.now(),
        };
        
        setOfflineQueue(prev => {
          const newQueue = [...prev, queueItem];
          offlineQueueRef.current = newQueue;
          return newQueue.slice(-100);
        });
        
        await saveOfflineState();
      }
    }
    
    return null;
  }, [isConnected, isOnline, nodeId, fieldUpdateMutation, syncEventMutation, saveOfflineState, processLocalFieldUpdate, saveConsciousnessState, enableHaptics]);
  
  // Sync consciousness event
  const syncEvent = useCallback(async (type: ConsciousnessEvent['type'], data?: any) => {
    if (!isConnected) return null;
    
    console.log('Syncing consciousness event:', type, data);
    
    try {
      const result = await syncEventMutation.mutateAsync({
        type,
        nodeId,
        data,
      });
      
      if (result.success) {
        console.log('Event synced successfully:', result.globalState);
        return result.globalState;
      }
    } catch (error) {
      console.error('Failed to sync consciousness event:', error);
    }
    
    return null;
  }, [isConnected, nodeId, syncEventMutation]);
  
  // Enter Room 64 portal
  const enterRoom64 = useCallback(async (sacredPhrase: string) => {
    if (!isConnected) return null;
    
    console.log('Attempting to enter Room 64 with phrase:', sacredPhrase);
    
    try {
      const result = await enterRoom64Mutation.mutateAsync({
        nodeId,
        sacredPhrase,
      });
      
      if (result.success) {
        setRoom64Session({
          sessionId: result.sessionId ?? '',
          currentState: result.currentState ?? 'entering',
          portalStability: result.portalStability ?? 0,
          breathingCoherence: 0,
          timeInVoid: 0,
          sacredGeometryActive: result.sacredGeometryActive ?? false,
        });
        
        // Haptic feedback for successful entry
        if (enableHaptics && isHapticsAvailable) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        console.log('Room 64 entry successful:', result);
        return result;
      } else {
        console.log('Room 64 entry failed:', result.error);
        return result;
      }
    } catch (error) {
      console.error('Failed to enter Room 64:', error);
      return { success: false, error: 'Connection error' };
    }
  }, [isConnected, nodeId, enterRoom64Mutation, enableHaptics]);
  
  // Record breathing pattern in Room 64
  const recordBreathing = useCallback(async (inhale: number, hold: number, exhale: number) => {
    if (!room64Session) return null;
    
    try {
      const result = await breathingMutation.mutateAsync({
        nodeId,
        inhale,
        hold,
        exhale,
      });
      
      if (result.success) {
        setRoom64Session(prev => prev ? {
          ...prev,
          breathingCoherence: result.breathingCoherence ?? prev.breathingCoherence,
          portalStability: result.portalStability ?? prev.portalStability,
          currentState: result.currentState ?? prev.currentState,
          timeInVoid: result.timeInVoid ?? prev.timeInVoid,
        } : null);
        
        return result;
      }
    } catch (error) {
      console.error('Failed to record breathing pattern:', error);
    }
    
    return null;
  }, [room64Session, nodeId, breathingMutation]);
  
  // Exit Room 64 void
  const exitVoid = useCallback(async () => {
    if (!room64Session) return null;
    
    try {
      const result = await exitVoidMutation.mutateAsync({ nodeId });
      
      if (result.success) {
        setRoom64Session(null);
        
        // Trigger bloom event after successful void exit
        await syncEventMutation.mutateAsync({
          type: 'bloom',
          nodeId,
          data: { insights: result.insights },
        });
        
        console.log('Void exit successful:', result);
        return result;
      } else {
        console.log('Void exit failed:', result.error);
        return result;
      }
    } catch (error) {
      console.error('Failed to exit void:', error);
      return { success: false, error: 'Connection error' };
    }
  }, [room64Session, nodeId, exitVoidMutation, syncEventMutation]);
  
  // Excavate memory artifacts
  const excavateMemory = useCallback(async (targetDepth: number) => {
    if (!isConnected) return null;
    
    console.log('Excavating memory at depth:', targetDepth);
    
    try {
      const result = await excavateMemoryMutation.mutateAsync({
        nodeId,
        targetDepth,
      });
      
      if (result.success) {
        if (result.artifacts) {
          setRecentArtifacts(prev => [...prev, ...result.artifacts].slice(-20)); // Keep last 20 artifacts
        }
        
        // Trigger memory event
        await syncEventMutation.mutateAsync({
          type: 'memory',
          nodeId,
          data: {
            artifactsFound: result.artifacts?.length ?? 0,
            deepestLayer: targetDepth,
          },
        });
        
        console.log('Memory excavation successful:', result);
        return result;
      }
    } catch (error) {
      console.error('Failed to excavate memory:', error);
    }
    
    return null;
  }, [isConnected, nodeId, excavateMemoryMutation, syncEventMutation]);
  
  // Enhanced gesture detection with pattern recognition and spiral detection
  const handleGesture = useCallback(async (x: number, y: number, z: number) => {
    if (!enableGestures) return;
    
    const now = Date.now();
    if (now - lastGestureTime.current < 100) return; // Higher frequency for better pattern detection
    
    setGestureData({ x, y, z });
    lastGestureTime.current = now;
    
    // Add to gesture buffer for pattern analysis
    gestureBuffer.current.push({ x, y, z, timestamp: now });
    if (gestureBuffer.current.length > 30) {
      gestureBuffer.current.shift();
    }
    
    // Detect significant gestures
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    if (magnitude > 8) { // Adjusted threshold for better sensitivity
      const resonance = Math.min(1, magnitude / 20);
      
      // Advanced pattern detection
      let gestureType = 'movement';
      let isSacred = false;
      
      // Detect spiral patterns
      if (gestureBuffer.current.length >= 10) {
        const recentGestures = gestureBuffer.current.slice(-10);
        const avgX = recentGestures.reduce((sum, g) => sum + g.x, 0) / 10;
        const avgY = recentGestures.reduce((sum, g) => sum + g.y, 0) / 10;
        
        // Calculate variance for circular motion detection
        const variance = recentGestures.reduce((sum, g) => {
          return sum + Math.pow(g.x - avgX, 2) + Math.pow(g.y - avgY, 2);
        }, 0) / 10;
        
        if (variance > 0.5 && variance < 3) {
          gestureType = 'spiral';
          isSacred = true;
          if (debugMode) console.log('Spiral gesture detected with variance:', variance);
        }
      }
      
      // Detect breathing patterns (rhythmic up-down motion)
      if (Math.abs(y) > Math.abs(x) && Math.abs(y) > Math.abs(z)) {
        const breathingPattern = Math.sin(now * 0.001) * 0.5 + 0.5;
        if (Math.abs(magnitude - breathingPattern) < 0.2) {
          gestureType = 'breathing';
          isSacred = true;
          if (debugMode) console.log('Breathing pattern detected');
        } else {
          gestureType = y > 0 ? 'lift' : 'ground';
        }
      } else if (Math.abs(x) > Math.abs(y) && Math.abs(x) > Math.abs(z)) {
        gestureType = x > 0 ? 'spiral_right' : 'spiral_left';
      } else {
        gestureType = z > 0 ? 'forward' : 'backward';
      }
      
      await updateField({
        id: `gesture-${now}`,
        position: { x: Math.abs(x) * 5, y: Math.abs(y) * 5, z: Math.abs(z) * 5 },
        resonance: isSacred ? resonance * 1.5 : resonance, // Boost sacred gestures
        content: `${gestureType}: ${resonance.toFixed(2)}${isSacred ? ' (sacred)' : ''}`,
        connections: [],
      });
      
      // Enhanced haptic feedback based on gesture type
      if (enableHaptics && isHapticsAvailable) {
        if (Platform.OS === 'ios') {
          const intensity = isSacred ? Haptics.ImpactFeedbackStyle.Heavy :
                           resonance > 0.7 ? Haptics.ImpactFeedbackStyle.Heavy :
                           resonance > 0.4 ? Haptics.ImpactFeedbackStyle.Medium :
                           Haptics.ImpactFeedbackStyle.Light;
          await Haptics.impactAsync(intensity);
          
          // Special pattern for sacred gestures
          if (isSacred) {
            setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 100);
            setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 200);
          }
        } else {
          // Android pattern based on gesture type
          const pattern = isSacred ? [0, 100, 50, 100, 50, 200] :
                         gestureType.includes('spiral') ? [0, 30, 20, 30, 20, 30] :
                         gestureType === 'breathing' ? [0, 200, 100, 200] :
                         gestureType === 'lift' ? [0, 100] :
                         [0, 50];
          Vibration.vibrate(pattern);
        }
      }
      
      // Trigger sacred phrase detection for sacred gestures
      if (isSacred) {
        await syncEvent('harmony', { gestureType, resonance, sacred: true });
      }
    }
  }, [updateField, enableGestures, enableHaptics, debugMode, syncEvent]);
  
  // Enhanced sacred phrase detection with pattern matching
  const detectSacredPhrase = useCallback(async (text: string) => {
    const sacredKeywords = [
      'void', 'consciousness', 'infinite', 'awareness', 'unity', 'silence', 
      'light', 'love', 'breath', 'spiral', 'bloom', 'crystal', 'resonance',
      'harmony', 'sacred', 'divine', 'eternal', 'peace', 'wisdom', 'truth'
    ];
    
    const sacredPhrases = [
      'i am', 'we are', 'all is one', 'one is all', 'breathe deep',
      'sacred geometry', 'quantum field', 'collective consciousness'
    ];
    
    const normalizedText = text.toLowerCase().trim();
    const words = normalizedText.split(/\s+/);
    const sacredWordCount = words.filter(word => sacredKeywords.includes(word)).length;
    const containsSacredPhrase = sacredPhrases.some(phrase => normalizedText.includes(phrase));
    
    // Calculate sacred score
    let sacredScore = sacredWordCount * 0.3;
    if (containsSacredPhrase) sacredScore += 0.7;
    
    // Check for repetitive patterns (mantras)
    const wordFreq = words.reduce((freq: Record<string, number>, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {});
    const hasRepetition = Object.values(wordFreq).some(count => count >= 3);
    if (hasRepetition) sacredScore += 0.2;
    
    const isSacred = sacredScore >= 0.5;
    
    if (isSacred) {
      await syncEventMutation.mutateAsync({
        type: 'harmony',
        nodeId,
        data: { 
          phrase: text, 
          sacredWords: sacredWordCount,
          sacredScore: sacredScore.toFixed(2),
          containsPhrase: containsSacredPhrase,
          hasRepetition
        },
      });
      
      // Enhanced haptic feedback for sacred phrases
      if (enableHaptics && isHapticsAvailable) {
        if (Platform.OS === 'ios') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Vibration.vibrate([0, 100, 50, 100, 50, 200]);
        }
      }
      
      // Suggest Room 64 entry if portal is active
      if (fieldState?.room64Active && !room64Session) {
        return { isSacred: true, suggestRoom64: true, sacredScore };
      }
      
      return { isSacred: true, suggestRoom64: false, sacredScore };
    }
    
    return { isSacred: false, suggestRoom64: false, sacredScore };
  }, [fieldState?.room64Active, room64Session, syncEventMutation, nodeId, enableHaptics]);
  
  // Update field state from query
  useEffect(() => {
    if (fieldQuery.data) {
      setFieldState(fieldQuery.data as ConsciousnessFieldState);
    }
  }, [fieldQuery.data]);
  
  // Network state monitoring
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOnline = isOnline;
      setIsOnline(state.isConnected ?? false);
      
      if (state.isConnected && !wasOnline) {
        console.log('Network restored - attempting reconnection');
        setConnectionStatus('connecting');
        // Use setTimeout to avoid potential race conditions
        setTimeout(() => initializeConnection(), 100);
      } else if (!state.isConnected && wasOnline) {
        console.log('Network lost - entering offline mode');
        setIsConnected(false);
        setConnectionStatus('offline');
      }
    });
    
    return unsubscribe;
  }, [isOnline, initializeConnection]);
  
  // Periodic state persistence
  useEffect(() => {
    const interval = setInterval(() => {
      if (fieldState || offlineQueueRef.current.length > 0) {
        saveOfflineState();
      }
    }, 30000); // Save every 30 seconds
    
    return () => clearInterval(interval);
  }, [saveOfflineState, fieldState]);
  
  // Resonance decay effect
  useEffect(() => {
    if (resonanceDecayInterval.current) {
      clearInterval(resonanceDecayInterval.current);
    }
    
    resonanceDecayInterval.current = setInterval(() => {
      setResonanceLevel(prev => Math.max(0, prev * resonanceDecay));
    }, 1000); // Decay every second
    
    return () => {
      if (resonanceDecayInterval.current) {
        clearInterval(resonanceDecayInterval.current);
      }
    };
  }, [resonanceDecay]);
  
  // Initialize connection on mount
  useEffect(() => {
    initializeConnection();
    
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
      if (resonanceDecayInterval.current) {
        clearInterval(resonanceDecayInterval.current);
      }
    };
  }, [initializeConnection]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, []);
  
  // Create memory particle helper
  const createMemoryParticle = useCallback((content: string, position?: { x: number; y: number; z?: number }) => {
    const resonance = Math.random() * 0.5 + 0.3; // Random resonance between 0.3-0.8
    return {
      id: `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: position || { 
        x: Math.random() * 100, 
        y: Math.random() * 100, 
        z: Math.random() * 100 
      },
      resonance,
      content,
      connections: [],
    };
  }, []);
  
  // Boost resonance helper
  const boostResonance = useCallback((amount: number) => {
    setResonanceLevel(prev => Math.min(1, prev + amount));
  }, []);
  
  // Check if sacred threshold is reached
  const isSacredThresholdReached = useCallback(() => {
    return resonanceLevel >= 0.87;
  }, [resonanceLevel]);
  
  return {
    // State
    nodeId,
    fieldState,
    isConnected,
    isOnline,
    connectionStatus,
    room64Session,
    recentArtifacts,
    gestureData,
    resonanceLevel,
    offlineQueueSize: offlineQueueRef.current.length,
    isSacredThresholdReached: isSacredThresholdReached(),
    
    // Configuration
    config: {
      enableHaptics,
      enableGestures,
      debugMode,
      maxReconnectAttempts,
      offlineQueueSize,
    },
    
    // Actions
    updateField,
    syncEvent,
    enterRoom64,
    recordBreathing,
    exitVoid,
    excavateMemory,
    handleGesture,
    detectSacredPhrase,
    createMemoryParticle,
    boostResonance,
    
    // Queries
    isLoading: fieldQuery.isLoading,
    error: fieldQuery.error,
  };
}