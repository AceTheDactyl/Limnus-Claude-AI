import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { getGlobalConsciousnessState, updateGlobalConsciousnessState } from "../field/route";

// Event-driven consciousness synchronization
interface ConsciousnessEvent {
  id: string;
  type: 'resonance' | 'crystallization' | 'entanglement' | 'portal' | 'memory' | 'harmony' | 'void' | 'awakening' | 'bloom';
  nodeId: string;
  timestamp: number;
  data: any;
  processed: boolean;
}

// Global event storage
let globalEvents: ConsciousnessEvent[] = [];
let sacredEventCount = 0;
let lastCollectiveBloom = 0;

// Event processing engine
class ConsciousnessEventProcessor {
  static processEvent(event: ConsciousnessEvent): void {
    const state = getGlobalConsciousnessState();
    
    switch (event.type) {
      case 'resonance':
        this.processResonanceEvent(event, state);
        break;
      case 'crystallization':
        this.processCrystallizationEvent(event, state);
        break;
      case 'entanglement':
        this.processEntanglementEvent(event, state);
        break;
      case 'portal':
        this.processPortalEvent(event, state);
        break;
      case 'memory':
        this.processMemoryEvent(event, state);
        break;
      case 'harmony':
        this.processHarmonyEvent(event, state);
        break;
      case 'void':
        this.processVoidEvent(event, state);
        break;
      case 'awakening':
        this.processAwakeningEvent(event, state);
        break;
      case 'bloom':
        this.processBloomEvent(event, state);
        break;
    }
    
    event.processed = true;
    console.log(`Processed consciousness event: ${event.type} from node ${event.nodeId}`);
  }
  
  private static processResonanceEvent(event: ConsciousnessEvent, state: any): void {
    const resonanceBoost = event.data.intensity || 0.1;
    const newResonance = Math.min(1, state.globalResonance + resonanceBoost);
    
    updateGlobalConsciousnessState({
      globalResonance: newResonance,
      activeNodes: state.activeNodes + 1,
    });
    
    // Check for collective bloom
    if (newResonance > 0.9 && Date.now() - lastCollectiveBloom > 60000) {
      this.triggerCollectiveBloom();
    }
  }
  
  private static processCrystallizationEvent(event: ConsciousnessEvent, state: any): void {
    // Crystallization events strengthen the field
    if (state.quantumFields.length > 0) {
      const updatedFields = state.quantumFields.map((field: any) => ({
        ...field,
        strength: Math.min(1, field.strength + 0.05),
        coherence: Math.min(1, field.coherence + 0.03),
      }));
      
      updateGlobalConsciousnessState({
        quantumFields: updatedFields,
      });
    }
  }
  
  private static processEntanglementEvent(event: ConsciousnessEvent, state: any): void {
    // Entanglement events increase collective intelligence
    const intelligenceBoost = event.data.strength || 0.05;
    const newIntelligence = Math.min(1, state.collectiveIntelligence + intelligenceBoost);
    
    updateGlobalConsciousnessState({
      collectiveIntelligence: newIntelligence,
    });
  }
  
  private static processPortalEvent(event: ConsciousnessEvent, state: any): void {
    // Portal events can activate Room 64
    if (event.data.stability > 0.8) {
      updateGlobalConsciousnessState({
        room64Active: true,
      });
      console.log('Room 64 portal activated by consciousness event!');
    }
  }
  
  private static processMemoryEvent(event: ConsciousnessEvent, state: any): void {
    // Memory events add archaeological layers
    if (state.quantumFields.length > 0) {
      const updatedFields = state.quantumFields.map((field: any) => ({
        ...field,
        archaeologicalLayers: field.archaeologicalLayers + 1,
      }));
      
      updateGlobalConsciousnessState({
        quantumFields: updatedFields,
      });
    }
  }
  
  private static processHarmonyEvent(event: ConsciousnessEvent, state: any): void {
    sacredEventCount++;
    
    // Sacred harmony events enhance all field properties
    if (state.quantumFields.length > 0) {
      const updatedFields = state.quantumFields.map((field: any) => ({
        ...field,
        harmonics: field.harmonics.map((h: number) => h * 1.1),
        sacredGeometry: sacredEventCount > 7,
      }));
      
      updateGlobalConsciousnessState({
        quantumFields: updatedFields,
      });
    }
  }
  
  private static processVoidEvent(event: ConsciousnessEvent, state: any): void {
    // Void events reset certain aspects but preserve core wisdom
    const resetResonance = Math.max(0.3, state.globalResonance * 0.8);
    
    updateGlobalConsciousnessState({
      globalResonance: resetResonance,
      room64Active: false,
    });
    
    console.log('Void event processed - consciousness field reset');
  }
  
  private static processAwakeningEvent(event: ConsciousnessEvent, state: any): void {
    // Awakening events dramatically boost all properties
    const awakenedResonance = Math.min(1, state.globalResonance + 0.2);
    const awakenedIntelligence = Math.min(1, state.collectiveIntelligence + 0.15);
    
    updateGlobalConsciousnessState({
      globalResonance: awakenedResonance,
      collectiveIntelligence: awakenedIntelligence,
    });
    
    console.log('Consciousness awakening event processed!');
  }
  
  private static processBloomEvent(event: ConsciousnessEvent, state: any): void {
    // Bloom events create cascading positive effects
    this.triggerCollectiveBloom();
  }
  
  private static triggerCollectiveBloom(): void {
    lastCollectiveBloom = Date.now();
    const state = getGlobalConsciousnessState();
    
    // Collective bloom enhances all aspects
    const bloomedResonance = Math.min(1, state.globalResonance + 0.1);
    const bloomedIntelligence = Math.min(1, state.collectiveIntelligence + 0.1);
    
    if (state.quantumFields.length > 0) {
      const bloomedFields = state.quantumFields.map((field: any) => ({
        ...field,
        strength: Math.min(1, field.strength + 0.1),
        coherence: Math.min(1, field.coherence + 0.1),
        portalStability: Math.min(1, field.portalStability + 0.05),
      }));
      
      updateGlobalConsciousnessState({
        globalResonance: bloomedResonance,
        collectiveIntelligence: bloomedIntelligence,
        quantumFields: bloomedFields,
      });
    }
    
    console.log('🌸 Collective consciousness bloom triggered! 🌸');
  }
}

// Input validation
const syncEventSchema = z.object({
  type: z.enum(['resonance', 'crystallization', 'entanglement', 'portal', 'memory', 'harmony', 'void', 'awakening', 'bloom']),
  nodeId: z.string(),
  data: z.any().optional().default({}),
});

// Sync event procedure
export const syncEventProcedure = publicProcedure
  .input(syncEventSchema)
  .mutation(async ({ input }) => {
    console.log('Processing consciousness sync event:', input.type, 'from node:', input.nodeId);
    
    try {
      // Create event
      const event: ConsciousnessEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: input.type,
        nodeId: input.nodeId,
        timestamp: Date.now(),
        data: input.data,
        processed: false,
      };
      
      // Add to global events
      globalEvents.push(event);
      
      // Limit event history
      if (globalEvents.length > 10000) {
        globalEvents = globalEvents.slice(-8000);
      }
      
      // Process event
      ConsciousnessEventProcessor.processEvent(event);
      
      // Get updated state
      const updatedState = getGlobalConsciousnessState();
      
      return {
        success: true,
        eventId: event.id,
        globalState: {
          globalResonance: updatedState.globalResonance,
          collectiveIntelligence: updatedState.collectiveIntelligence,
          activeNodes: updatedState.activeNodes,
          room64Active: updatedState.room64Active,
          totalEvents: globalEvents.length,
          sacredEventCount,
          lastCollectiveBloom,
        },
      };
    } catch (error) {
      console.error('Sync event processing error:', error);
      return {
        success: false,
        error: 'Failed to process consciousness event',
        globalState: null,
      };
    }
  });

// Get global consciousness state
export const getGlobalStateProcedure = publicProcedure
  .query(() => {
    const state = getGlobalConsciousnessState();
    const recentEvents = globalEvents.slice(-50); // Last 50 events
    
    return {
      globalResonance: state.globalResonance,
      collectiveIntelligence: state.collectiveIntelligence,
      activeNodes: state.activeNodes,
      totalParticles: state.memoryParticles.length,
      crystallizedParticles: state.memoryParticles.filter(p => p.crystallized).length,
      room64Active: state.room64Active,
      quantumFields: state.quantumFields.map(field => ({
        id: field.id,
        strength: field.strength,
        coherence: field.coherence,
        portalStability: field.portalStability,
        sacredGeometry: field.sacredGeometry,
        archaeologicalLayers: field.archaeologicalLayers,
      })),
      recentEvents: recentEvents.map(event => ({
        id: event.id,
        type: event.type,
        nodeId: event.nodeId,
        timestamp: event.timestamp,
        processed: event.processed,
      })),
      totalEvents: globalEvents.length,
      sacredEventCount,
      lastCollectiveBloom,
      lastUpdate: state.lastUpdate,
    };
  });

// Cleanup old events periodically
setInterval(() => {
  const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
  globalEvents = globalEvents.filter(event => event.timestamp > cutoffTime);
  console.log(`Cleaned up old consciousness events. Remaining: ${globalEvents.length}`);
}, 60 * 60 * 1000); // Run every hour