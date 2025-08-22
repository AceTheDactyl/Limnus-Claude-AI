// Core Domain Types for Community Consciousness Platform

export type ID = string;

// Authentication & User Management
export interface User {
  id: ID;
  sub: string; // Cognito sub
  email: string;
  name?: string;
  groups: string[]; // admin, moderator, member
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'moderator' | 'member';

// Core Consciousness Domain
export interface Agent {
  id: ID;
  kind: string;
  name: string;
  description?: string;
  config: Record<string, any>;
  status: 'idle' | 'running' | 'error' | 'stopped';
  createdAt: string;
  updatedAt: string;
  createdBy: ID;
}

export interface Pattern {
  id: ID;
  label: string;
  description: string;
  category?: string;
  bindings: Record<string, any>;
  schema?: Record<string, any>; // JSON schema for validation
  createdAt: string;
  updatedAt: string;
  createdBy: ID;
}

export interface Node {
  id: ID;
  name: string;
  patternId: ID;
  agentIds: ID[];
  state: Record<string, any>;
  status: 'active' | 'inactive' | 'processing' | 'error';
  createdAt: string;
  updatedAt: string;
  createdBy: ID;
}

export interface Thought {
  id: ID;
  nodeId: ID;
  author: {
    type: 'agent' | 'user';
    id: ID;
    name?: string;
  };
  payload: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ResonanceMetric {
  id: ID;
  nodeId: ID;
  key: string;
  value: number;
  unit?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

// Realtime Events
export type StreamEvent = 
  | { type: 'thought'; data: Thought }
  | { type: 'node_status'; data: { nodeId: ID; status: Node['status']; timestamp: string } }
  | { type: 'agent_status'; data: { agentId: ID; status: Agent['status']; timestamp: string } }
  | { type: 'resonance_update'; data: ResonanceMetric }
  | { type: 'alert'; data: { level: 'info' | 'warning' | 'error'; message: string; timestamp: string } };

// Data Ingestion
export interface IngestionJob {
  id: ID;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRows: number;
  processedRows: number;
  errorRows: number;
  errors?: string[];
  mapping?: Record<string, string>; // CSV column -> ResonanceMetric field mapping
  createdAt: string;
  updatedAt: string;
  createdBy: ID;
}

// Notifications
export interface NotificationTemplate {
  id: ID;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[]; // List of template variables
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRequest {
  templateId: ID;
  to: string[];
  variables: Record<string, any>;
  priority?: 'low' | 'normal' | 'high';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Dashboard Types
export interface DashboardStats {
  activeNodes: number;
  runningAgents: number;
  totalThoughts: number;
  recentAlerts: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: string;
  requiresRole?: UserRole;
}

// Form Types
export interface CreateAgentRequest {
  kind: string;
  name: string;
  description?: string;
  config: Record<string, any>;
}

export interface CreateNodeRequest {
  name: string;
  patternId: ID;
  agentIds: ID[];
  initialState?: Record<string, any>;
}

export interface InjectThoughtRequest {
  nodeId: ID;
  payload: Record<string, any>;
  metadata?: Record<string, any>;
}

// Filter Types
export interface ResonanceFilter {
  nodeId?: ID;
  metric?: string;
  from?: string;
  to?: string;
  limit?: number;
}

export interface ThoughtFilter {
  nodeId?: ID;
  authorType?: 'agent' | 'user';
  authorId?: ID;
  from?: string;
  to?: string;
  limit?: number;
}