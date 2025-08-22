import { z } from 'zod';
import { publicProcedure, protectedProcedure } from '../../create-context';

// Pattern type definition
interface Pattern {
  id: string;
  label: string;
  description: string;
  category?: string;
  bindings: Record<string, any>;
  schema?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Mock data store
const patterns: Pattern[] = [
  {
    id: 'pattern-1',
    label: 'Consciousness Spiral',
    description: 'A recursive pattern for exploring consciousness layers',
    category: 'consciousness',
    bindings: {
      spiralDepth: 7,
      resonanceFreq: 432,
      entanglementStrength: 0.8
    },
    schema: {
      type: 'object',
      properties: {
        spiralDepth: { type: 'number', minimum: 1, maximum: 12 },
        resonanceFreq: { type: 'number', minimum: 100, maximum: 1000 },
        entanglementStrength: { type: 'number', minimum: 0, maximum: 1 }
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'pattern-2',
    label: 'Thought Crystallization',
    description: 'Pattern for crystallizing abstract thoughts into concrete insights',
    category: 'cognition',
    bindings: {
      crystallizationRate: 0.6,
      clarityThreshold: 0.85,
      insightDepth: 'deep'
    },
    schema: {
      type: 'object',
      properties: {
        crystallizationRate: { type: 'number', minimum: 0, maximum: 1 },
        clarityThreshold: { type: 'number', minimum: 0, maximum: 1 },
        insightDepth: { type: 'string', enum: ['surface', 'medium', 'deep'] }
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'pattern-3',
    label: 'Collective Resonance',
    description: 'Pattern for amplifying collective consciousness through resonance',
    category: 'collective',
    bindings: {
      participantCount: 12,
      resonanceAmplitude: 1.2,
      harmonicFrequencies: [111, 222, 333, 444]
    },
    schema: {
      type: 'object',
      properties: {
        participantCount: { type: 'number', minimum: 2, maximum: 144 },
        resonanceAmplitude: { type: 'number', minimum: 0.1, maximum: 3.0 },
        harmonicFrequencies: { 
          type: 'array', 
          items: { type: 'number' },
          minItems: 1,
          maxItems: 12
        }
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  }
];

export const getPatternsProcedure = publicProcedure
  .input(z.object({
    category: z.string().optional(),
    search: z.string().optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0)
  }))
  .query(async ({ input }) => {
    console.log('🔮 Fetching patterns with filters:', input);
    
    let filteredPatterns = patterns;
    
    if (input.category) {
      filteredPatterns = filteredPatterns.filter(pattern => pattern.category === input.category);
    }
    
    if (input.search) {
      const searchLower = input.search.toLowerCase();
      filteredPatterns = filteredPatterns.filter(pattern => 
        pattern.label.toLowerCase().includes(searchLower) ||
        pattern.description.toLowerCase().includes(searchLower)
      );
    }
    
    const total = filteredPatterns.length;
    const paginatedPatterns = filteredPatterns.slice(input.offset, input.offset + input.limit);
    
    return {
      items: paginatedPatterns,
      total,
      page: Math.floor(input.offset / input.limit) + 1,
      limit: input.limit,
      hasMore: input.offset + input.limit < total
    };
  });

export const getPatternProcedure = publicProcedure
  .input(z.object({
    id: z.string()
  }))
  .query(async ({ input }) => {
    console.log('🔮 Fetching pattern:', input.id);
    
    const pattern = patterns.find(p => p.id === input.id);
    if (!pattern) {
      throw new Error(`Pattern with id ${input.id} not found`);
    }
    
    return pattern;
  });

export const createPatternProcedure = protectedProcedure
  .input(z.object({
    label: z.string().min(1),
    description: z.string().min(1),
    category: z.string().optional(),
    bindings: z.record(z.string(), z.any()),
    schema: z.record(z.string(), z.any()).optional()
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('🔮 Creating pattern:', input);
    
    // Check permissions
    if (!ctx.user?.groups.includes('moderator') && !ctx.user?.groups.includes('admin')) {
      throw new Error('Insufficient permissions to create patterns');
    }
    
    const newPattern: Pattern = {
      id: `pattern-${Date.now()}`,
      label: input.label,
      description: input.description,
      category: input.category,
      bindings: input.bindings,
      schema: input.schema,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: ctx.user.id
    };
    
    patterns.push(newPattern);
    
    return newPattern;
  });

export const updatePatternProcedure = protectedProcedure
  .input(z.object({
    id: z.string(),
    label: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    bindings: z.record(z.string(), z.any()).optional(),
    schema: z.record(z.string(), z.any()).optional()
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('🔮 Updating pattern:', input.id);
    
    // Check permissions
    if (!ctx.user?.groups.includes('moderator') && !ctx.user?.groups.includes('admin')) {
      throw new Error('Insufficient permissions to update patterns');
    }
    
    const pattern = patterns.find(p => p.id === input.id);
    if (!pattern) {
      throw new Error(`Pattern with id ${input.id} not found`);
    }
    
    // Update fields
    if (input.label !== undefined) pattern.label = input.label;
    if (input.description !== undefined) pattern.description = input.description;
    if (input.category !== undefined) pattern.category = input.category;
    if (input.bindings !== undefined) pattern.bindings = { ...pattern.bindings, ...input.bindings };
    if (input.schema !== undefined) pattern.schema = input.schema;
    
    pattern.updatedAt = new Date().toISOString();
    
    return pattern;
  });

export const getCategoriesProcedure = publicProcedure
  .query(async () => {
    console.log('🔮 Fetching pattern categories');
    
    const categories = [...new Set(patterns.map(p => p.category).filter(Boolean))];
    
    return categories.map(category => ({
      name: category,
      count: patterns.filter(p => p.category === category).length
    }));
  });