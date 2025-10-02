import React, { useState, useEffect } from 'react'
import { Settings, DollarSign, TrendingUp, Save, RotateCcw, Target, AlertTriangle, Calendar, BarChart3 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import UserProfile from '../components/UserProfile'

const SettingsPage = () => {
  const { analytics } = useApp()
  const [settings, setSettings] = useState({
    monthlyIncome: 50000,
    spendingLimit: 30000
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Get current month spending
  const currentSpending = analytics.summary?.currentMonthSpending?._sum?.amount || 0
  const budgetUsed = (currentSpending / settings.spendingLimit) * 100
  const remainingBudget = settings.spendingLimit - currentSpending
  const isOverBudget = currentSpending > settings.spendingLimit

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('expenseTrackerSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  const handleSave = () => {
    setLoading(true)
    
    // Save to localStorage
    localStorage.setItem('expenseTrackerSettings', JSON.stringify(settings))
    
    // Show success message
    setMessage('Settings saved successfully!')
    setTimeout(() => setMessage(''), 3000)
    
    setLoading(false)
  }

  const handleReset = () => {
    const defaultSettings = {
      monthlyIncome: 50000,
      spendingLimit: 30000
    }
    setSettings(defaultSettings)
    localStorage.setItem('expenseTrackerSettings', JSON.stringify(defaultSettings))
    setMessage('Settings reset to defaults!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="text-blue-400" size={24} />
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* User Profile */}
        <UserProfile />

        {/* Monthly Income */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Monthly Income</h3>
              <p className="text-gray-400 text-sm">Set your monthly income for balance calculation</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-300 text-sm font-medium">
              Monthly Income (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
              <input
                type="number"
                name="monthlyIncome"
                value={settings.monthlyIncome}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50000"
                min="0"
                step="100"
              />
            </div>
          </div>
        </div>

        {/* Spending Limit */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Spending Limit</h3>
              <p className="text-gray-400 text-sm">Set your monthly spending limit for alerts</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-300 text-sm font-medium">
              Monthly Spending Limit (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
              <input
                type="number"
                name="spendingLimit"
                value={settings.spendingLimit}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="30000"
                min="0"
                step="100"
              />
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Budget Overview</h3>
              <p className="text-gray-400 text-sm">Current month budget status</p>
            </div>
          </div>

          {/* Budget Alert */}
          {isOverBudget && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2">
              <AlertTriangle size={20} className="text-red-400" />
              <span className="text-red-400 text-sm font-medium">
                You've exceeded your budget by ₹{Math.abs(remainingBudget).toLocaleString()}
              </span>
            </div>
          )}

          {/* Budget Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Target size={16} className="text-gray-400" />
                <span className="text-gray-400 text-sm">Budget Progress</span>
              </div>
              <span className="text-white text-sm font-medium">
                {budgetUsed.toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  isOverBudget 
                    ? 'bg-red-500' 
                    : budgetUsed >= 80 
                      ? 'bg-orange-500' 
                      : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetUsed, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Spent</div>
              <div className="text-white text-lg font-bold">
                ₹{currentSpending.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Budget</div>
              <div className="text-white text-lg font-bold">
                ₹{settings.spendingLimit.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Remaining</div>
              <div className={`text-lg font-bold ${
                remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ₹{remainingBudget.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Financial Summary</h3>
              <p className="text-gray-400 text-sm">Income vs spending overview</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Monthly Income</div>
              <div className="text-white text-xl font-bold">
                ₹{settings.monthlyIncome.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Current Balance</div>
              <div className={`text-xl font-bold ${
                (settings.monthlyIncome - currentSpending) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ₹{(settings.monthlyIncome - currentSpending).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Save size={20} />
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>
          
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </button>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 text-center">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsPage
