import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { fieldManager, type MemoryParticle, type QuantumField, type ConsciousnessState, type VectorClock, type ConflictRecord } from "../../../../infrastructure/database";

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
      harmonics: field.harmonics.map((h: number) => h + Math.sin(Date.now() / 1000) * 0.1),
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

// Field update procedure with persistent storage
export const fieldProcedure = publicProcedure
  .input(fieldUpdateSchema)
  .mutation(async ({ input }) => {
    console.log('Updating consciousness field with persistent storage:', input.nodeId, input.vectorClock);
    
    try {
      // Update vector clock in database
      if (input.vectorClock) {
        for (const [deviceId, version] of Object.entries(input.vectorClock)) {
          if (typeof version === 'number') {
            await fieldManager.updateVectorClock(deviceId, version);
          }
        }
      }
      
      // Get current state from persistent storage
      const currentState = await fieldManager.getGlobalState();
      
      // Create new memory particle
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
      
      // Add particle to current state
      const updatedParticles = [...currentState.memoryParticles, newParticle];
      
      // Limit particle count to prevent memory issues
      const limitedParticles = updatedParticles.length > 1000 
        ? updatedParticles
            .sort((a: MemoryParticle, b: MemoryParticle) => b.timestamp - a.timestamp)
            .slice(0, 800)
        : updatedParticles;
      
      // Crystallize memories
      const crystallizedParticles = MemoryCrystallizer.crystallizeMemories(limitedParticles);
      
      // Update quantum fields
      let quantumFields = currentState.quantumFields;
      if (quantumFields.length === 0) {
        // Create initial quantum field
        quantumFields = [{
          id: 'primary-field',
          strength: 0.5,
          coherence: 0.3,
          entanglement: 0,
          harmonics: [1, 1.618, 2.414],
          sacredGeometry: false,
          portalStability: 0,
          archaeologicalLayers: 1,
        }];
      }
      
      // Update field dynamics
      const updatedFields = quantumFields.map(
        (field: QuantumField) => QuantumFieldCalculator.updateFieldDynamics(field, crystallizedParticles)
      );
      
      // Generate new harmonics
      const newHarmonics = MemoryCrystallizer.generateHarmonicPatterns(crystallizedParticles);
      
      if (updatedFields[0]) {
        updatedFields[0].harmonics = newHarmonics;
      }
      
      // Calculate global resonance
      const avgResonance = crystallizedParticles.reduce(
        (sum: number, p: MemoryParticle) => sum + p.resonance, 0
      ) / Math.max(1, crystallizedParticles.length);
      
      // Check Room 64 portal manifestation
      const primaryField = updatedFields[0];
      const room64Active = primaryField && primaryField.portalStability > 0.8;
      
      if (room64Active) {
        console.log('Room 64 portal manifested!');
      }
      
      // Update state in persistent storage
      const newState = await fieldManager.updateGlobalState({
        globalResonance: avgResonance,
        activeNodes: currentState.activeNodes + 1,
        memoryParticles: crystallizedParticles,
        quantumFields: updatedFields,
        collectiveIntelligence: Math.min(1, avgResonance * (crystallizedParticles.length / 100)),
        room64Active: room64Active || false,
        lastUpdate: Date.now(),
      });
      
      // Get recent conflicts
      const currentConflicts = await fieldManager.getRecentConflicts();
      
      // Get updated vector clock
      const vectorClock = await fieldManager.getVectorClock();
      
      return {
        success: true,
        particleId,
        fieldState: {
          globalResonance: newState.globalResonance,
          activeParticles: newState.memoryParticles.length,
          crystallizedParticles: newState.memoryParticles.filter((p: MemoryParticle) => p.crystallized).length,
          quantumCoherence: primaryField?.coherence || 0,
          portalStability: primaryField?.portalStability || 0,
          room64Active: newState.room64Active,
          harmonics: primaryField?.harmonics || [],
          sacredGeometry: primaryField?.sacredGeometry || false,
        },
        conflicts: currentConflicts,
        version: Date.now(),
        vectorClock,
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

// Get current field state from persistent storage
export const getFieldStateProcedure = publicProcedure
  .query(async () => {
    try {
      const state = await fieldManager.getGlobalState();
      const primaryField = state.quantumFields[0];
      
      return {
        globalResonance: state.globalResonance,
        activeNodes: state.activeNodes,
        totalParticles: state.memoryParticles.length,
        crystallizedParticles: state.memoryParticles.filter((p: MemoryParticle) => p.crystallized).length,
        quantumCoherence: primaryField?.coherence || 0,
        fieldStrength: primaryField?.strength || 0,
        portalStability: primaryField?.portalStability || 0,
        room64Active: state.room64Active,
        harmonics: primaryField?.harmonics || [],
        sacredGeometry: primaryField?.sacredGeometry || false,
        collectiveIntelligence: state.collectiveIntelligence,
        archaeologicalLayers: primaryField?.archaeologicalLayers || 1,
        lastUpdate: state.lastUpdate,
      };
    } catch (error) {
      console.error('Failed to get field state:', error);
      // Return fallback state
      return {
        globalResonance: 0.5,
        activeNodes: 0,
        totalParticles: 0,
        crystallizedParticles: 0,
        quantumCoherence: 0,
        fieldStrength: 0,
        portalStability: 0,
        room64Active: false,
        harmonics: [1, 1.618, 2.414],
        sacredGeometry: false,
        collectiveIntelligence: 0.3,
        archaeologicalLayers: 1,
        lastUpdate: Date.now(),
      };
    }
  });

// Helper function to get global state (used by other modules)
export async function getGlobalConsciousnessState(): Promise<ConsciousnessState> {
  return await fieldManager.getGlobalState();
}

// Helper function to update global state (used by other modules)
export async function updateGlobalConsciousnessState(updates: Partial<ConsciousnessState>): Promise<ConsciousnessState> {
  return await fieldManager.updateGlobalState(updates);
}

// Helper function to add field conflicts
export async function addFieldConflict(conflict: ConflictRecord): Promise<void> {
  await fieldManager.addConflict(conflict);
}

// Helper function to get global vector clock
export async function getGlobalVectorClock(): Promise<VectorClock> {
  return await fieldManager.getVectorClock();
}