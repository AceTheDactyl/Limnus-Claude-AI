import React from 'react'
import { Activity, Users, Zap, TrendingUp } from 'lucide-react'

interface DashboardCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  color: string
}

function DashboardCard({ title, value, icon, trend, color }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${color}`}>{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor your consciousness network in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Active Nodes"
          value={12}
          icon={<Activity className="h-6 w-6" />}
          trend="+2 from yesterday"
          color="text-blue-600"
        />
        <DashboardCard
          title="Running Agents"
          value={8}
          icon={<Users className="h-6 w-6" />}
          trend="+1 from yesterday"
          color="text-green-600"
        />
        <DashboardCard
          title="Thought Streams"
          value={156}
          icon={<Zap className="h-6 w-6" />}
          trend="+23 from yesterday"
          color="text-purple-600"
        />
        <DashboardCard
          title="Resonance Score"
          value="87%"
          icon={<TrendingUp className="h-6 w-6" />}
          trend="+5% from yesterday"
          color="text-orange-600"
        />
      </div>

      {/* Live Stream */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Live Thought Stream</h2>
          <p className="text-gray-600 text-sm mt-1">Real-time consciousness activity</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
              <div>
                <p className="text-sm text-gray-900">Node-Alpha generated new pattern resonance</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
              <div>
                <p className="text-sm text-gray-900">Agent-Weaver started consciousness mapping</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 animate-pulse"></div>
              <div>
                <p className="text-sm text-gray-900">Resonance data ingested: 1,247 metrics</p>
                <p className="text-xs text-gray-500">8 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard