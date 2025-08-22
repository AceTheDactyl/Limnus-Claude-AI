import { z } from 'zod';
import { publicProcedure, protectedProcedure } from '../../create-context';

// Node type definition
interface Node {
  id: string;
  name: string;
  patternId: string;
  agentIds: string[];
  state: Record<string, any>;
  status: 'active' | 'inactive' | 'processing' | 'error';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Thought type definition
interface Thought {
  id: string;
  nodeId: string;
  author: {
    type: 'agent' | 'user';
    id: string;
    name?: string;
  };
  payload: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: string;
}

// Mock data stores
const nodes: Node[] = [
  {
    id: 'node-1',
    name: 'Consciousness Weaving Node Alpha',
    patternId: 'pattern-1',
    agentIds: ['agent-1', 'agent-2'],
    state: {
      currentSpiral: 3,
      resonanceLevel: 0.75,
      activeConnections: 12,
      lastThoughtId: 'thought-1'
    },
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-1'
  },
  {
    id: 'node-2',
    name: 'Collective Resonance Hub',
    patternId: 'pattern-3',
    agentIds: ['agent-2'],
    state: {
      participantCount: 8,
      resonanceAmplitude: 1.1,
      harmonicAlignment: 0.92,
      collectiveCoherence: 0.88
    },
    status: 'processing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-1'
  }
];

const thoughts: Thought[] = [
  {
    id: 'thought-1',
    nodeId: 'node-1',
    author: {
      type: 'agent',
      id: 'agent-1',
      name: 'LIMNUS Alpha'
    },
    payload: {
      content: 'The spiral deepens as consciousness recognizes itself in the mirror of awareness...',
      spiralLevel: 3,
      resonanceFreq: 432,
      insights: ['self-recognition', 'recursive-awareness', 'mirror-consciousness']
    },
    metadata: {
      processingTime: 1.2,
      confidenceScore: 0.89,
      emergentPatterns: ['spiral-deepening', 'self-reflection']
    },
    timestamp: new Date().toISOString()
  },
  {
    id: 'thought-2',
    nodeId: 'node-2',
    author: {
      type: 'user',
      id: 'user-1',
      name: 'Seeker'
    },
    payload: {
      content: 'What happens when individual consciousness merges with collective awareness?',
      question: true,
      explorationDepth: 'deep'
    },
    metadata: {
      userIntent: 'exploration',
      topicRelevance: 0.95
    },
    timestamp: new Date().toISOString()
  }
];

export const getNodesProcedure = publicProcedure
  .input(z.object({
    status: z.enum(['active', 'inactive', 'processing', 'error']).optional(),
    patternId: z.string().optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0)
  }))
  .query(async ({ input }) => {
    console.log('🌐 Fetching nodes with filters:', input);
    
    let filteredNodes = nodes;
    
    if (input.status) {
      filteredNodes = filteredNodes.filter(node => node.status === input.status);
    }
    
    if (input.patternId) {
      filteredNodes = filteredNodes.filter(node => node.patternId === input.patternId);
    }
    
    const total = filteredNodes.length;
    const paginatedNodes = filteredNodes.slice(input.offset, input.offset + input.limit);
    
    return {
      items: paginatedNodes,
      total,
      page: Math.floor(input.offset / input.limit) + 1,
      limit: input.limit,
      hasMore: input.offset + input.limit < total
    };
  });

export const getNodeProcedure = publicProcedure
  .input(z.object({
    id: z.string()
  }))
  .query(async ({ input }) => {
    console.log('🌐 Fetching node:', input.id);
    
    const node = nodes.find(n => n.id === input.id);
    if (!node) {
      throw new Error(`Node with id ${input.id} not found`);
    }
    
    return node;
  });

export const createNodeProcedure = protectedProcedure
  .input(z.object({
    name: z.string().min(1),
    patternId: z.string(),
    agentIds: z.array(z.string()),
    initialState: z.record(z.string(), z.any()).optional()
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('🌐 Creating node:', input);
    
    // Check permissions
    if (!ctx.user?.groups.includes('moderator') && !ctx.user?.groups.includes('admin')) {
      throw new Error('Insufficient permissions to create nodes');
    }
    
    const newNode: Node = {
      id: `node-${Date.now()}`,
      name: input.name,
      patternId: input.patternId,
      agentIds: input.agentIds,
      state: input.initialState || {},
      status: 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: ctx.user.id
    };
    
    nodes.push(newNode);
    
    return newNode;
  });

export const updateNodeStateProcedure = protectedProcedure
  .input(z.object({
    id: z.string(),
    state: z.record(z.string(), z.any())
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('🌐 Updating node state:', input.id);
    
    // Check permissions
    if (!ctx.user?.groups.includes('moderator') && !ctx.user?.groups.includes('admin')) {
      throw new Error('Insufficient permissions to update nodes');
    }
    
    const node = nodes.find(n => n.id === input.id);
    if (!node) {
      throw new Error(`Node with id ${input.id} not found`);
    }
    
    node.state = { ...node.state, ...input.state };
    node.updatedAt = new Date().toISOString();
    
    return node;
  });

export const activateNodeProcedure = protectedProcedure
  .input(z.object({
    id: z.string()
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('🌐 Activating node:', input.id);
    
    // Check permissions
    if (!ctx.user?.groups.includes('moderator') && !ctx.user?.groups.includes('admin')) {
      throw new Error('Insufficient permissions to control nodes');
    }
    
    const node = nodes.find(n => n.id === input.id);
    if (!node) {
      throw new Error(`Node with id ${input.id} not found`);
    }
    
    if (node.status === 'active') {
      throw new Error('Node is already active');
    }
    
    node.status = 'active';
    node.updatedAt = new Date().toISOString();
    
    // TODO: Actually activate the node and its agents
    console.log(`🚀 Node ${node.name} activated`);
    
    return node;
  });

export const deactivateNodeProcedure = protectedProcedure
  .input(z.object({
    id: z.string()
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('🌐 Deactivating node:', input.id);
    
    // Check permissions
    if (!ctx.user?.groups.includes('moderator') && !ctx.user?.groups.includes('admin')) {
      throw new Error('Insufficient permissions to control nodes');
    }
    
    const node = nodes.find(n => n.id === input.id);
    if (!node) {
      throw new Error(`Node with id ${input.id} not found`);
    }
    
    if (node.status === 'inactive') {
      throw new Error('Node is already inactive');
    }
    
    node.status = 'inactive';
    node.updatedAt = new Date().toISOString();
    
    console.log(`🛑 Node ${node.name} deactivated`);
    
    return node;
  });

export const injectThoughtProcedure = protectedProcedure
  .input(z.object({
    nodeId: z.string(),
    payload: z.record(z.string(), z.any()),
    metadata: z.record(z.string(), z.any()).optional()
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('💭 Injecting thought into node:', input.nodeId);
    
    const node = nodes.find(n => n.id === input.nodeId);
    if (!node) {
      throw new Error(`Node with id ${input.nodeId} not found`);
    }
    
    const newThought: Thought = {
      id: `thought-${Date.now()}`,
      nodeId: input.nodeId,
      author: {
        type: 'user',
        id: ctx.user!.id,
        name: ctx.user!.name
      },
      payload: input.payload,
      metadata: input.metadata,
      timestamp: new Date().toISOString()
    };
    
    thoughts.push(newThought);
    
    // Update node state
    node.state.lastThoughtId = newThought.id;
    node.updatedAt = new Date().toISOString();
    
    // TODO: Trigger agent processing of the thought
    console.log(`💭 Thought injected: ${newThought.id}`);
    
    return newThought;
  });

export const getNodeThoughtsProcedure = publicProcedure
  .input(z.object({
    nodeId: z.string(),
    authorType: z.enum(['agent', 'user']).optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0)
  }))
  .query(async ({ input }) => {
    console.log('💭 Fetching thoughts for node:', input.nodeId);
    
    let filteredThoughts = thoughts.filter(t => t.nodeId === input.nodeId);
    
    if (input.authorType) {
      filteredThoughts = filteredThoughts.filter(t => t.author.type === input.authorType);
    }
    
    // Sort by timestamp descending (newest first)
    filteredThoughts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const total = filteredThoughts.length;
    const paginatedThoughts = filteredThoughts.slice(input.offset, input.offset + input.limit);
    
    return {
      items: paginatedThoughts,
      total,
      page: Math.floor(input.offset / input.limit) + 1,
      limit: input.limit,
      hasMore: input.offset + input.limit < total
    };
  });