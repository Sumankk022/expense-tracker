import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { ChevronLeft, ChevronRight, BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { format, subMonths, addMonths } from 'date-fns'

const Analysis = () => {
  const { analytics, loadAnalytics } = useApp()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [chartType, setChartType] = useState('pie')
  const [loading, setLoading] = useState(false)

  const spendingData = analytics.spending?.spendingData || []
  const totalSpending = analytics.spending?.totalSpending || 0

  const loadData = async () => {
    setLoading(true)
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    await loadAnalytics({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    })
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [currentDate])

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#FF7675', '#74B9FF', '#A29BFE', '#FD79A8'
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.categoryColor }}
            />
            <span className="text-white font-medium">{data.categoryName}</span>
          </div>
          <div className="text-gray-300 text-sm">
            Amount: <span className="text-white font-medium">${data.totalAmount.toFixed(2)}</span>
          </div>
          <div className="text-gray-300 text-sm">
            Percentage: <span className="text-white font-medium">{data.percentage}%</span>
          </div>
        </div>
      )
    }
    return null
  }

  const PieChartComponent = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={spendingData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ percentage }) => `${percentage}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="totalAmount"
        >
          {spendingData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.categoryColor} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )

  const BarChartComponent = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={spendingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="categoryName" 
          stroke="#9CA3AF"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="totalAmount" radius={[4, 4, 0, 0]}>
          {spendingData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.categoryColor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded mb-6"></div>
          <div className="h-80 bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousMonth}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          <button
            onClick={handleNextMonth}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('pie')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'pie' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <PieChartIcon size={20} />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 size={20} />
          </button>
        </div>
      </div>

      {/* Chart Card */}
      <div className="card mb-6">
        <h2 className="text-white text-lg font-semibold mb-4">Category-wise spending</h2>
        
        {spendingData.length > 0 ? (
          <>
            {chartType === 'pie' ? <PieChartComponent /> : <BarChartComponent />}
            
            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-gray-400 text-sm">Total Spending</div>
                <div className="text-white text-xl font-bold">
                  ₹{totalSpending.toFixed(2)}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-gray-400" size={32} />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">No spending data</h3>
            <p className="text-gray-400">No expenses found for this month.</p>
          </div>
        )}
      </div>

      {/* Category List */}
      {spendingData.length > 0 && (
        <div className="space-y-3">
          {spendingData.map((item, index) => (
            <div key={item.categoryId} className="transaction-item">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: item.categoryColor }}
                >
                  {item.categoryIcon}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {item.categoryName}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {item.transactionCount} transactions
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  ₹{item.totalAmount.toFixed(2)}
                </div>
                <div className="text-gray-400 text-sm">
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Analysis
