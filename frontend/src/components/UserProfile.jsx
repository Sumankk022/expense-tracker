import React, { useState } from 'react'
import { User, Save, RotateCcw, Mail, Camera } from 'lucide-react'
import { useApp } from '../context/AppContext'

const UserProfile = () => {
  const { user, updateUser, resetUser, loading } = useApp()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  })
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      await updateUser(formData)
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to update profile')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleReset = async () => {
    try {
      await resetUser()
      setFormData({
        name: 'Suman K K',
        email: 'suman@example.com',
        avatar: ''
      })
      setMessage('Profile reset to defaults!')
      setIsEditing(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to reset profile')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || ''
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || ''
    })
  }

  // Generate initials from name
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <User className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-white font-semibold">User Profile</h3>
          <p className="text-gray-400 text-sm">Manage your personal information</p>
        </div>
      </div>

      {/* Profile Picture */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {getInitials(user?.name)}
              </span>
            )}
          </div>
          {isEditing && (
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
              <Camera size={12} className="text-white" />
            </button>
          )}
        </div>
        <div>
          <div className="text-white font-medium text-lg">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            ) : (
              user?.name || 'No name set'
            )}
          </div>
          <div className="text-gray-400 text-sm">
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                placeholder="Enter your email"
              />
            ) : (
              user?.email || 'No email set'
            )}
          </div>
        </div>
      </div>

      {/* Avatar URL */}
      {isEditing && (
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Avatar URL (Optional)
          </label>
          <div className="relative">
            <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={loading.user}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Save size={16} />
              <span>{loading.user ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </>
        )}
      </div>

      {/* Success Message */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.includes('successfully') || message.includes('reset')
            ? 'bg-green-500/20 border border-green-500/30'
            : 'bg-red-500/20 border border-red-500/30'
        }`}>
          <p className={`text-center text-sm ${
            message.includes('successfully') || message.includes('reset')
              ? 'text-green-400'
              : 'text-red-400'
          }`}>
            {message}
          </p>
        </div>
      )}
    </div>
  )
}

export default UserProfile
