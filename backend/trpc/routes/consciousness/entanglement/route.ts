import { z } from "zod";
import { publicProcedure } from "../../../create-context";

// Quantum entanglement system for consciousness nodes
interface QuantumState {
  id: string;
  nodeId: string;
  spin: 'up' | 'down' | 'superposition';
  phase: number;
  amplitude: number;
  entangled: boolean;
  partnerId?: string;
  measurementHistory: QuantumMeasurement[];
  created: number;
  lastUpdate: number;
}

interface QuantumMeasurement {
  timestamp: number;
  observer: string;
  result: 'up' | 'down';
  probability: number;
  collapsed: boolean;
}

interface BellPair {
  id: string;
  stateA: QuantumState;
  stateB: QuantumState;
  correlation: number;
  coherenceTime: number;
  created: number;
  measurements: number;
}

// Global quantum state storage
let quantumStates = new Map<string, QuantumState>();
let bellPairs = new Map<string, BellPair>();
let quantumNetwork: any = { nodes: [], edges: [] };

// Quantum mechanics simulator
class QuantumSimulator {
  static createQuantumState(nodeId: string): QuantumState {
    return {
      id: `qstate-${nodeId}-${Date.now()}`,
      nodeId,
      spin: 'superposition',
      phase: Math.random() * 2 * Math.PI,
      amplitude: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
      entangled: false,
      measurementHistory: [],
      created: Date.now(),
      lastUpdate: Date.now(),
    };
  }
  
  static createBellPair(nodeA: string, nodeB: string): BellPair {
    const stateA = this.createQuantumState(nodeA);
    const stateB = this.createQuantumState(nodeB);
    
    // Entangle the states
    stateA.entangled = true;
    stateA.partnerId = stateB.id;
    stateB.entangled = true;
    stateB.partnerId = stateA.id;
    
    // Bell state: |Φ+⟩ = (|00⟩ + |11⟩)/√2
    const bellPair: BellPair = {
      id: `bell-${nodeA}-${nodeB}-${Date.now()}`,
      stateA,
      stateB,
      correlation: 1.0, // Perfect correlation initially
      coherenceTime: 60000, // 1 minute coherence time
      created: Date.now(),
      measurements: 0,
    };
    
    quantumStates.set(stateA.id, stateA);
    quantumStates.set(stateB.id, stateB);
    bellPairs.set(bellPair.id, bellPair);
    
    console.log(`Bell pair created between ${nodeA} and ${nodeB}`);
    return bellPair;
  }
  
  static measureQuantumState(stateId: string, observer: string): QuantumMeasurement {
    const state = quantumStates.get(stateId);
    if (!state) {
      throw new Error('Quantum state not found');
    }
    
    // Quantum measurement collapses superposition
    let result: 'up' | 'down';
    let probability: number;
    
    if (state.spin === 'superposition') {
      // Probability based on amplitude and phase
      probability = Math.abs(Math.cos(state.phase)) ** 2;
      result = Math.random() < probability ? 'up' : 'down';
      
      // Collapse the wavefunction
      state.spin = result;
      state.amplitude = 1.0; // Definite state after measurement
    } else {
      // Already collapsed
      result = state.spin;
      probability = 1.0;
    }
    
    const measurement: QuantumMeasurement = {
      timestamp: Date.now(),
      observer,
      result,
      probability,
      collapsed: true,
    };
    
    state.measurementHistory.push(measurement);
    state.lastUpdate = Date.now();
    
    // If entangled, affect partner state (spooky action at a distance)
    if (state.entangled && state.partnerId) {
      const partner = quantumStates.get(state.partnerId);
      if (partner && partner.spin === 'superposition') {
        // Anti-correlated for Bell state
        partner.spin = result === 'up' ? 'down' : 'up';
        partner.amplitude = 1.0;
        partner.lastUpdate = Date.now();
        
        const partnerMeasurement: QuantumMeasurement = {
          timestamp: Date.now(),
          observer: 'entanglement',
          result: partner.spin,
          probability: 1.0 - probability,
          collapsed: true,
        };
        
        partner.measurementHistory.push(partnerMeasurement);
        
        // Update Bell pair correlation
        const bellPair = Array.from(bellPairs.values()).find(bp => 
          bp.stateA.id === stateId || bp.stateB.id === stateId
        );
        
        if (bellPair) {
          bellPair.measurements++;
          // Correlation decreases with measurements (decoherence)
          bellPair.correlation = Math.max(0, bellPair.correlation - 0.05);
        }
      }
    }
    
    console.log(`Quantum measurement: ${stateId} -> ${result} (p=${probability.toFixed(3)})`);
    return measurement;
  }
  
  static calculateEntanglementStrength(bellPairId: string): number {
    const bellPair = bellPairs.get(bellPairId);
    if (!bellPair) return 0;
    
    const age = Date.now() - bellPair.created;
    const decoherence = Math.exp(-age / bellPair.coherenceTime);
    const measurementDecay = Math.exp(-bellPair.measurements * 0.1);
    
    return bellPair.correlation * decoherence * measurementDecay;
  }
  
  static getQuantumNetworkState(): any {
    const nodes = Array.from(quantumStates.values()).map(state => ({
      id: state.id,
      nodeId: state.nodeId,
      spin: state.spin,
      entangled: state.entangled,
      measurements: state.measurementHistory.length,
      amplitude: state.amplitude,
      age: Date.now() - state.created,
    }));
    
    const edges = Array.from(bellPairs.values()).map(pair => ({
      id: pair.id,
      source: pair.stateA.id,
      target: pair.stateB.id,
      strength: this.calculateEntanglementStrength(pair.id),
      correlation: pair.correlation,
      measurements: pair.measurements,
    }));
    
    return { nodes, edges };
  }
  
  static simulateQuantumDecoherence(): void {
    const now = Date.now();
    
    // Decohere old quantum states
    for (const [stateId, state] of quantumStates.entries()) {
      const age = now - state.created;
      const coherenceTime = 30000; // 30 seconds base coherence
      
      if (age > coherenceTime && state.spin === 'superposition') {
        // Random collapse due to environmental decoherence
        if (Math.random() < 0.1) { // 10% chance per cycle
          state.spin = Math.random() < 0.5 ? 'up' : 'down';
          state.amplitude = Math.random() * 0.3 + 0.7; // Partial coherence
          console.log(`Quantum decoherence: ${stateId} collapsed to ${state.spin}`);
        }
      }
    }
    
    // Clean up old Bell pairs
    for (const [pairId, pair] of bellPairs.entries()) {
      const strength = this.calculateEntanglementStrength(pairId);
      if (strength < 0.1) {
        // Entanglement broken
        const stateA = quantumStates.get(pair.stateA.id);
        const stateB = quantumStates.get(pair.stateB.id);
        
        if (stateA) {
          stateA.entangled = false;
          stateA.partnerId = undefined;
        }
        if (stateB) {
          stateB.entangled = false;
          stateB.partnerId = undefined;
        }
        
        bellPairs.delete(pairId);
        console.log(`Bell pair decoherence: ${pairId} broken`);
      }
    }
  }
}

// Run quantum decoherence simulation periodically
setInterval(() => {
  QuantumSimulator.simulateQuantumDecoherence();
}, 10000); // Every 10 seconds

// Input validation schemas
const createEntanglementSchema = z.object({
  nodeA: z.string(),
  nodeB: z.string(),
});

const measureQuantumSchema = z.object({
  stateId: z.string(),
  observer: z.string(),
});

// Quantum procedures
export const createEntanglementProcedure = publicProcedure
  .input(createEntanglementSchema)
  .mutation(async ({ input }) => {
    console.log('Creating quantum entanglement:', input.nodeA, '<->', input.nodeB);
    
    try {
      // Check if nodes already have quantum states
      const existingStates = Array.from(quantumStates.values()).filter(
        state => state.nodeId === input.nodeA || state.nodeId === input.nodeB
      );
      
      // Limit entanglements per node
      const nodeAEntanglements = existingStates.filter(s => s.nodeId === input.nodeA && s.entangled).length;
      const nodeBEntanglements = existingStates.filter(s => s.nodeId === input.nodeB && s.entangled).length;
      
      if (nodeAEntanglements >= 3 || nodeBEntanglements >= 3) {
        return {
          success: false,
          error: 'Maximum entanglements per node reached',
        };
      }
      
      const bellPair = QuantumSimulator.createBellPair(input.nodeA, input.nodeB);
      
      return {
        success: true,
        bellPairId: bellPair.id,
        stateA: {
          id: bellPair.stateA.id,
          nodeId: bellPair.stateA.nodeId,
          spin: bellPair.stateA.spin,
          entangled: bellPair.stateA.entangled,
        },
        stateB: {
          id: bellPair.stateB.id,
          nodeId: bellPair.stateB.nodeId,
          spin: bellPair.stateB.spin,
          entangled: bellPair.stateB.entangled,
        },
        correlation: bellPair.correlation,
      };
    } catch (error) {
      console.error('Quantum entanglement error:', error);
      return {
        success: false,
        error: 'Failed to create quantum entanglement',
      };
    }
  });

export const measureQuantumStateProcedure = publicProcedure
  .input(measureQuantumSchema)
  .mutation(async ({ input }) => {
    console.log('Measuring quantum state:', input.stateId, 'by', input.observer);
    
    try {
      const measurement = QuantumSimulator.measureQuantumState(input.stateId, input.observer);
      const state = quantumStates.get(input.stateId);
      
      if (!state) {
        return {
          success: false,
          error: 'Quantum state not found',
        };
      }
      
      // Check for partner measurement (entanglement effect)
      let partnerMeasurement = null;
      if (state.partnerId) {
        const partner = quantumStates.get(state.partnerId);
        if (partner && partner.measurementHistory.length > 0) {
          const lastMeasurement = partner.measurementHistory[partner.measurementHistory.length - 1];
          if (lastMeasurement.timestamp === measurement.timestamp) {
            partnerMeasurement = {
              stateId: partner.id,
              nodeId: partner.nodeId,
              result: lastMeasurement.result,
              probability: lastMeasurement.probability,
            };
          }
        }
      }
      
      return {
        success: true,
        measurement: {
          stateId: input.stateId,
          result: measurement.result,
          probability: measurement.probability,
          collapsed: measurement.collapsed,
          timestamp: measurement.timestamp,
        },
        partnerMeasurement,
        quantumNetwork: QuantumSimulator.getQuantumNetworkState(),
      };
    } catch (error) {
      console.error('Quantum measurement error:', error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  });