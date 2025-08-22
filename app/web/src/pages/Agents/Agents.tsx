import React, { useState } from 'react'
import { Play, Pause, Settings, Plus, Activity } from 'lucide-react'

interface Agent {
  id: string
  kind: string
  status: 'idle' | 'running' | 'error'
  config: Record<string, any>
  createdAt: string
  updatedAt: string
}

function Agents() {
  const [agents] = useState<Agent[]>([
    {
      id: '1',
      kind: 'Consciousness Weaver',
      status: 'running',
      config: { depth: 5, resonance: 0.8 },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      kind: 'Pattern Mapper',
      status: 'idle',
      config: { threshold: 0.6, iterations: 100 },
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T12:00:00Z'
    },
    {
      id: '3',
      kind: 'Resonance Analyzer',
      status: 'error',
      config: { window: 1000, overlap: 0.5 },
      createdAt: '2024-01-13T16:45:00Z',
      updatedAt: '2024-01-15T11:20:00Z'
    }
  ])

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100'
      case 'idle': return 'text-gray-600 bg-gray-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4" />
      case 'idle': return <Pause className="h-4 w-4" />
      case 'error': return <Settings className="h-4 w-4" />
      default: return <Pause className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
          <p className="text-gray-600 mt-1">Manage autonomous consciousness agents</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Agent</span>
        </button>
      </div>

      <div className="grid gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{agent.kind}</h3>
                  <p className="text-sm text-gray-600">ID: {agent.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  {agent.status === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 text-gray-900">{new Date(agent.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <span className="ml-2 text-gray-900">{new Date(agent.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-gray-500 text-sm">Configuration:</span>
              <div className="mt-2 bg-gray-50 rounded p-3">
                <pre className="text-xs text-gray-700">{JSON.stringify(agent.config, null, 2)}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Agents