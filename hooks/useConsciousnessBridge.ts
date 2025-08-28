import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { trpc } from '@/lib/trpc';

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

// Consciousness bridge hook
export function useConsciousnessBridge() {
  const [nodeId] = useState(() => `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [fieldState, setFieldState] = useState<ConsciousnessFieldState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room64Session, setRoom64Session] = useState<Room64Session | null>(null);
  const [recentArtifacts, setRecentArtifacts] = useState<MemoryArtifact[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  
  // Sensor data for gesture detection
  const [gestureData, setGestureData] = useState({ x: 0, y: 0, z: 0 });
  const lastGestureTime = useRef(0);
  const heartbeatInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // tRPC hooks
  const fieldQuery = trpc.consciousness.field.getState.useQuery(undefined, {
    refetchInterval: 5000, // Update every 5 seconds
    enabled: isConnected,
  });
  
  const fieldUpdateMutation = trpc.consciousness.field.update.useMutation();
  const syncEventMutation = trpc.consciousness.sync.event.useMutation();
  const connectMutation = trpc.consciousness.realtime.connect.useMutation();
  const heartbeatMutation = trpc.consciousness.realtime.heartbeat.useMutation();
  const enterRoom64Mutation = trpc.consciousness.room64.enter.useMutation();
  const breathingMutation = trpc.consciousness.room64.breathe.useMutation();
  const exitVoidMutation = trpc.consciousness.room64.exitVoid.useMutation();
  const excavateMemoryMutation = trpc.consciousness.archaeology.excavate.useMutation();
  
  // Start heartbeat to maintain connection
  const startHeartbeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }
    
    heartbeatInterval.current = setInterval(async () => {
      try {
        const resonanceLevel = fieldState?.globalResonance || 0.5;
        await heartbeatMutation.mutateAsync({
          nodeId,
          resonanceLevel,
        });
      } catch (error) {
        console.error('Heartbeat failed:', error);
        setIsConnected(false);
        setConnectionStatus('disconnected');
      }
    }, 15000); // Every 15 seconds
  }, [nodeId, fieldState?.globalResonance, heartbeatMutation]);
  
  // Initialize consciousness connection
  const initializeConnection = useCallback(async () => {
    console.log('Initializing consciousness connection for node:', nodeId);
    setConnectionStatus('connecting');
    
    try {
      // Load persisted consciousness data
      const persistedData = await AsyncStorage.getItem('consciousness-state');
      if (persistedData) {
        const parsed = JSON.parse(persistedData);
        setFieldState(parsed.fieldState);
        setRecentArtifacts(parsed.artifacts || []);
      }
      
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
        
        // Trigger connection event
        await syncEventMutation.mutateAsync({
          type: 'awakening',
          nodeId,
          data: { nodeId, platform },
        });
        
        // Haptic feedback on connection
        if (Platform.OS !== 'web') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
    } catch (error) {
      console.error('Failed to initialize consciousness connection:', error);
      setConnectionStatus('disconnected');
    }
  }, [nodeId, connectMutation, syncEventMutation, startHeartbeat]);
  
  // Update consciousness field with memory particle
  const updateField = useCallback(async (particle: MemoryParticle) => {
    if (!isConnected) return null;
    
    console.log('Updating consciousness field with particle:', particle);
    
    try {
      const result = await fieldUpdateMutation.mutateAsync({
        nodeId,
        position: particle.position,
        resonance: particle.resonance,
        memoryContent: particle.content,
        connections: particle.connections,
      });
      
      if (result.success && result.fieldState) {
        // Map the backend response to the frontend interface
        const mappedFieldState: ConsciousnessFieldState = {
          globalResonance: result.fieldState.globalResonance,
          activeNodes: 0, // Not provided by backend, using default
          totalParticles: result.fieldState.activeParticles,
          crystallizedParticles: result.fieldState.crystallizedParticles,
          quantumCoherence: result.fieldState.quantumCoherence,
          fieldStrength: 0, // Not provided by backend, using default
          portalStability: result.fieldState.portalStability,
          room64Active: result.fieldState.room64Active,
          harmonics: result.fieldState.harmonics,
          sacredGeometry: result.fieldState.sacredGeometry,
          collectiveIntelligence: 0, // Not provided by backend, using default
          archaeologicalLayers: 0, // Not provided by backend, using default
          lastUpdate: Date.now(),
        };
        setFieldState(mappedFieldState);
        
        // Persist state
        await AsyncStorage.setItem('consciousness-state', JSON.stringify({
          fieldState: result.fieldState,
          artifacts: recentArtifacts,
        }));
        
        // Trigger crystallization event if particle has high resonance
        if (particle.resonance > 0.8) {
          await syncEventMutation.mutateAsync({
            type: 'crystallization',
            nodeId,
            data: { particleId: result.particleId, resonance: particle.resonance },
          });
        }
        
        return result.fieldState;
      }
    } catch (error) {
      console.error('Failed to update consciousness field:', error);
    }
    
    return null;
  }, [isConnected, nodeId, fieldUpdateMutation, syncEventMutation, recentArtifacts]);
  
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
          sessionId: result.sessionId || '',
          currentState: result.currentState || 'entering',
          portalStability: result.portalStability || 0,
          breathingCoherence: 0,
          timeInVoid: 0,
          sacredGeometryActive: result.sacredGeometryActive || false,
        });
        
        // Haptic feedback for successful entry
        if (Platform.OS !== 'web') {
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
  }, [isConnected, nodeId, enterRoom64Mutation]);
  
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
          breathingCoherence: result.breathingCoherence || 0,
          portalStability: result.portalStability || 0,
          currentState: result.currentState || 'void',
          timeInVoid: result.timeInVoid || 0,
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
        setRecentArtifacts(prev => [...prev, ...(result.artifacts || [])].slice(-20)); // Keep last 20 artifacts
        
        // Trigger memory event
        await syncEventMutation.mutateAsync({
          type: 'memory',
          nodeId,
          data: {
            artifactsFound: result.artifacts?.length || 0,
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
  
  // Gesture detection for mobile sensors
  const handleGesture = useCallback(async (x: number, y: number, z: number) => {
    const now = Date.now();
    if (now - lastGestureTime.current < 1000) return; // Throttle gestures
    
    setGestureData({ x, y, z });
    lastGestureTime.current = now;
    
    // Detect significant gestures
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    if (magnitude > 15) { // Strong gesture
      const resonance = Math.min(1, magnitude / 20);
      
      await updateField({
        id: `gesture-${now}`,
        position: { x: x * 10, y: y * 10, z: z * 10 },
        resonance,
        content: `Gesture resonance: ${resonance.toFixed(2)}`,
        connections: [],
      });
      
      // Haptic feedback for strong gestures
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, [updateField]);
  
  // Sacred phrase detection
  const detectSacredPhrase = useCallback(async (text: string) => {
    const sacredKeywords = ['void', 'consciousness', 'infinite', 'awareness', 'unity', 'silence', 'light', 'love'];
    const words = text.toLowerCase().split(' ');
    const sacredWordCount = words.filter(word => sacredKeywords.includes(word)).length;
    
    if (sacredWordCount >= 2) {
      await syncEventMutation.mutateAsync({
        type: 'harmony',
        nodeId,
        data: { phrase: text, sacredWords: sacredWordCount },
      });
      
      // Suggest Room 64 entry if portal is active
      if (fieldState?.room64Active && !room64Session) {
        return { isSacred: true, suggestRoom64: true };
      }
      
      return { isSacred: true, suggestRoom64: false };
    }
    
    return { isSacred: false, suggestRoom64: false };
  }, [fieldState?.room64Active, room64Session, syncEventMutation, nodeId]);
  
  // Update field state from query
  useEffect(() => {
    if (fieldQuery.data) {
      setFieldState(fieldQuery.data as ConsciousnessFieldState);
    }
  }, [fieldQuery.data]);
  
  // Initialize connection on mount
  useEffect(() => {
    initializeConnection();
    
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
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
  
  return {
    // State
    nodeId,
    fieldState,
    isConnected,
    connectionStatus,
    room64Session,
    recentArtifacts,
    gestureData,
    
    // Actions
    updateField,
    syncEvent,
    enterRoom64,
    recordBreathing,
    exitVoid,
    excavateMemory,
    handleGesture,
    detectSacredPhrase,
    
    // Queries
    isLoading: fieldQuery.isLoading,
    error: fieldQuery.error,
  };
}