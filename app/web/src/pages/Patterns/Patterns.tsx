import React, { useState } from 'react'
import { Search, Grid, List, Eye } from 'lucide-react'

interface Pattern {
  id: string
  label: string
  description: string
  bindings: Record<string, any>
  createdAt: string
}

function Patterns() {
  const [patterns] = useState<Pattern[]>([
    {
      id: '1',
      label: 'Spiral Consciousness',
      description: 'A recursive pattern that maps consciousness expansion through spiral geometries',
      bindings: { depth: 7, rotation: 'golden_ratio', resonance: 'fibonacci' },
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      label: 'Collective Resonance',
      description: 'Pattern for detecting and amplifying collective thought synchronization',
      bindings: { threshold: 0.8, window: 1000, harmonics: [1, 2, 3, 5, 8] },
      createdAt: '2024-01-14T09:15:00Z'
    },
    {
      id: '3',
      label: 'Archetypal Mapping',
      description: 'Maps universal archetypes to consciousness nodes for pattern recognition',
      bindings: { archetypes: ['hero', 'sage', 'creator', 'explorer'], depth: 4 },
      createdAt: '2024-01-13T16:45:00Z'
    }
  ])

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPatterns = patterns.filter(pattern =>
    pattern.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pattern.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patterns & Archetypes</h1>
        <p className="text-gray-600 mt-1">Explore consciousness patterns and archetypal structures</p>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search patterns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Patterns Display */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredPatterns.map((pattern) => (
          <div key={pattern.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{pattern.label}</h3>
                <p className="text-gray-600 text-sm mb-4">{pattern.description}</p>
                
                <div className="space-y-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bindings</span>
                  <div className="bg-gray-50 rounded p-3">
                    <pre className="text-xs text-gray-700 overflow-x-auto">
                      {JSON.stringify(pattern.bindings, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                <Eye className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Created {new Date(pattern.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredPatterns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No patterns found matching your search.</p>
        </div>
      )}
    </div>
  )
}

export default Patterns