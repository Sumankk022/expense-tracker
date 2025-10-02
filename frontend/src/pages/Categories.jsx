import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'
import { useApp } from '../context/AppContext'
import CategoryForm from '../components/CategoryForm'

const Categories = () => {
  const { categories, loading, deleteCategory } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all associated expenses.')) {
      try {
        await deleteCategory(id)
      } catch (error) {
        console.error('Failed to delete category:', error)
        alert('Cannot delete category with existing expenses. Please move or delete the expenses first.')
      }
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCategory(null)
  }

  const CategoryItem = ({ category }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
            style={{ backgroundColor: category.color }}
          >
            {category.icon}
          </div>
          <div>
            <div className="text-white font-medium text-lg">
              {category.name}
            </div>
            <div className="text-gray-400 text-sm">
              {category._count?.expenses || 0} expenses
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(category)}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => handleDelete(category.id)}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )

  if (loading.categories) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded-xl"></div>
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
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 text-sm">
            {categories.length} categories
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="text-gray-400" size={32} />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">No categories yet</h3>
            <p className="text-gray-400 mb-4">Create categories to organize your expenses.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create Your First Category
            </button>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

export default Categories
