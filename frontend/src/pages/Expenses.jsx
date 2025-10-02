import React, { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ExpenseForm from '../components/ExpenseForm'

const Expenses = () => {
  const { expenses, categories, loading, deleteExpense } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id)
      } catch (error) {
        console.error('Failed to delete expense:', error)
      }
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  const ExpenseItem = ({ expense }) => (
    <div className="transaction-item">
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
          style={{ backgroundColor: expense.category?.color || '#666' }}
        >
          {expense.category?.icon || '💰'}
        </div>
        <div>
          <div className="text-white font-medium">
            ₹{parseFloat(expense.amount).toFixed(2)}
          </div>
          <div className="text-gray-400 text-sm">
            {expense.title}
          </div>
          {expense.notes && (
            <div className="text-gray-500 text-xs mt-1">
              {expense.notes}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-right">
          <div className="text-gray-400 text-sm">
            {format(new Date(expense.date), 'dd MMM yy')}
          </div>
          <div className="text-gray-500 text-xs">
            {expense.category?.name || 'Uncategorized'}
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => handleEdit(expense)}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(expense.id)}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  if (loading.expenses) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-gray-400 text-sm">
            {expenses.length} transactions
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-red-400" size={20} />
            <span className="text-gray-400 text-sm">Total Spent</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toFixed(2)}
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="w-5 h-5 bg-blue-400 rounded"></div>
            <span className="text-gray-400 text-sm">This Month</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{expenses
              .filter(expense => {
                const expenseDate = new Date(expense.date)
                const now = new Date()
                return expenseDate.getMonth() === now.getMonth() && 
                       expenseDate.getFullYear() === now.getFullYear()
              })
              .reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
              .toFixed(2)}
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="text-gray-400" size={32} />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">No expenses yet</h3>
            <p className="text-gray-400 mb-4">Start tracking your expenses by adding your first transaction.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Add Your First Expense
            </button>
          </div>
        )}
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          categories={categories}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

export default Expenses
