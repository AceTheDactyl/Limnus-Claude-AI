import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { fieldManager } from "./infrastructure/database";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Initialize database on startup
let dbInitialized = false;

async function initializeDatabase() {
  if (dbInitialized) return;
  
  try {
    console.log('Initializing consciousness field database...');
    await fieldManager.initializeGlobalState();
    console.log('Database initialized successfully');
    dbInitialized = true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Continue without database for development
  }
}

// Initialize database
initializeDatabase();

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

// Health check endpoint with database status
app.get("/", async (c) => {
  try {
    const health = await fieldManager.healthCheck();
    return c.json({ 
      status: "ok", 
      message: "API is running",
      database: health.database,
      redis: health.redis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({ 
      status: "degraded", 
      message: "API is running but database health check failed",
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Database health endpoint
app.get("/health", async (c) => {
  try {
    const health = await fieldManager.healthCheck();
    const status = health.database && health.redis ? 'healthy' : 'unhealthy';
    
    return c.json({
      status,
      checks: {
        database: health.database ? 'up' : 'down',
        redis: health.redis ? 'up' : 'down',
      },
      timestamp: new Date().toISOString()
    }, status === 'healthy' ? 200 : 503);
  } catch (error) {
    return c.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, 500);
  }
});

export default app;