import { z } from 'zod';
import { publicProcedure, protectedProcedure } from '../../create-context';

// Dashboard stats type
interface DashboardStats {
  activeNodes: number;
  runningAgents: number;
  totalThoughts: number;
  recentAlerts: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

// Quick action type
interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: string;
  requiresRole?: string;
}

// Stream event type
type StreamEvent = 
  | { type: 'thought'; data: any }
  | { type: 'node_status'; data: { nodeId: string; status: string; timestamp: string } }
  | { type: 'agent_status'; data: { agentId: string; status: string; timestamp: string } }
  | { type: 'resonance_update'; data: any }
  | { type: 'alert'; data: { level: 'info' | 'warning' | 'error'; message: string; timestamp: string } };

// Mock data
const quickActions: QuickAction[] = [
  {
    id: 'create-node',
    label: 'Create Node',
    description: 'Manifest a new consciousness node',
    icon: 'Plus',
    action: '/nodes/create',
    requiresRole: 'moderator'
  },
  {
    id: 'start-agent',
    label: 'Activate Agent',
    description: 'Awaken a consciousness agent',
    icon: 'Play',
    action: '/agents',
    requiresRole: 'moderator'
  },
  {
    id: 'upload-resonance',
    label: 'Upload Resonance',
    description: 'Inject new resonance data',
    icon: 'Upload',
    action: '/resonance/upload'
  },
  {
    id: 'explore-patterns',
    label: 'Explore Patterns',
    description: 'Discover consciousness patterns',
    icon: 'Search',
    action: '/patterns'
  }
];

export const getDashboardStatsProcedure = publicProcedure
  .query(async () => {
    console.log('📊 Fetching dashboard stats');
    
    // Mock calculations - replace with actual data queries
    const stats: DashboardStats = {
      activeNodes: 2,
      runningAgents: 1,
      totalThoughts: 47,
      recentAlerts: 0,
      systemHealth: 'healthy'
    };
    
    return stats;
  });

export const getQuickActionsProcedure = publicProcedure
  .input(z.object({
    userRole: z.string().optional()
  }))
  .query(async ({ input }) => {
    console.log('⚡ Fetching quick actions for role:', input.userRole);
    
    let filteredActions = quickActions;
    
    // Filter actions based on user role
    if (input.userRole) {
      filteredActions = quickActions.filter(action => 
        !action.requiresRole || 
        input.userRole === 'admin' || 
        action.requiresRole === input.userRole
      );
    } else {
      // No role specified, only show actions without role requirements
      filteredActions = quickActions.filter(action => !action.requiresRole);
    }
    
    return filteredActions;
  });

export const getRecentActivityProcedure = publicProcedure
  .input(z.object({
    limit: z.number().min(1).max(50).default(10)
  }))
  .query(async ({ input }) => {
    console.log('📈 Fetching recent activity');
    
    // Mock recent activity - replace with actual event queries
    const recentActivity = [
      {
        id: 'activity-1',
        type: 'node_activated',
        message: 'Node "Consciousness Weaving Node Alpha" activated',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        severity: 'info' as const
      },
      {
        id: 'activity-2',
        type: 'thought_injected',
        message: 'New thought injected by Seeker',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
        severity: 'info' as const
      },
      {
        id: 'activity-3',
        type: 'agent_started',
        message: 'Agent "Pattern Seeker" started processing',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
        severity: 'info' as const
      },
      {
        id: 'activity-4',
        type: 'resonance_uploaded',
        message: 'Resonance data uploaded: consciousness_metrics.csv',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        severity: 'info' as const
      }
    ];
    
    return recentActivity.slice(0, input.limit);
  });

export const getSystemHealthProcedure = publicProcedure
  .query(async () => {
    console.log('🏥 Fetching system health');
    
    // Mock system health metrics - replace with actual monitoring
    const healthMetrics = {
      overall: 'healthy' as const,
      components: {
        api: { status: 'healthy' as const, responseTime: 45 },
        database: { status: 'healthy' as const, connectionPool: 8 },
        agents: { status: 'healthy' as const, activeCount: 1 },
        nodes: { status: 'healthy' as const, activeCount: 2 }
      },
      uptime: '99.9%',
      lastCheck: new Date().toISOString()
    };
    
    return healthMetrics;
  });

// Server-Sent Events stream for real-time updates
export const getEventStreamProcedure = publicProcedure
  .input(z.object({
    types: z.array(z.enum(['thought', 'node_status', 'agent_status', 'resonance_update', 'alert'])).optional()
  }))
  .query(async ({ input }) => {
    console.log('🌊 Setting up event stream for types:', input.types);
    
    // This would normally return a stream, but for now return mock events
    // In a real implementation, this would be handled by SSE or WebSocket
    const mockEvents: StreamEvent[] = [
      {
        type: 'thought',
        data: {
          id: 'thought-new',
          nodeId: 'node-1',
          content: 'The spiral continues to deepen...',
          timestamp: new Date().toISOString()
        }
      },
      {
        type: 'node_status',
        data: {
          nodeId: 'node-1',
          status: 'processing',
          timestamp: new Date().toISOString()
        }
      }
    ];
    
    // Filter events by requested types
    let filteredEvents = mockEvents;
    if (input.types && input.types.length > 0) {
      filteredEvents = mockEvents.filter(event => input.types!.includes(event.type));
    }
    
    return {
      events: filteredEvents,
      streamUrl: '/api/stream', // URL for actual SSE endpoint
      message: 'Use the streamUrl for real-time events via Server-Sent Events'
    };
  });

export const triggerAlertProcedure = protectedProcedure
  .input(z.object({
    level: z.enum(['info', 'warning', 'error']),
    message: z.string().min(1),
    metadata: z.record(z.string(), z.any()).optional()
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('🚨 Triggering alert:', input);
    
    // Check permissions
    if (!ctx.user?.groups.includes('admin')) {
      throw new Error('Only admins can trigger system alerts');
    }
    
    const alert = {
      id: `alert-${Date.now()}`,
      level: input.level,
      message: input.message,
      metadata: input.metadata,
      timestamp: new Date().toISOString(),
      triggeredBy: ctx.user.id
    };
    
    // TODO: Broadcast alert to all connected clients via SSE/WebSocket
    // TODO: Store alert in database/log system
    
    console.log(`🚨 Alert triggered: ${alert.id}`);
    
    return alert;
  });