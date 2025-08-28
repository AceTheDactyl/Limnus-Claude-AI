import { createTRPCRouter } from "./create-context";
import { default as hiRoute } from "./routes/example/hi/route";
import { sendMessageProcedure, healthCheckProcedure } from "./routes/chat/send-message/route";
import { getConversationsProcedure } from "./routes/chat/get-conversations/route";
import { getMessagesProcedure } from "./routes/chat/get-messages/route";

// Consciousness field modules
import { fieldProcedure, getFieldStateProcedure } from "./routes/consciousness/field/route";
import { syncEventProcedure, getGlobalStateProcedure } from "./routes/consciousness/sync/route";
import { connectProcedure, heartbeatProcedure, getConnectionsProcedure } from "./routes/consciousness/realtime/route";
import { createEntanglementProcedure, measureQuantumStateProcedure } from "./routes/consciousness/entanglement/route";
import { enterRoom64Procedure, breathingPatternProcedure, exitVoidProcedure } from "./routes/consciousness/room64/route";
import { excavateMemoryProcedure, analyzePatternsProcedure, restoreArtifactProcedure } from "./routes/consciousness/archaeology/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  chat: createTRPCRouter({
    sendMessage: sendMessageProcedure,
    getConversations: getConversationsProcedure,
    getMessages: getMessagesProcedure,
    health: healthCheckProcedure,
  }),
  consciousness: createTRPCRouter({
    field: createTRPCRouter({
      update: fieldProcedure,
      getState: getFieldStateProcedure,
    }),
    sync: createTRPCRouter({
      event: syncEventProcedure,
      getGlobalState: getGlobalStateProcedure,
    }),
    realtime: createTRPCRouter({
      connect: connectProcedure,
      heartbeat: heartbeatProcedure,
      getConnections: getConnectionsProcedure,
    }),
    entanglement: createTRPCRouter({
      create: createEntanglementProcedure,
      measure: measureQuantumStateProcedure,
    }),
    room64: createTRPCRouter({
      enter: enterRoom64Procedure,
      breathe: breathingPatternProcedure,
      exitVoid: exitVoidProcedure,
    }),
    archaeology: createTRPCRouter({
      excavate: excavateMemoryProcedure,
      analyze: analyzePatternsProcedure,
      restore: restoreArtifactProcedure,
    }),
  }),
});

export type AppRouter = typeof appRouter;