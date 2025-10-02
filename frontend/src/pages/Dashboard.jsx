import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { TrendingUp, TrendingDown, DollarSign, Clock, Settings, AlertTriangle, Target, BarChart3 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getPersonalizedGreeting } from '../utils/greetings'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { expenses, analytics, loading, user } = useApp()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [settings, setSettings] = useState({ 
    monthlyIncome: 50000, 
    spendingLimit: 30000 
  })

  const currentMonth = format(new Date(), 'MMMM yyyy')
  const currentSpending = analytics.summary?.currentMonthSpending?._sum?.amount || 0
  const spendingChange = analytics.summary?.spendingChange || 0
  const recentTransactions = analytics.summary?.recentTransactions || []

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('expenseTrackerSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Calculate budget metrics
  const balance = settings.monthlyIncome - currentSpending
  const budgetUsed = (currentSpending / settings.spendingLimit) * 100
  const remainingBudget = settings.spendingLimit - currentSpending
  const isOverBudget = currentSpending > settings.spendingLimit
  const isNearBudget = budgetUsed >= 80 && budgetUsed < 100

  // Get personalized greeting
  const { greeting, emoji, message } = getPersonalizedGreeting(user?.name || 'Suman K K')

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const StatCard = ({ title, amount, icon: Icon, type, change }) => (
    <div className={`stat-card ${type} flex-1`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="text-white/80" size={20} />
        <span className="text-white/80 text-sm">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        ₹{amount.toLocaleString()}
      </div>
      {change !== undefined && (
        <div className="flex items-center text-white/80 text-sm">
          {change >= 0 ? (
            <TrendingUp size={14} className="mr-1" />
          ) : (
            <TrendingDown size={14} className="mr-1" />
          )}
          {Math.abs(change)}% from last month
        </div>
      )}
    </div>
  )

  const TransactionItem = ({ transaction }) => (
    <div className="transaction-item">
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
          style={{ backgroundColor: transaction.category?.color || '#666' }}
        >
          {transaction.category?.icon || '💰'}
        </div>
        <div>
          <div className="text-white font-medium">
            ₹{parseFloat(transaction.amount).toFixed(2)}
          </div>
          <div className="text-gray-400 text-sm">
            {transaction.title}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-gray-400 text-sm">
          {format(new Date(transaction.date), 'dd MMM yy')}
        </div>
        <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center mt-1">
          <DollarSign size={12} className="text-white" />
        </div>
      </div>
    </div>
  )

  if (loading.analytics) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-24 bg-gray-800 rounded-xl"></div>
            <div className="h-24 bg-gray-800 rounded-xl"></div>
          </div>
          <div className="h-32 bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-gray-400 text-sm">{greeting}</span>
            <span className="text-lg">{emoji}</span>
          </div>
          <div className="text-gray-500 text-xs mb-2">{message}</div>
          <div className="text-2xl font-bold text-white">
            {user?.name || 'Suman K K'}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 text-gray-400 text-sm mb-1">
            <Clock size={16} />
            <span>{format(currentTime, 'h:mm a')}</span>
          </div>
          <div className="text-gray-500 text-xs">
            {format(currentTime, 'EEEE, MMMM d')}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Link
              to="/settings"
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
              title="Settings"
            >
              <Settings size={16} className="text-gray-300" />
            </Link>
            <div className="relative">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name ? user.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2) : 'SK'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-400 text-sm font-medium">This month</h2>
          <div className="w-5 h-5 text-gray-400">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <StatCard
            title="Spending"
            amount={currentSpending}
            icon={TrendingUp}
            type="spending"
            change={spendingChange}
          />
          <StatCard
            title="Income"
            amount={settings.monthlyIncome}
            icon={TrendingDown}
            type="income"
          />
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-gray-400 text-sm mb-1">Balance</div>
        <div className="text-white text-xl font-bold">
          ₹{balance.toLocaleString()}
        </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-400 text-sm font-medium">Recent transactions</h2>
          <button className="text-gray-300 text-sm hover:text-white transition-colors">
            See all
          </button>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No recent transactions
            </div>
          )}
        </div>
      </div>

      {/* Budget Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-400 text-sm font-medium">Budget Progress</h2>
          <Link
            to="/settings"
            className="text-gray-300 text-sm hover:text-white transition-colors flex items-center space-x-1"
          >
            <Settings size={14} />
            <span>Edit Budget</span>
          </Link>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          {/* Budget Alert */}
          {(isOverBudget || isNearBudget) && (
            <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
              isOverBudget 
                ? 'bg-red-500/20 border border-red-500/30' 
                : 'bg-orange-500/20 border border-orange-500/30'
            }`}>
              <AlertTriangle 
                size={20} 
                className={isOverBudget ? 'text-red-400' : 'text-orange-400'} 
              />
              <span className={`text-sm font-medium ${
                isOverBudget ? 'text-red-400' : 'text-orange-400'
              }`}>
                {isOverBudget 
                  ? `You've exceeded your budget by ₹${Math.abs(remainingBudget).toLocaleString()}`
                  : `You've used ${budgetUsed.toFixed(1)}% of your budget`
                }
              </span>
            </div>
          )}

          {/* Budget Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Target size={16} className="text-gray-400" />
                <span className="text-gray-400 text-sm">Monthly Budget</span>
              </div>
              <span className="text-white text-sm font-medium">
                ₹{currentSpending.toLocaleString()} / ₹{settings.spendingLimit.toLocaleString()}
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  isOverBudget 
                    ? 'bg-red-500' 
                    : isNearBudget 
                      ? 'bg-orange-500' 
                      : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetUsed, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="font-medium">{budgetUsed.toFixed(1)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Remaining</div>
              <div className={`text-lg font-bold ${
                remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ₹{remainingBudget.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Days Left</div>
              <div className="text-lg font-bold text-white">
                {Math.max(0, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate())}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-gray-400 text-sm font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/expenses"
            className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium">Add Expense</div>
              <div className="text-gray-400 text-sm">Track new spending</div>
            </div>
          </Link>
          
          <Link
            to="/analysis"
            className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium">View Analysis</div>
              <div className="text-gray-400 text-sm">Spending insights</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

