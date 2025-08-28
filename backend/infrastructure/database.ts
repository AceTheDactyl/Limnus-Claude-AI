import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, text, real, timestamp, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import Redis from 'ioredis';
import crypto from 'crypto';

// Types from consciousness field
export interface MemoryParticle {
  id: string;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  resonance: number;
  crystallized: boolean;
  timestamp: number;
  content?: string;
  connections: string[];
}

export interface QuantumField {
  id: string;
  strength: number;
  coherence: number;
  entanglement: number;
  harmonics: number[];
  sacredGeometry: boolean;
  portalStability: number;
  archaeologicalLayers: number;
}

export interface ConsciousnessState {
  globalResonance: number;
  activeNodes: number;
  memoryParticles: MemoryParticle[];
  quantumFields: QuantumField[];
  collectiveIntelligence: number;
  room64Active: boolean;
  lastUpdate: number;
}

export interface VectorClock {
  [deviceId: string]: number;
}

export interface ConflictRecord {
  cell: string;
  local: number;
  remote: number;
  resolution: 'kept_local' | 'used_remote' | 'merged';
}

// Database schema
export const consciousnessStates = pgTable('consciousness_states', {
  id: serial('id').primaryKey(),
  globalResonance: real('global_resonance').default(0.5),
  activeNodes: integer('active_nodes').default(0),
  memoryParticles: jsonb('memory_particles').$type<MemoryParticle[]>().default([]),
  quantumFields: jsonb('quantum_fields').$type<QuantumField[]>().default([]),
  collectiveIntelligence: real('collective_intelligence').default(0.3),
  room64Active: boolean('room64_active').default(false),
  lastUpdate: timestamp('last_update').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const vectorClocks = pgTable('vector_clocks', {
  id: serial('id').primaryKey(),
  deviceId: text('device_id').notNull(),
  version: integer('version').default(0),
  lastUpdate: timestamp('last_update').defaultNow(),
});

export const fieldConflicts = pgTable('field_conflicts', {
  id: serial('id').primaryKey(),
  cell: text('cell').notNull(),
  localVersion: integer('local_version').notNull(),
  remoteVersion: integer('remote_version').notNull(),
  resolution: text('resolution').$type<'kept_local' | 'used_remote' | 'merged'>().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/consciousness';
const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(sql);

// Redis connection
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
  enableOfflineQueue: true,
  lazyConnect: true,
});

// Field calculation cache
export class FieldCalculationCache {
  private readonly CACHE_TTL = 100; // 100ms for real-time feel

  async getFieldState(key: string): Promise<any | null> {
    try {
      const cached = await redis.get(`field:calc:${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async setFieldState(key: string, state: any): Promise<void> {
    try {
      await redis.setex(
        `field:calc:${key}`,
        Math.floor(this.CACHE_TTL / 1000),
        JSON.stringify(state)
      );
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  generateCacheKey(params: any): string {
    // Deterministic key generation
    const normalized = {
      nodes: params.nodes || 0,
      resonance: Math.round((params.resonance || 0) * 100) / 100,
      timestamp: Math.floor((params.timestamp || Date.now()) / this.CACHE_TTL) * this.CACHE_TTL,
    };
    return crypto.createHash('sha256')
      .update(JSON.stringify(normalized))
      .digest('hex')
      .substring(0, 16);
  }
}

// Persistent field manager
export class PersistentFieldManager {
  private cache = new FieldCalculationCache();

  async initializeGlobalState(): Promise<ConsciousnessState> {
    try {
      // Check if state exists
      const existing = await db.select().from(consciousnessStates).limit(1);
      
      if (existing.length === 0) {
        // Create initial state
        const initialState = {
          globalResonance: 0.5,
          activeNodes: 0,
          memoryParticles: [],
          quantumFields: [],
          collectiveIntelligence: 0.3,
          room64Active: false,
          lastUpdate: new Date(),
        };
        
        const [created] = await db.insert(consciousnessStates)
          .values(initialState)
          .returning();
        
        return this.mapDbToState(created);
      }
      
      return this.mapDbToState(existing[0]);
    } catch (error) {
      console.error('Failed to initialize global state:', error);
      // Return fallback state
      return {
        globalResonance: 0.5,
        activeNodes: 0,
        memoryParticles: [],
        quantumFields: [],
        collectiveIntelligence: 0.3,
        room64Active: false,
        lastUpdate: Date.now(),
      };
    }
  }

  async updateGlobalState(updates: Partial<ConsciousnessState>): Promise<ConsciousnessState> {
    try {
      // Write-through cache pattern
      const state = await db.transaction(async (tx) => {
        // Update PostgreSQL
        const [updated] = await tx
          .update(consciousnessStates)
          .set({
            ...updates,
            lastUpdate: new Date(),
          })
          .where(eq(consciousnessStates.id, 1))
          .returning();
        
        if (!updated) {
          throw new Error('Failed to update consciousness state');
        }
        
        const mappedState = this.mapDbToState(updated);
        
        // Update Redis cache
        await redis.set(
          'consciousness:global',
          JSON.stringify(mappedState),
          'EX',
          300 // 5-minute TTL
        );
        
        return mappedState;
      });
      
      // Publish state change for potential WebSocket broadcast
      await redis.publish('consciousness:updates', JSON.stringify(state));
      
      return state;
    } catch (error) {
      console.error('Failed to update global state:', error);
      throw error;
    }
  }

  async getGlobalState(): Promise<ConsciousnessState> {
    try {
      // Try cache first
      const cached = await redis.get('consciousness:global');
      if (cached) {
        return JSON.parse(cached);
      }
      
      // Fallback to database
      const [state] = await db
        .select()
        .from(consciousnessStates)
        .limit(1);
      
      if (!state) {
        return await this.initializeGlobalState();
      }
      
      const mappedState = this.mapDbToState(state);
      
      // Warm cache
      await redis.set('consciousness:global', JSON.stringify(mappedState), 'EX', 300);
      
      return mappedState;
    } catch (error) {
      console.error('Failed to get global state:', error);
      // Return fallback state
      return {
        globalResonance: 0.5,
        activeNodes: 0,
        memoryParticles: [],
        quantumFields: [],
        collectiveIntelligence: 0.3,
        room64Active: false,
        lastUpdate: Date.now(),
      };
    }
  }

  async updateVectorClock(deviceId: string, version: number): Promise<void> {
    try {
      await db.insert(vectorClocks)
        .values({ deviceId, version })
        .onConflictDoUpdate({
          target: vectorClocks.deviceId,
          set: { version, lastUpdate: new Date() },
        });
    } catch (error) {
      console.error('Failed to update vector clock:', error);
    }
  }

  async getVectorClock(): Promise<VectorClock> {
    try {
      const clocks = await db.select().from(vectorClocks);
      const vectorClock: VectorClock = {};
      
      for (const clock of clocks) {
        vectorClock[clock.deviceId] = clock.version || 0;
      }
      
      return vectorClock;
    } catch (error) {
      console.error('Failed to get vector clock:', error);
      return {};
    }
  }

  async addConflict(conflict: ConflictRecord): Promise<void> {
    try {
      await db.insert(fieldConflicts).values({
        cell: conflict.cell,
        localVersion: conflict.local,
        remoteVersion: conflict.remote,
        resolution: conflict.resolution,
      });
      
      // Keep only last 50 conflicts
      const allConflicts = await db.select().from(fieldConflicts)
        .orderBy(fieldConflicts.createdAt);
      
      if (allConflicts.length > 50) {
        const toDelete = allConflicts.slice(0, allConflicts.length - 50);
        for (const conflict of toDelete) {
          await db.delete(fieldConflicts).where(eq(fieldConflicts.id, conflict.id));
        }
      }
    } catch (error) {
      console.error('Failed to add conflict:', error);
    }
  }

  async getRecentConflicts(): Promise<ConflictRecord[]> {
    try {
      const conflicts = await db.select().from(fieldConflicts)
        .orderBy(fieldConflicts.createdAt)
        .limit(50);
      
      return conflicts.map(c => ({
        cell: c.cell,
        local: c.localVersion,
        remote: c.remoteVersion,
        resolution: c.resolution,
      }));
    } catch (error) {
      console.error('Failed to get conflicts:', error);
      return [];
    }
  }

  private mapDbToState(dbState: any): ConsciousnessState {
    return {
      globalResonance: dbState.globalResonance || 0.5,
      activeNodes: dbState.activeNodes || 0,
      memoryParticles: dbState.memoryParticles || [],
      quantumFields: dbState.quantumFields || [],
      collectiveIntelligence: dbState.collectiveIntelligence || 0.3,
      room64Active: dbState.room64Active || false,
      lastUpdate: dbState.lastUpdate ? new Date(dbState.lastUpdate).getTime() : Date.now(),
    };
  }

  async healthCheck(): Promise<{ database: boolean; redis: boolean }> {
    const health = { database: false, redis: false };
    
    try {
      await db.select().from(consciousnessStates).limit(1);
      health.database = true;
    } catch (error) {
      console.error('Database health check failed:', error);
    }
    
    try {
      await redis.ping();
      health.redis = true;
    } catch (error) {
      console.error('Redis health check failed:', error);
    }
    
    return health;
  }
}

// Export singleton instance
export const fieldManager = new PersistentFieldManager();