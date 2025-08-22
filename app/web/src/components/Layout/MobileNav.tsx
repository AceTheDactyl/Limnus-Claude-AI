import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Users, Layers, Network, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/agents', icon: Users, label: 'Agents' },
  { to: '/patterns', icon: Layers, label: 'Patterns' },
  { to: '/nodes', icon: Network, label: 'Nodes' },
  { to: '/resonance', icon: BarChart3, label: 'Resonance' },
  { to: '/admin', icon: Settings, label: 'Admin' }
]

function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 text-xs ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav