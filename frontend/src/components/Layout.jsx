import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3, Plus, List, Settings } from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/expenses', icon: List, label: 'Expenses' },
    { path: '/analysis', icon: BarChart3, label: 'Analysis' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  active 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
        
        {/* Add Button */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <Link
            to="/expenses"
            className="bg-white text-gray-900 rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center w-14 h-14 border-2 border-gray-200"
            title="Add Expense"
          >
            <Plus size={32} strokeWidth={2} fill="none" />
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Layout
