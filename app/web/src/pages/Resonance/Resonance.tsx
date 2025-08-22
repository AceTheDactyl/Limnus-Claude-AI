import React, { useState } from 'react'
import { Upload, BarChart3, Filter, Download } from 'lucide-react'

interface ResonanceMetric {
  id: string
  nodeId: string
  key: string
  value: number
  timestamp: string
}

function Resonance() {
  const [metrics] = useState<ResonanceMetric[]>([
    { id: '1', nodeId: 'node-1', key: 'consciousness_depth', value: 0.75, timestamp: '2024-01-15T14:30:00Z' },
    { id: '2', nodeId: 'node-1', key: 'resonance_frequency', value: 432.5, timestamp: '2024-01-15T14:29:00Z' },
    { id: '3', nodeId: 'node-2', key: 'collective_sync', value: 0.82, timestamp: '2024-01-15T14:28:00Z' },
    { id: '4', nodeId: 'node-2', key: 'harmonic_alignment', value: 0.91, timestamp: '2024-01-15T14:27:00Z' },
    { id: '5', nodeId: 'node-3', key: 'archetypal_resonance', value: 0.68, timestamp: '2024-01-15T14:26:00Z' }
  ])

  const [selectedNode, setSelectedNode] = useState<string>('all')
  const [selectedMetric, setSelectedMetric] = useState<string>('all')

  const uniqueNodes = Array.from(new Set(metrics.map(m => m.nodeId)))
  const uniqueMetrics = Array.from(new Set(metrics.map(m => m.key)))

  const filteredMetrics = metrics.filter(metric => {
    const nodeMatch = selectedNode === 'all' || metric.nodeId === selectedNode
    const metricMatch = selectedMetric === 'all' || metric.key === selectedMetric
    return nodeMatch && metricMatch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resonance Data</h1>
          <p className="text-gray-600 mt-1">Analyze consciousness resonance patterns and metrics</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Upload Data</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Node</label>
              <select
                value={selectedNode}
                onChange={(e) => setSelectedNode(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Nodes</option>
                {uniqueNodes.map(node => (
                  <option key={node} value={node}>{node}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Metrics</option>
                {uniqueMetrics.map(metric => (
                  <option key={metric} value={metric}>{metric.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Resonance Visualization</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <Download className="h-4 w-4" />
          </button>
        </div>
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization will appear here</p>
            <p className="text-sm text-gray-400 mt-1">Showing {filteredMetrics.length} data points</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Metrics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Node</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMetrics.slice(0, 10).map((metric) => (
                <tr key={metric.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {metric.nodeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.key.replace(/_/g, ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof metric.value === 'number' ? metric.value.toFixed(3) : metric.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(metric.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Resonance