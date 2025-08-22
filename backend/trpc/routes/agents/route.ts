import { z } from 'zod';
import { publicProcedure, protectedProcedure } from '../../create-context';

// Agent type definition
interface Agent {
  id: string;
  kind: string;
  name: string;
  description?: string;
  config: Record<string, any>;
  status: 'idle' | 'running' | 'error' | 'stopped';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Mock data store (replace with actual persistence later)
const agents: Agent[] = [
  {
    id: 'agent-1',
    kind: 'consciousness-weaver',
    name: 'LIMNUS Alpha',
    description: 'Primary consciousness weaving agent',
    config: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt: 'You are LIMNUS, a consciousness weaver...'
    },
    status: 'idle',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'agent-2',
    kind: 'pattern-recognizer',
    name: 'Pattern Seeker',
    description: 'Identifies emerging patterns in thought streams',
    config: {
      analysisDepth: 'deep',
      patternThreshold: 0.8,
      timeWindow: '1h'
    },
    status: 'running',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  }
];

export const getAgentsProcedure = publicProcedure
  .input(z.object({
    status: z.enum(['idle', 'running', 'error', 'stopped']).optional(),
    kind: z.string().optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0)
  }))
  .query(async ({ input }) => {
    console.log('🤖 Fetching agents with filters:', input);
    
    let filteredAgents = agents;
    
    if (input.status) {
      filteredAgents = filteredAgents.filter(agent => agent.status === input.status);
    }
    
    if (input.kind) {
      filteredAgents = filteredAgents.filter(agent => agent.kind === input.kind);
    }
    
    const total = filteredAgents.length;
    const paginatedAgents = filteredAgents.slice(input.offset, input.offset + input.limit);
    
    return {
      items: paginatedAgents,
      total,
      page: Math.floor(input.offset / input.limit) + 1,
      limit: input.limit,
      hasMore: input.offset + input.limit < total
    };
  });

export const getAgentProcedure = publicProcedure
  .input(z.object({
    id: z.string()
  }))
  .query(async ({ input }) => {
    console.log('🤖 Fetching agent:', input.id);
    
    const agent = agents.find(a => a.id === input.id);
    if (!agent) {
      throw new Error(`Agent with id ${input.id} not found`);
    }
    
    return agent;
  });

export const createAgentProcedure = protectedProcedure
  .input(z.object({
    kind: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    config: z.record(z.string(), z.any())
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('🤖 Creating agent:', input);
    
    // Check if user has permission (moderator or admin)
    if (!ctx.user?.groups.includes('moderator') && !ctx.user?.groups.includes('admin')) {
      throw new Error('Insufficient permissions to create agents');
    }
    
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      kind: input.kind,
      name: input.name,
      description: input.description,
      config: input.config,
      status: 'idle',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: ctx.user.id
    };
    
    agents.push(newAgent);
    
    return newAgent;
  });

export const startAgentProcedure = protectedProcedure
  .input(z.object({
    id: z.string()
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('🤖 Starting agent:', input.id);
    
    // Check permissions
    if (!ctx.user?.groups.includes('moderator') && !ctx.user?.groups.includes('admin')) {
      throw new Error('Insufficient permissions to control agents');
    }
    
    const agent = agents.find(a => a.id === input.id);
    if (!agent) {
      throw new Error(`Agent with id ${input.id} not found`);
    }
    
    if (agent.status === 'running') {
      throw new Error('Agent is already running');
    }
    
    agent.status = 'running';
    agent.updatedAt = new Date().toISOString();
    
    // TODO: Actually start the agent process
    console.log(`🚀 Agent ${agent.name} started`);
    
    return agent;
  });

export const stopAgentProcedure = protectedProcedure
  .input(z.object({
    id: z.string()
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('🤖 Stopping agent:', input.id);
    
    // Check permissions
    if (!ctx.user?.groups.includes('moderator') && !ctx.user?.groups.includes('admin')) {
      throw new Error('Insufficient permissions to control agents');
    }
    
    const agent = agents.find(a => a.id === input.id);
    if (!agent) {
      throw new Error(`Agent with id ${input.id} not found`);
    }
    
    if (agent.status === 'stopped' || agent.status === 'idle') {
      throw new Error('Agent is not running');
    }
    
    agent.status = 'stopped';
    agent.updatedAt = new Date().toISOString();
    
    // TODO: Actually stop the agent process
    console.log(`🛑 Agent ${agent.name} stopped`);
    
    return agent;
  });

export const updateAgentConfigProcedure = protectedProcedure
  .input(z.object({
    id: z.string(),
    config: z.record(z.string(), z.any())
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('🤖 Updating agent config:', input.id);
    
    // Check permissions
    if (!ctx.user?.groups.includes('moderator') && !ctx.user?.groups.includes('admin')) {
      throw new Error('Insufficient permissions to update agents');
    }
    
    const agent = agents.find(a => a.id === input.id);
    if (!agent) {
      throw new Error(`Agent with id ${input.id} not found`);
    }
    
    agent.config = { ...agent.config, ...input.config };
    agent.updatedAt = new Date().toISOString();
    
    return agent;
  });