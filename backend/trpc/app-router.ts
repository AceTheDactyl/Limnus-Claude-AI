import { createTRPCRouter } from "./create-context";
import { default as hiRoute } from "./routes/example/hi/route";
import { sendMessageProcedure, healthCheckProcedure } from "./routes/chat/send-message/route";
import { getConversationsProcedure } from "./routes/chat/get-conversations/route";
import { getMessagesProcedure } from "./routes/chat/get-messages/route";

// Community Consciousness routes
import { 
  getAgentsProcedure, 
  getAgentProcedure, 
  createAgentProcedure, 
  startAgentProcedure, 
  stopAgentProcedure, 
  updateAgentConfigProcedure 
} from "./routes/agents/route";
import { 
  getPatternsProcedure, 
  getPatternProcedure, 
  createPatternProcedure, 
  updatePatternProcedure, 
  getCategoriesProcedure 
} from "./routes/patterns/route";
import { 
  getNodesProcedure, 
  getNodeProcedure, 
  createNodeProcedure, 
  updateNodeStateProcedure, 
  activateNodeProcedure, 
  deactivateNodeProcedure, 
  injectThoughtProcedure, 
  getNodeThoughtsProcedure 
} from "./routes/nodes/route";
import { 
  getDashboardStatsProcedure, 
  getQuickActionsProcedure, 
  getRecentActivityProcedure, 
  getSystemHealthProcedure, 
  getEventStreamProcedure, 
  triggerAlertProcedure 
} from "./routes/dashboard/route";

export const appRouter = createTRPCRouter({
  // Legacy chat routes (keeping for compatibility)
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  chat: createTRPCRouter({
    sendMessage: sendMessageProcedure,
    getConversations: getConversationsProcedure,
    getMessages: getMessagesProcedure,
    health: healthCheckProcedure,
  }),
  
  // Community Consciousness domain routes
  dashboard: createTRPCRouter({
    getStats: getDashboardStatsProcedure,
    getQuickActions: getQuickActionsProcedure,
    getRecentActivity: getRecentActivityProcedure,
    getSystemHealth: getSystemHealthProcedure,
    getEventStream: getEventStreamProcedure,
    triggerAlert: triggerAlertProcedure,
  }),
  
  agents: createTRPCRouter({
    getAll: getAgentsProcedure,
    getById: getAgentProcedure,
    create: createAgentProcedure,
    start: startAgentProcedure,
    stop: stopAgentProcedure,
    updateConfig: updateAgentConfigProcedure,
  }),
  
  patterns: createTRPCRouter({
    getAll: getPatternsProcedure,
    getById: getPatternProcedure,
    create: createPatternProcedure,
    update: updatePatternProcedure,
    getCategories: getCategoriesProcedure,
  }),
  
  nodes: createTRPCRouter({
    getAll: getNodesProcedure,
    getById: getNodeProcedure,
    create: createNodeProcedure,
    updateState: updateNodeStateProcedure,
    activate: activateNodeProcedure,
    deactivate: deactivateNodeProcedure,
    injectThought: injectThoughtProcedure,
    getThoughts: getNodeThoughtsProcedure,
  }),
});

export type AppRouter = typeof appRouter;