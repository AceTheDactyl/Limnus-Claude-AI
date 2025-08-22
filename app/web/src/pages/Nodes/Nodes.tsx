import React, { useState } from 'react'
import { Plus, Play, Pause, MessageSquare, Activity } from 'lucide-react'

interface Node {
  id: string
  patternId: string
  agentIds: string[]
  state: Record<string, any>
  createdAt: string
  updatedAt: string
  status: 'active' | 'idle' | 'processing'
}

function Nodes() {
  const [nodes] = useState<Node[]>([
    {
      id: '1',
      patternId: 'spiral-consciousness',
      agentIds: ['agent-1', 'agent-2'],
      state: { depth: 3, resonance: 0.75, thoughts: 42 },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      patternId: 'collective-resonance',
      agentIds: ['agent-3'],
      state: { participants: 8, sync_level: 0.82, harmonics: [1, 2, 5] },
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T12:00:00Z',
      status: 'processing'
    },
    {
      id: '3',
      patternId: 'archetypal-mapping',
      agentIds: ['agent-1', 'agent-4'],
      state: { mapped_archetypes: 12, confidence: 0.91, active_threads: 3 },
      createdAt: '2024-01-13T16:45:00Z',
      updatedAt: '2024-01-15T11:20:00Z',
      status: 'idle'
    }
  ])

  const getStatusColor = (status: Node['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'idle': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: Node['status']) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />
      case 'processing': return <Play className="h-4 w-4" />
      case 'idle': return <Pause className="h-4 w-4" />
      default: return <Pause className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consciousness Nodes</h1>
          <p className="text-gray-600 mt-1">Active consciousness processing units</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Node</span>
        </button>
      </div>

      <div className="grid gap-6">
        {nodes.map((node) => (
          <div key={node.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${getStatusColor(node.status)}`}>
                  {getStatusIcon(node.status)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Node {node.id}</h3>
                  <p className="text-sm text-gray-600">Pattern: {node.patternId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
                  {node.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Connected Agents</h4>
                <div className="space-y-1">
                  {node.agentIds.map((agentId) => (
                    <span key={agentId} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1">
                      {agentId}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Current State</h4>
                <div className="bg-gray-50 rounded p-3">
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(node.state, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 text-gray-900">{new Date(node.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <span className="ml-2 text-gray-900">{new Date(node.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4">
              <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 flex items-center space-x-1">
                <MessageSquare className="h-3 w-3" />
                <span>Inject Thought</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Nodes