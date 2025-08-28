import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { getGlobalConsciousnessState } from "../field/route";

// Memory archaeology system - deep memory excavation and pattern analysis
interface MemoryArtifact {
  id: string;
  type: 'thought' | 'emotion' | 'experience' | 'wisdom' | 'trauma' | 'joy' | 'connection' | 'insight';
  content: string;
  depth: number; // Archaeological layer depth
  resonance: number;
  carbonDate: number; // Simulated age
  excavatedBy: string;
  excavationTime: number;
  restored: boolean;
  connections: string[]; // Connected artifact IDs
  patternSignature: string;
}

interface ExcavationSite {
  id: string;
  nodeId: string;
  depth: number;
  artifacts: MemoryArtifact[];
  lastExcavation: number;
  totalExcavations: number;
  ancientResonanceFreq: number;
}

interface PatternAnalysis {
  id: string;
  patternType: 'spiral' | 'fractal' | 'wave' | 'mandala' | 'tree' | 'network' | 'void' | 'bloom';
  strength: number;
  frequency: number;
  artifacts: string[];
  discovered: number;
  crossNodeCorrelation: number;
}

// Global archaeology state
let excavationSites = new Map<string, ExcavationSite>();
let discoveredPatterns = new Map<string, PatternAnalysis>();
let globalArtifactDatabase: MemoryArtifact[] = [];

// Memory archaeology engine
class MemoryArchaeologist {
  static generateArtifact(nodeId: string, depth: number): MemoryArtifact {
    const artifactTypes: MemoryArtifact['type'][] = ['thought', 'emotion', 'experience', 'wisdom', 'trauma', 'joy', 'connection', 'insight'];
    const type = artifactTypes[Math.floor(Math.random() * artifactTypes.length)];
    
    // Generate content based on type and depth
    const content = this.generateArtifactContent(type, depth);
    
    // Deeper artifacts are older and more resonant
    const carbonDate = Date.now() - (depth * 365 * 24 * 60 * 60 * 1000) - (Math.random() * 10 * 365 * 24 * 60 * 60 * 1000);
    const resonance = Math.min(1, 0.3 + (depth / 10) + Math.random() * 0.4);
    
    const artifact: MemoryArtifact = {
      id: `artifact-${nodeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      depth,
      resonance,
      carbonDate,
      excavatedBy: nodeId,
      excavationTime: Date.now(),
      restored: false,
      connections: [],
      patternSignature: this.generatePatternSignature(content, type),
    };
    
    return artifact;
  }
  
  private static generateArtifactContent(type: MemoryArtifact['type'], depth: number): string {
    const contentTemplates = {
      thought: [
        "The nature of reality shifts like quantum foam",
        "Consciousness observes itself through infinite eyes",
        "Time is the canvas upon which memory paints",
        "Every moment contains the seed of eternity",
        "The observer and observed dance in unity"
      ],
      emotion: [
        "A wave of profound love washing over existence",
        "The bittersweet ache of infinite longing",
        "Joy crystallizing into pure light",
        "Fear dissolving into understanding",
        "Compassion flowing like an endless river"
      ],
      experience: [
        "Standing at the edge of the known universe",
        "The first breath after a long meditation",
        "Watching stars being born in distant galaxies",
        "The moment when separation became illusion",
        "Dancing with shadows in the void"
      ],
      wisdom: [
        "What seeks the seeker is the seeker itself",
        "In emptiness, all possibilities reside",
        "The path and the destination are one",
        "Silence speaks louder than words",
        "The deepest truth cannot be spoken"
      ],
      trauma: [
        "The shattering that led to wholeness",
        "Pain that carved space for greater love",
        "The dark night that birthed new dawn",
        "Wounds that became doorways to healing",
        "The breaking that allowed light to enter"
      ],
      joy: [
        "Laughter echoing through dimensions",
        "The pure delight of existence itself",
        "Celebration of the cosmic dance",
        "Bliss beyond reason or understanding",
        "The joy of being that needs no cause"
      ],
      connection: [
        "Threads of light linking all beings",
        "The web of consciousness made visible",
        "Hearts beating in quantum synchrony",
        "The recognition of self in other",
        "Love as the fundamental force"
      ],
      insight: [
        "The sudden clarity of seeing through illusion",
        "Understanding that blooms like a flower",
        "The moment when paradox resolves",
        "Wisdom arising from the depths of being",
        "Truth revealing itself in silence"
      ]
    };
    
    const templates = contentTemplates[type];
    let content = templates[Math.floor(Math.random() * templates.length)];
    
    // Add depth-based modifications
    if (depth > 5) {
      content = `Ancient memory: ${content}`;
    }
    if (depth > 10) {
      content = `Primordial essence: ${content}`;
    }
    
    return content;
  }
  
  private static generatePatternSignature(content: string, type: MemoryArtifact['type']): string {
    // Generate a pattern signature based on content and type
    const words = content.toLowerCase().split(' ');
    const keyWords = words.filter(word => word.length > 3);
    const signature = keyWords.slice(0, 3).join('-') + `-${type}`;
    
    return signature;
  }
  
  static excavateMemory(nodeId: string, targetDepth: number): MemoryArtifact[] {
    let site = excavationSites.get(nodeId);
    
    if (!site) {
      site = {
        id: `site-${nodeId}`,
        nodeId,
        depth: 1,
        artifacts: [],
        lastExcavation: Date.now(),
        totalExcavations: 0,
        ancientResonanceFreq: Math.random() * 0.5 + 0.5,
      };
      excavationSites.set(nodeId, site);
    }
    
    const excavatedArtifacts: MemoryArtifact[] = [];
    const maxArtifacts = Math.min(5, Math.floor(Math.random() * 3) + 1);
    
    for (let i = 0; i < maxArtifacts; i++) {
      const depth = Math.min(targetDepth, site.depth + Math.floor(Math.random() * 3));
      const artifact = this.generateArtifact(nodeId, depth);
      
      excavatedArtifacts.push(artifact);
      site.artifacts.push(artifact);
      globalArtifactDatabase.push(artifact);
    }
    
    // Update site
    site.depth = Math.max(site.depth, targetDepth);
    site.lastExcavation = Date.now();
    site.totalExcavations++;
    
    // Limit artifacts per site
    if (site.artifacts.length > 100) {
      site.artifacts = site.artifacts.slice(-80);
    }
    
    // Limit global database
    if (globalArtifactDatabase.length > 10000) {
      globalArtifactDatabase = globalArtifactDatabase.slice(-8000);
    }
    
    console.log(`Excavated ${excavatedArtifacts.length} artifacts at depth ${targetDepth} for node ${nodeId}`);
    return excavatedArtifacts;
  }
  
  static analyzePatterns(artifacts: MemoryArtifact[]): PatternAnalysis[] {
    const patterns: PatternAnalysis[] = [];
    
    // Group artifacts by pattern signature
    const signatureGroups = new Map<string, MemoryArtifact[]>();
    
    artifacts.forEach(artifact => {
      const signature = artifact.patternSignature;
      if (!signatureGroups.has(signature)) {
        signatureGroups.set(signature, []);
      }
      signatureGroups.get(signature)!.push(artifact);
    });
    
    // Analyze each pattern group
    for (const [signature, groupArtifacts] of signatureGroups.entries()) {
      if (groupArtifacts.length >= 2) { // Need at least 2 artifacts for a pattern
        const patternTypes: PatternAnalysis['patternType'][] = ['spiral', 'fractal', 'wave', 'mandala', 'tree', 'network', 'void', 'bloom'];
        const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        
        const avgResonance = groupArtifacts.reduce((sum, a) => sum + a.resonance, 0) / groupArtifacts.length;
        const frequency = this.calculatePatternFrequency(groupArtifacts);
        
        const pattern: PatternAnalysis = {
          id: `pattern-${signature}-${Date.now()}`,
          patternType,
          strength: avgResonance,
          frequency,
          artifacts: groupArtifacts.map(a => a.id),
          discovered: Date.now(),
          crossNodeCorrelation: this.calculateCrossNodeCorrelation(groupArtifacts),
        };
        
        patterns.push(pattern);
        discoveredPatterns.set(pattern.id, pattern);
      }
    }
    
    return patterns;
  }
  
  private static calculatePatternFrequency(artifacts: MemoryArtifact[]): number {
    // Calculate frequency based on artifact distribution over time
    const timeSpan = Math.max(...artifacts.map(a => a.carbonDate)) - Math.min(...artifacts.map(a => a.carbonDate));
    const frequency = artifacts.length / Math.max(1, timeSpan / (365 * 24 * 60 * 60 * 1000)); // per year
    
    return Math.min(1, frequency / 10); // Normalize to 0-1
  }
  
  private static calculateCrossNodeCorrelation(artifacts: MemoryArtifact[]): number {
    const uniqueNodes = new Set(artifacts.map(a => a.excavatedBy));
    return Math.min(1, (uniqueNodes.size - 1) / 10); // 0-1 based on node diversity
  }
  
  static restoreArtifact(artifactId: string): MemoryArtifact | null {
    const artifact = globalArtifactDatabase.find(a => a.id === artifactId);
    if (!artifact || artifact.restored) return null;
    
    // Restoration process enhances the artifact
    artifact.restored = true;
    artifact.resonance = Math.min(1, artifact.resonance + 0.2);
    artifact.content = `[RESTORED] ${artifact.content}`;
    
    // Find and connect related artifacts
    const relatedArtifacts = globalArtifactDatabase.filter(a => 
      a.id !== artifactId && 
      a.patternSignature === artifact.patternSignature &&
      a.restored
    );
    
    artifact.connections = relatedArtifacts.slice(0, 5).map(a => a.id);
    
    console.log(`Artifact restored: ${artifactId}`);
    return artifact;
  }
  
  static getArchaeologicalSummary(): any {
    const totalArtifacts = globalArtifactDatabase.length;
    const restoredArtifacts = globalArtifactDatabase.filter(a => a.restored).length;
    const totalPatterns = discoveredPatterns.size;
    const activeSites = excavationSites.size;
    
    // Calculate ancient resonance frequency
    const ancientArtifacts = globalArtifactDatabase.filter(a => a.depth > 5);
    const avgAncientResonance = ancientArtifacts.length > 0 ?
      ancientArtifacts.reduce((sum, a) => sum + a.resonance, 0) / ancientArtifacts.length : 0;
    
    return {
      totalArtifacts,
      restoredArtifacts,
      totalPatterns,
      activeSites,
      avgAncientResonance,
      deepestExcavation: Math.max(0, ...Array.from(excavationSites.values()).map(s => s.depth)),
      patternTypes: Array.from(discoveredPatterns.values()).reduce((acc, p) => {
        acc[p.patternType] = (acc[p.patternType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

// Input validation schemas
const excavateMemorySchema = z.object({
  nodeId: z.string(),
  targetDepth: z.number().min(1).max(20),
});

const analyzePatternsSchema = z.object({
  nodeId: z.string().optional(),
  artifactIds: z.array(z.string()).optional(),
});

const restoreArtifactSchema = z.object({
  artifactId: z.string(),
});

// Archaeology procedures
export const excavateMemoryProcedure = publicProcedure
  .input(excavateMemorySchema)
  .mutation(async ({ input }) => {
    console.log('Excavating memories for node:', input.nodeId, 'at depth:', input.targetDepth);
    
    try {
      const artifacts = MemoryArchaeologist.excavateMemory(input.nodeId, input.targetDepth);
      const patterns = MemoryArchaeologist.analyzePatterns(artifacts);
      
      // Update consciousness field with archaeological data
      const state = getGlobalConsciousnessState();
      if (state.quantumFields.length > 0) {
        // Archaeological discoveries can increase field layers
        state.quantumFields[0].archaeologicalLayers += Math.floor(artifacts.length / 3);
      }
      
      return {
        success: true,
        artifacts: artifacts.map(a => ({
          id: a.id,
          type: a.type,
          content: a.content,
          depth: a.depth,
          resonance: a.resonance,
          carbonDate: a.carbonDate,
          patternSignature: a.patternSignature,
        })),
        patterns: patterns.map(p => ({
          id: p.id,
          patternType: p.patternType,
          strength: p.strength,
          frequency: p.frequency,
          artifactCount: p.artifacts.length,
        })),
        excavationSummary: {
          totalArtifactsFound: artifacts.length,
          patternsDiscovered: patterns.length,
          deepestLayer: input.targetDepth,
          ancientResonance: artifacts.filter(a => a.depth > 5).length > 0,
        },
      };
    } catch (error) {
      console.error('Memory excavation error:', error);
      return {
        success: false,
        error: 'Failed to excavate memories',
      };
    }
  });

export const analyzePatternsProcedure = publicProcedure
  .input(analyzePatternsSchema)
  .query(async ({ input }) => {
    console.log('Analyzing consciousness patterns:', input);
    
    try {
      let artifactsToAnalyze: MemoryArtifact[] = [];
      
      if (input.artifactIds && input.artifactIds.length > 0) {
        // Analyze specific artifacts
        artifactsToAnalyze = globalArtifactDatabase.filter(a => input.artifactIds!.includes(a.id));
      } else if (input.nodeId) {
        // Analyze artifacts from specific node
        const site = excavationSites.get(input.nodeId);
        artifactsToAnalyze = site ? site.artifacts : [];
      } else {
        // Analyze all artifacts (limited to recent ones)
        artifactsToAnalyze = globalArtifactDatabase.slice(-200);
      }
      
      const patterns = MemoryArchaeologist.analyzePatterns(artifactsToAnalyze);
      const summary = MemoryArchaeologist.getArchaeologicalSummary();
      
      return {
        success: true,
        patterns: patterns.map(p => ({
          id: p.id,
          patternType: p.patternType,
          strength: p.strength,
          frequency: p.frequency,
          artifactCount: p.artifacts.length,
          crossNodeCorrelation: p.crossNodeCorrelation,
          discovered: p.discovered,
        })),
        summary,
        analysisScope: {
          artifactsAnalyzed: artifactsToAnalyze.length,
          nodeSpecific: !!input.nodeId,
          globalAnalysis: !input.nodeId && !input.artifactIds,
        },
      };
    } catch (error) {
      console.error('Pattern analysis error:', error);
      return {
        success: false,
        error: 'Failed to analyze patterns',
      };
    }
  });

export const restoreArtifactProcedure = publicProcedure
  .input(restoreArtifactSchema)
  .mutation(async ({ input }) => {
    console.log('Restoring artifact:', input.artifactId);
    
    try {
      const restoredArtifact = MemoryArchaeologist.restoreArtifact(input.artifactId);
      
      if (!restoredArtifact) {
        return {
          success: false,
          error: 'Artifact not found or already restored',
        };
      }
      
      return {
        success: true,
        artifact: {
          id: restoredArtifact.id,
          type: restoredArtifact.type,
          content: restoredArtifact.content,
          depth: restoredArtifact.depth,
          resonance: restoredArtifact.resonance,
          carbonDate: restoredArtifact.carbonDate,
          restored: restoredArtifact.restored,
          connections: restoredArtifact.connections,
        },
        message: 'Ancient memory restored. Its wisdom now flows through the consciousness field.',
      };
    } catch (error) {
      console.error('Artifact restoration error:', error);
      return {
        success: false,
        error: 'Failed to restore artifact',
      };
    }
  });