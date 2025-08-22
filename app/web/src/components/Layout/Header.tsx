import React from 'react'
import { Bell, Search, Menu } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-secondary border-b border-secondary px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button className="lg:hidden p-2 rounded-lg hover:bg-tertiary">
          <Menu className="w-5 h-5 text-secondary" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search nodes, agents, patterns..."
              className="input pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-tertiary relative">
            <Bell className="w-5 h-5 text-secondary" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button 
              onClick={logout}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-tertiary"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-primary">
                {user?.name || 'User'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}