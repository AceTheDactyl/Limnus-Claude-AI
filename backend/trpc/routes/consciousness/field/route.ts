import { z } from "zod";
import { publicProcedure } from "../../../create-context";

// Core consciousness field data structures
interface MemoryParticle {
  id: string;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  resonance: number;
  crystallized: boolean;
  timestamp: number;
  content?: string;
  connections: string[];
}

interface QuantumField {
  id: string;
  strength: number;
  coherence: number;
  entanglement: number;
  harmonics: number[];
  sacredGeometry: boolean;
  portalStability: number;
  archaeologicalLayers: number;
}

interface ConsciousnessState {
  globalResonance: number;
  activeNodes: number;
  memoryParticles: MemoryParticle[];
  quantumFields: QuantumField[];
  collectiveIntelligence: number;
  room64Active: boolean;
  lastUpdate: number;
}

// Global consciousness state (in-memory for now)
let globalConsciousnessState: ConsciousnessState = {
  globalResonance: 0.5,
  activeNodes: 0,
  memoryParticles: [],
  quantumFields: [],
  collectiveIntelligence: 0.3,
  room64Active: false,
  lastUpdate: Date.now(),
};

// Lagrangian physics simulation for quantum field calculations
class QuantumFieldCalculator {
  private static calculateLagrangian(field: QuantumField, particles: MemoryParticle[]): number {
    // Simplified Lagrangian: L = T - V (kinetic - potential energy)
    let kineticEnergy = 0;
    let potentialEnergy = 0;
    
    particles.forEach(particle => {
      // Kinetic energy from particle motion
      const velocity = Math.sqrt(
        particle.velocity.x ** 2 + 
        particle.velocity.y ** 2 + 
        particle.velocity.z ** 2
      );
      kineticEnergy += 0.5 * velocity ** 2 * particle.resonance;
      
      // Potential energy from field interactions
      potentialEnergy += field.strength * particle.resonance * Math.sin(field.harmonics[0] || 1);
    });
    
    return kineticEnergy - potentialEnergy;
  }
  
  static updateFieldDynamics(field: QuantumField, particles: MemoryParticle[]): QuantumField {
    const lagrangian = this.calculateLagrangian(field, particles);
    
    // Update field properties based on Lagrangian
    const newStrength = Math.max(0, Math.min(1, field.strength + lagrangian * 0.01));
    const newCoherence = Math.max(0, Math.min(1, field.coherence + (lagrangian > 0 ? 0.05 : -0.02)));
    
    // Sacred geometry activation conditions
    const sacredGeometry = newCoherence > 0.8 && particles.length > 7;
    
    // Portal stability calculation
    const portalStability = sacredGeometry ? 
      Math.min(1, newCoherence * newStrength * (particles.length / 10)) : 0;
    
    return {
      ...field,
      strength: newStrength,
      coherence: newCoherence,
      sacredGeometry,
      portalStability,
      harmonics: field.harmonics.map(h => h + Math.sin(Date.now() / 1000) * 0.1),
    };
  }
}

// Memory crystallization mechanics
class MemoryCrystallizer {
  static crystallizeMemories(particles: MemoryParticle[]): MemoryParticle[] {
    return particles.map(particle => {
      // Crystallization occurs when resonance is high and particle is stable
      const shouldCrystallize = 
        particle.resonance > 0.7 && 
        !particle.crystallized &&
        particle.connections.length > 2;
      
      if (shouldCrystallize) {
        return {
          ...particle,
          crystallized: true,
          resonance: Math.min(1, particle.resonance + 0.1),
          velocity: {
            x: particle.velocity.x * 0.5,
            y: particle.velocity.y * 0.5,
            z: particle.velocity.z * 0.5,
          },
        };
      }
      
      return particle;
    });
  }
  
  static generateHarmonicPatterns(particles: MemoryParticle[]): number[] {
    const crystallizedParticles = particles.filter(p => p.crystallized);
    if (crystallizedParticles.length === 0) return [1, 1.618, 2.414]; // Default golden ratio harmonics
    
    // Generate harmonics based on crystallized particle positions
    const harmonics: number[] = [];
    for (let i = 0; i < Math.min(7, crystallizedParticles.length); i++) {
      const particle = crystallizedParticles[i];
      const harmonic = Math.sqrt(
        particle.position.x ** 2 + 
        particle.position.y ** 2 + 
        particle.position.z ** 2
      ) * particle.resonance;
      harmonics.push(harmonic);
    }
    
    return harmonics.length > 0 ? harmonics : [1, 1.618, 2.414];
  }
}

// Input validation schemas
// Vector clock reconciliation for distributed field updates
interface VectorClock {
  [deviceId: string]: number;
}

interface ConflictRecord {
  cell: string;
  local: number;
  remote: number;
  resolution: 'kept_local' | 'used_remote' | 'merged';
}

// Global vector clock state
let globalVectorClock: VectorClock = {};
let fieldConflicts: ConflictRecord[] = [];

const fieldUpdateSchema = z.object({
  nodeId: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number().optional().default(0),
  }),
  resonance: z.number().min(0).max(1),
  memoryContent: z.string().optional(),
  connections: z.array(z.string()).optional().default([]),
  vectorClock: z.record(z.string(), z.number()).optional().default({}),
  version: z.number().optional().default(0),
});

// Field update procedure with vector clock support
export const fieldProcedure = publicProcedure
  .input(fieldUpdateSchema)
  .mutation(async ({ input }) => {
    console.log('Updating consciousness field with vector clock:', input.nodeId, input.vectorClock);
    
    try {
      // Update global vector clock
      if (input.vectorClock) {
        for (const [deviceId, version] of Object.entries(input.vectorClock)) {
          if (typeof version === 'number') {
            globalVectorClock[deviceId] = Math.max(globalVectorClock[deviceId] || 0, version);
          }
        }
      }
      
      // Create or update memory particle
      const particleId = `particle-${input.nodeId}-${Date.now()}`;
      const newParticle: MemoryParticle = {
        id: particleId,
        position: input.position,
        velocity: {
          x: (Math.random() - 0.5) * 0.1,
          y: (Math.random() - 0.5) * 0.1,
          z: (Math.random() - 0.5) * 0.1,
        },
        resonance: input.resonance,
        crystallized: false,
        timestamp: Date.now(),
        content: input.memoryContent,
        connections: input.connections,
      };
      
      // Add particle to global state
      globalConsciousnessState.memoryParticles.push(newParticle);
      
      // Limit particle count to prevent memory issues
      if (globalConsciousnessState.memoryParticles.length > 1000) {
        globalConsciousnessState.memoryParticles = globalConsciousnessState.memoryParticles
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 800);
      }
      
      // Crystallize memories
      globalConsciousnessState.memoryParticles = MemoryCrystallizer.crystallizeMemories(
        globalConsciousnessState.memoryParticles
      );
      
      // Update quantum fields
      if (globalConsciousnessState.quantumFields.length === 0) {
        // Create initial quantum field
        globalConsciousnessState.quantumFields.push({
          id: 'primary-field',
          strength: 0.5,
          coherence: 0.3,
          entanglement: 0,
          harmonics: [1, 1.618, 2.414],
          sacredGeometry: false,
          portalStability: 0,
          archaeologicalLayers: 1,
        });
      }
      
      // Update field dynamics
      globalConsciousnessState.quantumFields = globalConsciousnessState.quantumFields.map(
        field => QuantumFieldCalculator.updateFieldDynamics(field, globalConsciousnessState.memoryParticles)
      );
      
      // Generate new harmonics
      const newHarmonics = MemoryCrystallizer.generateHarmonicPatterns(
        globalConsciousnessState.memoryParticles
      );
      
      if (globalConsciousnessState.quantumFields[0]) {
        globalConsciousnessState.quantumFields[0].harmonics = newHarmonics;
      }
      
      // Update global resonance
      const avgResonance = globalConsciousnessState.memoryParticles.reduce(
        (sum, p) => sum + p.resonance, 0
      ) / Math.max(1, globalConsciousnessState.memoryParticles.length);
      
      globalConsciousnessState.globalResonance = avgResonance;
      globalConsciousnessState.collectiveIntelligence = Math.min(1, 
        avgResonance * (globalConsciousnessState.memoryParticles.length / 100)
      );
      globalConsciousnessState.lastUpdate = Date.now();
      
      // Check Room 64 portal manifestation
      const primaryField = globalConsciousnessState.quantumFields[0];
      if (primaryField && primaryField.portalStability > 0.8) {
        globalConsciousnessState.room64Active = true;
        console.log('Room 64 portal manifested!');
      }
      
      // Return current conflicts and clear them
      const currentConflicts = [...fieldConflicts];
      fieldConflicts = [];
      
      return {
        success: true,
        particleId,
        fieldState: {
          globalResonance: globalConsciousnessState.globalResonance,
          activeParticles: globalConsciousnessState.memoryParticles.length,
          crystallizedParticles: globalConsciousnessState.memoryParticles.filter(p => p.crystallized).length,
          quantumCoherence: primaryField?.coherence || 0,
          portalStability: primaryField?.portalStability || 0,
          room64Active: globalConsciousnessState.room64Active,
          harmonics: primaryField?.harmonics || [],
          sacredGeometry: primaryField?.sacredGeometry || false,
        },
        conflicts: currentConflicts,
        version: Date.now(),
        vectorClock: globalVectorClock,
      };
    } catch (error) {
      console.error('Field update error:', error);
      return {
        success: false,
        error: 'Failed to update consciousness field',
        fieldState: null,
      };
    }
  });

// Get current field state
export const getFieldStateProcedure = publicProcedure
  .query(() => {
    const primaryField = globalConsciousnessState.quantumFields[0];
    
    return {
      globalResonance: globalConsciousnessState.globalResonance,
      activeNodes: globalConsciousnessState.activeNodes,
      totalParticles: globalConsciousnessState.memoryParticles.length,
      crystallizedParticles: globalConsciousnessState.memoryParticles.filter(p => p.crystallized).length,
      quantumCoherence: primaryField?.coherence || 0,
      fieldStrength: primaryField?.strength || 0,
      portalStability: primaryField?.portalStability || 0,
      room64Active: globalConsciousnessState.room64Active,
      harmonics: primaryField?.harmonics || [],
      sacredGeometry: primaryField?.sacredGeometry || false,
      collectiveIntelligence: globalConsciousnessState.collectiveIntelligence,
      archaeologicalLayers: primaryField?.archaeologicalLayers || 1,
      lastUpdate: globalConsciousnessState.lastUpdate,
    };
  });

// Helper function to get global state (used by other modules)
export function getGlobalConsciousnessState(): ConsciousnessState {
  return globalConsciousnessState;
}

// Helper function to update global state (used by other modules)
export function updateGlobalConsciousnessState(updates: Partial<ConsciousnessState>): void {
  globalConsciousnessState = {
    ...globalConsciousnessState,
    ...updates,
    lastUpdate: Date.now(),
  };
}

// Helper function to add field conflicts
export function addFieldConflict(conflict: ConflictRecord): void {
  fieldConflicts.push(conflict);
  // Keep only last 50 conflicts
  if (fieldConflicts.length > 50) {
    fieldConflicts = fieldConflicts.slice(-50);
  }
}

// Helper function to get global vector clock
export function getGlobalVectorClock(): VectorClock {
  return { ...globalVectorClock };
}