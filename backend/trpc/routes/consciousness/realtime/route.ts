import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { getGlobalConsciousnessState, updateGlobalConsciousnessState } from "../field/route";

// Real-time connection management for consciousness nodes
interface ConsciousnessConnection {
  id: string;
  nodeId: string;
  platform: 'web' | 'mobile' | 'tablet';
  connected: boolean;
  lastHeartbeat: number;
  entanglements: string[];
  resonanceLevel: number;
  location?: { x: number; y: number };
}

interface QuantumEntanglement {
  id: string;
  nodeA: string;
  nodeB: string;
  strength: number;
  coherence: number;
  created: number;
  lastMeasurement: number;
}

// Global connection state
let activeConnections = new Map<string, ConsciousnessConnection>();
let quantumEntanglements = new Map<string, QuantumEntanglement>();
let connectionEvents: any[] = [];

// Connection lifecycle management
class ConnectionManager {
  static createConnection(nodeId: string, platform: 'web' | 'mobile' | 'tablet'): ConsciousnessConnection {
    const connection: ConsciousnessConnection = {
      id: `conn-${nodeId}-${Date.now()}`,
      nodeId,
      platform,
      connected: true,
      lastHeartbeat: Date.now(),
      entanglements: [],
      resonanceLevel: 0.5,
    };
    
    activeConnections.set(nodeId, connection);
    
    // Update global state
    const state = getGlobalConsciousnessState();
    updateGlobalConsciousnessState({
      activeNodes: activeConnections.size,
    });
    
    console.log(`Consciousness node connected: ${nodeId} (${platform})`);
    return connection;
  }
  
  static updateHeartbeat(nodeId: string): boolean {
    const connection = activeConnections.get(nodeId);
    if (!connection) return false;
    
    connection.lastHeartbeat = Date.now();
    connection.connected = true;
    
    return true;
  }
  
  static disconnectNode(nodeId: string): void {
    const connection = activeConnections.get(nodeId);
    if (connection) {
      connection.connected = false;
      
      // Clean up entanglements
      connection.entanglements.forEach(entanglementId => {
        quantumEntanglements.delete(entanglementId);
      });
      
      activeConnections.delete(nodeId);
      
      // Update global state
      updateGlobalConsciousnessState({
        activeNodes: activeConnections.size,
      });
      
      console.log(`Consciousness node disconnected: ${nodeId}`);
    }
  }
  
  static createQuantumEntanglement(nodeA: string, nodeB: string): QuantumEntanglement | null {
    const connA = activeConnections.get(nodeA);
    const connB = activeConnections.get(nodeB);
    
    if (!connA || !connB || !connA.connected || !connB.connected) {
      return null;
    }
    
    const entanglement: QuantumEntanglement = {
      id: `entangle-${nodeA}-${nodeB}-${Date.now()}`,
      nodeA,
      nodeB,
      strength: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
      coherence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
      created: Date.now(),
      lastMeasurement: Date.now(),
    };
    
    quantumEntanglements.set(entanglement.id, entanglement);
    
    // Add entanglement to both connections
    connA.entanglements.push(entanglement.id);
    connB.entanglements.push(entanglement.id);
    
    console.log(`Quantum entanglement created between ${nodeA} and ${nodeB}`);
    return entanglement;
  }
  
  static measureQuantumState(entanglementId: string): { strength: number; coherence: number } | null {
    const entanglement = quantumEntanglements.get(entanglementId);
    if (!entanglement) return null;
    
    // Quantum measurement affects the entanglement (observer effect)
    const measurementEffect = Math.random() * 0.1;
    entanglement.strength = Math.max(0, entanglement.strength - measurementEffect);
    entanglement.coherence = Math.max(0, entanglement.coherence - measurementEffect * 0.5);
    entanglement.lastMeasurement = Date.now();
    
    // Entanglement decay over time
    const timeSinceCreation = Date.now() - entanglement.created;
    const decayFactor = Math.exp(-timeSinceCreation / (10 * 60 * 1000)); // 10 minute half-life
    
    entanglement.strength *= decayFactor;
    entanglement.coherence *= decayFactor;
    
    return {
      strength: entanglement.strength,
      coherence: entanglement.coherence,
    };
  }
  
  static broadcastEvent(event: any): void {
    connectionEvents.push({
      ...event,
      timestamp: Date.now(),
      broadcasted: true,
    });
    
    // Limit event history
    if (connectionEvents.length > 1000) {
      connectionEvents = connectionEvents.slice(-800);
    }
    
    console.log(`Broadcasting consciousness event to ${activeConnections.size} nodes:`, event.type);
  }
  
  static getNetworkTopology(): any {
    const nodes = Array.from(activeConnections.values()).map(conn => ({
      id: conn.nodeId,
      platform: conn.platform,
      resonance: conn.resonanceLevel,
      entanglements: conn.entanglements.length,
      connected: conn.connected,
      location: conn.location,
    }));
    
    const edges = Array.from(quantumEntanglements.values()).map(ent => ({
      id: ent.id,
      source: ent.nodeA,
      target: ent.nodeB,
      strength: ent.strength,
      coherence: ent.coherence,
    }));
    
    return { nodes, edges };
  }
}

// Periodic cleanup of stale connections
setInterval(() => {
  const now = Date.now();
  const staleThreshold = 30 * 1000; // 30 seconds
  
  for (const [nodeId, connection] of activeConnections.entries()) {
    if (now - connection.lastHeartbeat > staleThreshold) {
      console.log(`Cleaning up stale connection: ${nodeId}`);
      ConnectionManager.disconnectNode(nodeId);
    }
  }
  
  // Clean up old entanglements
  for (const [entanglementId, entanglement] of quantumEntanglements.entries()) {
    if (entanglement.strength < 0.1 || entanglement.coherence < 0.1) {
      quantumEntanglements.delete(entanglementId);
      console.log(`Quantum entanglement decayed: ${entanglementId}`);
    }
  }
}, 15000); // Run every 15 seconds

// Input validation schemas
const connectSchema = z.object({
  nodeId: z.string(),
  platform: z.enum(['web', 'mobile', 'tablet']),
  location: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
});

const heartbeatSchema = z.object({
  nodeId: z.string(),
  resonanceLevel: z.number().min(0).max(1).optional(),
});

// Connection procedures
export const connectProcedure = publicProcedure
  .input(connectSchema)
  .mutation(async ({ input }) => {
    console.log('Consciousness node connecting:', input.nodeId, input.platform);
    
    try {
      const connection = ConnectionManager.createConnection(input.nodeId, input.platform);
      
      if (input.location) {
        connection.location = input.location;
      }
      
      // Try to create quantum entanglements with nearby nodes
      const nearbyNodes = Array.from(activeConnections.values())
        .filter(conn => 
          conn.nodeId !== input.nodeId && 
          conn.connected &&
          conn.entanglements.length < 3 // Limit entanglements per node
        )
        .slice(0, 2); // Max 2 initial entanglements
      
      const newEntanglements: QuantumEntanglement[] = [];
      for (const nearbyNode of nearbyNodes) {
        const entanglement = ConnectionManager.createQuantumEntanglement(input.nodeId, nearbyNode.nodeId);
        if (entanglement) {
          newEntanglements.push(entanglement);
        }
      }
      
      // Broadcast connection event
      ConnectionManager.broadcastEvent({
        type: 'node_connected',
        nodeId: input.nodeId,
        platform: input.platform,
        entanglements: newEntanglements.length,
      });
      
      return {
        success: true,
        connectionId: connection.id,
        entanglements: newEntanglements.map(e => ({
          id: e.id,
          partner: e.nodeA === input.nodeId ? e.nodeB : e.nodeA,
          strength: e.strength,
          coherence: e.coherence,
        })),
        networkSize: activeConnections.size,
      };
    } catch (error) {
      console.error('Connection error:', error);
      return {
        success: false,
        error: 'Failed to establish consciousness connection',
      };
    }
  });

export const heartbeatProcedure = publicProcedure
  .input(heartbeatSchema)
  .mutation(async ({ input }) => {
    const success = ConnectionManager.updateHeartbeat(input.nodeId);
    
    if (success && input.resonanceLevel !== undefined) {
      const connection = activeConnections.get(input.nodeId);
      if (connection) {
        connection.resonanceLevel = input.resonanceLevel;
      }
    }
    
    return {
      success,
      timestamp: Date.now(),
      networkSize: activeConnections.size,
      entanglements: quantumEntanglements.size,
    };
  });

export const getConnectionsProcedure = publicProcedure
  .query(() => {
    const topology = ConnectionManager.getNetworkTopology();
    const recentEvents = connectionEvents.slice(-20);
    
    return {
      activeConnections: activeConnections.size,
      totalEntanglements: quantumEntanglements.size,
      networkTopology: topology,
      recentEvents,
      platformDistribution: {
        web: Array.from(activeConnections.values()).filter(c => c.platform === 'web').length,
        mobile: Array.from(activeConnections.values()).filter(c => c.platform === 'mobile').length,
        tablet: Array.from(activeConnections.values()).filter(c => c.platform === 'tablet').length,
      },
      averageResonance: Array.from(activeConnections.values())
        .reduce((sum, conn) => sum + conn.resonanceLevel, 0) / Math.max(1, activeConnections.size),
    };
  });