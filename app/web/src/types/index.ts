export interface User {
  id: string
  email: string
  name?: string
  groups: string[]
  sub: string
}

export interface Agent {
  id: string
  kind: string
  config: Record<string, any>
  status: 'idle' | 'running' | 'error'
  createdAt: string
  updatedAt: string
}

export interface Pattern {
  id: string
  label: string
  description: string
  bindings: Record<string, any>
  createdAt: string
}

export interface Node {
  id: string
  patternId: string
  agentIds: string[]
  state: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Thought {
  id: string
  nodeId: string
  author: {
    type: 'agent' | 'user'
    id: string
  }
  payload: Record<string, any>
  timestamp: string
}

export interface ResonanceMetric {
  id: string
  nodeId: string
  key: string
  value: number
  timestamp: string
}