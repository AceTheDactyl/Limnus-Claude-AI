import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Bot, 
  Network, 
  Zap, 
  BarChart3, 
  Settings,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Patterns', href: '/patterns', icon: Network },
  { name: 'Nodes', href: '/nodes', icon: Zap },
  { name: 'Resonance', href: '/resonance', icon: BarChart3 },
]

const adminNavigation = [
  { name: 'Admin', href: '/admin', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col h-full bg-secondary border-r border-secondary">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-secondary">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-primary">Community</h1>
          <p className="text-sm text-muted">Consciousness</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? 'bg-primary text-white shadow-glow'
                  : 'text-secondary hover:bg-tertiary hover:text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}

        {/* Admin Section */}
        {user?.groups.includes('admin') && (
          <>
            <div className="pt-4 mt-4 border-t border-secondary">
              <p className="px-3 text-xs font-semibold text-muted uppercase tracking-wider">
                Administration
              </p>
            </div>
            {adminNavigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary text-white shadow-glow'
                      : 'text-secondary hover:bg-tertiary hover:text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-secondary">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-muted truncate">
              {user?.groups.join(', ') || 'member'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}