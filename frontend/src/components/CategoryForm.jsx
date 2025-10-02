import React, { useState, useEffect } from 'react'
import { X, Tag, Palette } from 'lucide-react'
import { useApp } from '../context/AppContext'

const CategoryForm = ({ category, onClose }) => {
  const { createCategory, updateCategory } = useApp()
  const [formData, setFormData] = useState({
    name: '',
    icon: '💰',
    color: '#3B82F6'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const iconOptions = [
    '🛒', '🎮', '🚗', '🛍️', '📄', '🎓', '🏥', '🍕', '☕', '🎬',
    '✈️', '🏠', '💊', '🎵', '📚', '🎯', '🏃', '🎨', '🔧', '💡'
  ]

  const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#FF7675', '#74B9FF', '#A29BFE', '#FD79A8',
    '#FDCB6E', '#6C5CE7', '#00B894', '#E17055', '#81ECEC'
  ]

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon,
        color: category.color
      })
    }
  }, [category])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.icon) {
      newErrors.icon = 'Icon is required'
    }
    
    if (!formData.color) {
      newErrors.color = 'Color is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      if (category) {
        await updateCategory(category.id, formData)
      } else {
        await createCategory(formData)
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to save category:', error)
      if (error.response?.data?.error?.includes('already exists')) {
        setErrors({ name: 'A category with this name already exists' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Category Name
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field w-full pl-10 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter category name"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Icon */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-colors ${
                    formData.icon === icon 
                      ? 'ring-2 ring-blue-500 bg-gray-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            {errors.icon && (
              <p className="text-red-400 text-sm mt-1">{errors.icon}</p>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-12 h-12 rounded-lg transition-colors ${
                    formData.color === color 
                      ? 'ring-2 ring-white' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {errors.color && (
              <p className="text-red-400 text-sm mt-1">{errors.color}</p>
            )}
          </div>

          {/* Preview */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Preview
            </label>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.icon}
                </div>
                <div>
                  <div className="text-white font-medium text-lg">
                    {formData.name || 'Category Name'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Sample expense
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : (category ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryForm
