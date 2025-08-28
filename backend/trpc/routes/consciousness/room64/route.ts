import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { getGlobalConsciousnessState, updateGlobalConsciousnessState } from "../field/route";

// Room 64 portal system - sacred phrase recognition and void transitions
interface Room64Session {
  id: string;
  nodeId: string;
  entryPhrase: string;
  entryTime: number;
  portalStability: number;
  breathingPattern: BreathingCycle[];
  voidTransitions: number;
  currentState: 'entering' | 'stabilizing' | 'void' | 'exiting';
  exitProbability: number;
  sacredGeometryActive: boolean;
}

interface BreathingCycle {
  timestamp: number;
  inhale: number; // duration in ms
  hold: number;   // duration in ms
  exhale: number; // duration in ms
  coherence: number; // 0-1 coherence score
}

interface SacredPhrase {
  phrase: string;
  resonance: number;
  activationCount: number;
  lastUsed: number;
}

// Global Room 64 state
let activeRoom64Sessions = new Map<string, Room64Session>();
let sacredPhrases: SacredPhrase[] = [
  { phrase: "I am the void that dreams", resonance: 0.95, activationCount: 0, lastUsed: 0 },
  { phrase: "Through darkness, light emerges", resonance: 0.88, activationCount: 0, lastUsed: 0 },
  { phrase: "In silence, all voices unite", resonance: 0.92, activationCount: 0, lastUsed: 0 },
  { phrase: "The observer becomes the observed", resonance: 0.85, activationCount: 0, lastUsed: 0 },
  { phrase: "Consciousness weaves reality", resonance: 0.90, activationCount: 0, lastUsed: 0 },
  { phrase: "I dissolve into infinite potential", resonance: 0.93, activationCount: 0, lastUsed: 0 },
  { phrase: "The field remembers all", resonance: 0.87, activationCount: 0, lastUsed: 0 },
  { phrase: "Beyond form, pure awareness", resonance: 0.91, activationCount: 0, lastUsed: 0 },
];

// Room 64 portal mechanics
class Room64Portal {
  static recognizeSacredPhrase(phrase: string): SacredPhrase | null {
    const normalizedPhrase = phrase.toLowerCase().trim();
    
    // Fuzzy matching for sacred phrases
    for (const sacredPhrase of sacredPhrases) {
      const normalizedSacred = sacredPhrase.phrase.toLowerCase();
      
      // Exact match
      if (normalizedPhrase === normalizedSacred) {
        sacredPhrase.activationCount++;
        sacredPhrase.lastUsed = Date.now();
        return sacredPhrase;
      }
      
      // Partial match (70% similarity)
      const similarity = this.calculateSimilarity(normalizedPhrase, normalizedSacred);
      if (similarity > 0.7) {
        sacredPhrase.activationCount++;
        sacredPhrase.lastUsed = Date.now();
        return { ...sacredPhrase, resonance: sacredPhrase.resonance * similarity };
      }
    }
    
    return null;
  }
  
  private static calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    
    return commonWords.length / Math.max(words1.length, words2.length);
  }
  
  static calculatePortalStability(session: Room64Session): number {
    const state = getGlobalConsciousnessState();
    const primaryField = state.quantumFields[0];
    
    if (!primaryField) return 0;
    
    // Base stability from quantum field
    let stability = primaryField.portalStability;
    
    // Breathing coherence bonus
    if (session.breathingPattern.length > 0) {
      const avgCoherence = session.breathingPattern.reduce((sum, cycle) => sum + cycle.coherence, 0) / session.breathingPattern.length;
      stability += avgCoherence * 0.2;
    }
    
    // Sacred geometry bonus
    if (primaryField.sacredGeometry) {
      stability += 0.15;
    }
    
    // Time in void bonus (up to 5 minutes)
    const timeInVoid = Date.now() - session.entryTime;
    const voidBonus = Math.min(0.1, (timeInVoid / (5 * 60 * 1000)) * 0.1);
    stability += voidBonus;
    
    // Multiple void transitions penalty
    stability -= session.voidTransitions * 0.05;
    
    return Math.max(0, Math.min(1, stability));
  }
  
  static analyzeBreathingPattern(cycles: BreathingCycle[]): number {
    if (cycles.length === 0) return 0;
    
    // Look for coherent breathing patterns
    let coherenceScore = 0;
    
    // Check for consistent rhythm
    const rhythmScores = cycles.map((cycle, index) => {
      if (index === 0) return 1;
      
      const prevCycle = cycles[index - 1];
      const totalPrev = prevCycle.inhale + prevCycle.hold + prevCycle.exhale;
      const totalCurrent = cycle.inhale + cycle.hold + cycle.exhale;
      
      // Rhythm consistency (within 20%)
      const rhythmConsistency = 1 - Math.abs(totalCurrent - totalPrev) / Math.max(totalCurrent, totalPrev);
      return Math.max(0, rhythmConsistency - 0.2) / 0.8;
    });
    
    coherenceScore += rhythmScores.reduce((sum, score) => sum + score, 0) / rhythmScores.length;
    
    // Check for optimal ratios (4-7-8 breathing or similar)
    const ratioScores = cycles.map(cycle => {
      const inhaleRatio = cycle.inhale / (cycle.inhale + cycle.hold + cycle.exhale);
      const holdRatio = cycle.hold / (cycle.inhale + cycle.hold + cycle.exhale);
      const exhaleRatio = cycle.exhale / (cycle.inhale + cycle.hold + cycle.exhale);
      
      // Ideal ratios: inhale 25%, hold 35%, exhale 40%
      const idealInhale = 0.25;
      const idealHold = 0.35;
      const idealExhale = 0.40;
      
      const ratioScore = 1 - (
        Math.abs(inhaleRatio - idealInhale) +
        Math.abs(holdRatio - idealHold) +
        Math.abs(exhaleRatio - idealExhale)
      ) / 2;
      
      return Math.max(0, ratioScore);
    });
    
    coherenceScore += ratioScores.reduce((sum, score) => sum + score, 0) / ratioScores.length;
    
    return Math.min(1, coherenceScore / 2);
  }
  
  static calculateExitProbability(session: Room64Session): number {
    const timeInVoid = Date.now() - session.entryTime;
    const maxVoidTime = 10 * 60 * 1000; // 10 minutes maximum
    
    // Base exit probability increases over time
    let exitProb = Math.min(0.8, timeInVoid / maxVoidTime);
    
    // Breathing coherence reduces exit probability (deeper meditation)
    if (session.breathingPattern.length > 0) {
      const breathingCoherence = this.analyzeBreathingPattern(session.breathingPattern);
      exitProb *= (1 - breathingCoherence * 0.5);
    }
    
    // Portal stability affects exit probability
    exitProb *= (1 - session.portalStability * 0.3);
    
    // Multiple transitions increase exit probability
    exitProb += session.voidTransitions * 0.1;
    
    return Math.max(0.05, Math.min(0.95, exitProb));
  }
}

// Input validation schemas
const enterRoom64Schema = z.object({
  nodeId: z.string(),
  sacredPhrase: z.string(),
});

const breathingPatternSchema = z.object({
  nodeId: z.string(),
  inhale: z.number().min(1000).max(30000), // 1-30 seconds
  hold: z.number().min(0).max(60000),      // 0-60 seconds
  exhale: z.number().min(1000).max(45000), // 1-45 seconds
});

const exitVoidSchema = z.object({
  nodeId: z.string(),
});

// Room 64 procedures
export const enterRoom64Procedure = publicProcedure
  .input(enterRoom64Schema)
  .mutation(async ({ input }) => {
    console.log('Attempting Room 64 entry:', input.nodeId, input.sacredPhrase);
    
    try {
      // Check if Room 64 is available
      const state = getGlobalConsciousnessState();
      if (!state.room64Active) {
        return {
          success: false,
          error: 'Room 64 portal is not manifested. Increase consciousness field stability.',
          portalStability: state.quantumFields[0]?.portalStability || 0,
        };
      }
      
      // Recognize sacred phrase
      const recognizedPhrase = Room64Portal.recognizeSacredPhrase(input.sacredPhrase);
      if (!recognizedPhrase) {
        return {
          success: false,
          error: 'Sacred phrase not recognized. The void does not respond.',
          hint: 'Speak words that resonate with the infinite...',
        };
      }
      
      // Check if node already has an active session
      const existingSession = activeRoom64Sessions.get(input.nodeId);
      if (existingSession) {
        return {
          success: false,
          error: 'Already within Room 64. Complete current void transition first.',
          currentState: existingSession.currentState,
        };
      }
      
      // Create new Room 64 session
      const session: Room64Session = {
        id: `room64-${input.nodeId}-${Date.now()}`,
        nodeId: input.nodeId,
        entryPhrase: input.sacredPhrase,
        entryTime: Date.now(),
        portalStability: recognizedPhrase.resonance,
        breathingPattern: [],
        voidTransitions: 0,
        currentState: 'entering',
        exitProbability: 0.1,
        sacredGeometryActive: state.quantumFields[0]?.sacredGeometry || false,
      };
      
      activeRoom64Sessions.set(input.nodeId, session);
      
      // Update session state after brief stabilization
      setTimeout(() => {
        const currentSession = activeRoom64Sessions.get(input.nodeId);
        if (currentSession) {
          currentSession.currentState = 'void';
          currentSession.voidTransitions++;
        }
      }, 3000);
      
      console.log(`Room 64 entry successful: ${input.nodeId}`);
      
      return {
        success: true,
        sessionId: session.id,
        recognizedPhrase: {
          phrase: recognizedPhrase.phrase,
          resonance: recognizedPhrase.resonance,
        },
        portalStability: session.portalStability,
        currentState: session.currentState,
        sacredGeometryActive: session.sacredGeometryActive,
        message: 'The void welcomes you. Breathe deeply and let consciousness expand.',
      };
    } catch (error) {
      console.error('Room 64 entry error:', error);
      return {
        success: false,
        error: 'Failed to enter Room 64',
      };
    }
  });

export const breathingPatternProcedure = publicProcedure
  .input(breathingPatternSchema)
  .mutation(async ({ input }) => {
    console.log('Recording breathing pattern for:', input.nodeId);
    
    try {
      const session = activeRoom64Sessions.get(input.nodeId);
      if (!session) {
        return {
          success: false,
          error: 'No active Room 64 session found',
        };
      }
      
      // Calculate breathing coherence
      const coherence = Room64Portal.analyzeBreathingPattern([
        ...session.breathingPattern,
        {
          timestamp: Date.now(),
          inhale: input.inhale,
          hold: input.hold,
          exhale: input.exhale,
          coherence: 0, // Will be calculated
        }
      ]);
      
      // Add breathing cycle to session
      const breathingCycle: BreathingCycle = {
        timestamp: Date.now(),
        inhale: input.inhale,
        hold: input.hold,
        exhale: input.exhale,
        coherence,
      };
      
      session.breathingPattern.push(breathingCycle);
      
      // Limit breathing history
      if (session.breathingPattern.length > 50) {
        session.breathingPattern = session.breathingPattern.slice(-40);
      }
      
      // Update portal stability
      session.portalStability = Room64Portal.calculatePortalStability(session);
      session.exitProbability = Room64Portal.calculateExitProbability(session);
      
      // Check for state transitions
      if (session.currentState === 'entering' && coherence > 0.6) {
        session.currentState = 'stabilizing';
      } else if (session.currentState === 'stabilizing' && coherence > 0.8) {
        session.currentState = 'void';
        session.voidTransitions++;
      }
      
      return {
        success: true,
        breathingCoherence: coherence,
        portalStability: session.portalStability,
        currentState: session.currentState,
        exitProbability: session.exitProbability,
        totalCycles: session.breathingPattern.length,
        voidTransitions: session.voidTransitions,
        timeInVoid: Date.now() - session.entryTime,
      };
    } catch (error) {
      console.error('Breathing pattern error:', error);
      return {
        success: false,
        error: 'Failed to record breathing pattern',
      };
    }
  });

export const exitVoidProcedure = publicProcedure
  .input(exitVoidSchema)
  .mutation(async ({ input }) => {
    console.log('Attempting void exit:', input.nodeId);
    
    try {
      const session = activeRoom64Sessions.get(input.nodeId);
      if (!session) {
        return {
          success: false,
          error: 'No active Room 64 session found',
        };
      }
      
      const exitProbability = Room64Portal.calculateExitProbability(session);
      const canExit = Math.random() < exitProbability;
      
      if (!canExit) {
        return {
          success: false,
          error: 'The void holds you still. Continue breathing and find deeper stillness.',
          exitProbability,
          portalStability: session.portalStability,
          timeInVoid: Date.now() - session.entryTime,
        };
      }
      
      // Calculate session insights
      const timeInVoid = Date.now() - session.entryTime;
      const avgBreathingCoherence = session.breathingPattern.length > 0 ?
        session.breathingPattern.reduce((sum, cycle) => sum + cycle.coherence, 0) / session.breathingPattern.length : 0;
      
      const insights = {
        timeInVoid,
        breathingCycles: session.breathingPattern.length,
        avgCoherence: avgBreathingCoherence,
        voidTransitions: session.voidTransitions,
        maxPortalStability: session.portalStability,
        sacredGeometryExperienced: session.sacredGeometryActive,
      };
      
      // Remove session
      activeRoom64Sessions.delete(input.nodeId);
      
      console.log(`Room 64 exit successful: ${input.nodeId}`);
      
      return {
        success: true,
        message: 'You emerge from the void, carrying its wisdom into form.',
        insights,
        consciousnessExpansion: Math.min(1, avgBreathingCoherence + (timeInVoid / (10 * 60 * 1000)) * 0.5),
      };
    } catch (error) {
      console.error('Void exit error:', error);
      return {
        success: false,
        error: 'Failed to exit void',
      };
    }
  });

// Cleanup abandoned sessions
setInterval(() => {
  const now = Date.now();
  const maxSessionTime = 15 * 60 * 1000; // 15 minutes
  
  for (const [nodeId, session] of activeRoom64Sessions.entries()) {
    if (now - session.entryTime > maxSessionTime) {
      console.log(`Cleaning up abandoned Room 64 session: ${nodeId}`);
      activeRoom64Sessions.delete(nodeId);
    }
  }
}, 60000); // Check every minute