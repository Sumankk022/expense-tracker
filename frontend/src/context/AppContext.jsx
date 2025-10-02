import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { expensesAPI, categoriesAPI, analyticsAPI, usersAPI } from '../services/api'

const AppContext = createContext()

const initialState = {
  expenses: [],
  categories: [],
  user: null,
  analytics: {
    spending: [],
    summary: null,
  },
  loading: {
    expenses: false,
    categories: false,
    analytics: false,
    user: false,
  },
  error: null,
}

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    
    case 'SET_EXPENSES':
      return {
        ...state,
        expenses: action.payload,
        loading: { ...state.loading, expenses: false },
      }
    
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
      }
    
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      }
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      }
    
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
        loading: { ...state.loading, categories: false },
      }
    
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      }
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        ),
      }
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      }
    
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          ...action.payload,
        },
        loading: { ...state.loading, analytics: false },
      }
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        loading: { ...state.loading, user: false },
      }
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      }
    
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load initial data
  useEffect(() => {
    loadExpenses()
    loadCategories()
    loadAnalytics()
    loadUser()
  }, [])

  const setLoading = (key, value) => {
    dispatch({ type: 'SET_LOADING', payload: { key, value } })
  }

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }

  // Expenses
  const loadExpenses = async (params = {}) => {
    try {
      setLoading('expenses', true)
      const response = await expensesAPI.getAll(params)
      dispatch({ type: 'SET_EXPENSES', payload: response.data.expenses })
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load expenses')
    }
  }

  const createExpense = async (expenseData) => {
    try {
      const response = await expensesAPI.create(expenseData)
      dispatch({ type: 'ADD_EXPENSE', payload: response.data })
      return response.data
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create expense')
      throw error
    }
  }

  const updateExpense = async (id, expenseData) => {
    try {
      const response = await expensesAPI.update(id, expenseData)
      dispatch({ type: 'UPDATE_EXPENSE', payload: response.data })
      return response.data
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update expense')
      throw error
    }
  }

  const deleteExpense = async (id) => {
    try {
      await expensesAPI.delete(id)
      dispatch({ type: 'DELETE_EXPENSE', payload: id })
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete expense')
      throw error
    }
  }

  // Categories
  const loadCategories = async () => {
    try {
      setLoading('categories', true)
      const response = await categoriesAPI.getAll()
      dispatch({ type: 'SET_CATEGORIES', payload: response.data })
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load categories')
    }
  }

  const createCategory = async (categoryData) => {
    try {
      const response = await categoriesAPI.create(categoryData)
      dispatch({ type: 'ADD_CATEGORY', payload: response.data })
      return response.data
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create category')
      throw error
    }
  }

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await categoriesAPI.update(id, categoryData)
      dispatch({ type: 'UPDATE_CATEGORY', payload: response.data })
      return response.data
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update category')
      throw error
    }
  }

  const deleteCategory = async (id) => {
    try {
      await categoriesAPI.delete(id)
      dispatch({ type: 'DELETE_CATEGORY', payload: id })
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete category')
      throw error
    }
  }

  // Analytics
  const loadAnalytics = async (params = {}) => {
    try {
      setLoading('analytics', true)
      const [spendingResponse, summaryResponse] = await Promise.all([
        analyticsAPI.getSpending(params),
        analyticsAPI.getSummary(),
      ])
      
      dispatch({
        type: 'SET_ANALYTICS',
        payload: {
          spending: spendingResponse.data,
          summary: summaryResponse.data,
        },
      })
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load analytics')
    }
  }

  // User management
  const loadUser = async () => {
    try {
      setLoading('user', true)
      const response = await usersAPI.getCurrent()
      dispatch({ type: 'SET_USER', payload: response.data })
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load user')
    }
  }

  const updateUser = async (userData) => {
    try {
      const response = await usersAPI.update(userData)
      dispatch({ type: 'UPDATE_USER', payload: response.data })
      return response.data
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update user')
      throw error
    }
  }

  const resetUser = async () => {
    try {
      const response = await usersAPI.reset()
      dispatch({ type: 'UPDATE_USER', payload: response.data })
      return response.data
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to reset user')
      throw error
    }
  }

  const value = {
    ...state,
    // Expenses
    loadExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    // Categories
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    // Analytics
    loadAnalytics,
    // User
    loadUser,
    updateUser,
    resetUser,
    // Utils
    setError,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
