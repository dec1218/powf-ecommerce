import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { uploadAvatar, deleteAvatar } from '../lib/uploadHelpers'
import Header from './Header'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { logout, user, updateProfile, refreshUser } = useAuth()
  const fileInputRef = useRef(null)
  const [activeSection, setActiveSection] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar_url: user?.avatar_url || null
  })

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG, GIF, or WebP)')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 5MB.')
      return
    }

    try {
      setUploading(true)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Delete old avatar if exists
      if (profileData.avatar_url) {
        await deleteAvatar(profileData.avatar_url)
      }

      // Upload new avatar
      const avatarUrl = await uploadAvatar(file, user.id)

      // Update profile in database
      await updateProfile({ avatar_url: avatarUrl })

      // Update local state
      setProfileData(prev => ({
        ...prev,
        avatar_url: avatarUrl
      }))

      // Refresh user data
      await refreshUser()

      alert('✅ Avatar updated successfully!')
    } catch (error) {
      console.error('❌ Error uploading avatar:', error)
      alert('Failed to upload avatar: ' + error.message)
      setAvatarPreview(null)
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatar = async () => {
    if (!profileData.avatar_url) return

    if (!window.confirm('Remove your profile picture?')) return

    try {
      setUploading(true)

      // Delete from storage
      await deleteAvatar(profileData.avatar_url)

      // Update database
      await updateProfile({ avatar_url: null })

      // Update local state
      setProfileData(prev => ({
        ...prev,
        avatar_url: null
      }))
      setAvatarPreview(null)

      // Refresh user data
      await refreshUser()

      alert('✅ Avatar removed successfully!')
    } catch (error) {
      console.error('❌ Error removing avatar:', error)
      alert('Failed to remove avatar: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Validate
      if (!profileData.full_name?.trim()) {
        alert('Please enter your full name')
        return
      }

      // Prepare updates (exclude email and avatar_url as they're handled separately)
      const updates = {
        username: profileData.username?.trim() || null,
        full_name: profileData.full_name?.trim(),
        phone: profileData.phone?.trim() || null
      }

      console.log('💾 Saving profile:', updates)

      await updateProfile(updates)

      // Refresh user data
      await refreshUser()

      alert('✅ Profile updated successfully!')
    } catch (error) {
      console.error('❌ Error saving profile:', error)
      alert('Failed to update profile: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      console.log('👋 Logging out from Profile...')
      await logout()
      console.log('✅ Logout successful, redirecting to login...')
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('❌ Logout error:', error)
    }
  }

  const navigationItems = [
    {
      id: 'profile',
      label: 'My Account',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      subItems: ['Addresses', 'Change Password']
    },
    {
      id: 'purchases',
      label: 'My Purchase',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    {
      id: 'logout',
      label: 'Log Out',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"/>
        </svg>
      ),
      action: handleLogout
    }
  ]

  const handleNavigationClick = (item) => {
    if (item.id === 'logout') {
      item.action()
    } else if (item.id === 'purchases') {
      navigate('/order-history')
    } else {
      setActiveSection(item.id)
    }
  }

  const currentAvatar = avatarPreview || profileData.avatar_url

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />
      
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-amber-100 rounded-xl p-6">
                {/* User Profile */}
                <div className="flex flex-col items-center mb-8">
                  {/* Avatar */}
                  <div className="relative group mb-4">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-amber-200 shadow-lg">
                      {currentAvatar ? (
                        <img
                          src={currentAvatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-amber-600">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>

                    {/* Upload overlay */}
                    {!uploading && (
                      <button
                        onClick={handleAvatarClick}
                        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    )}

                    {/* Loading spinner */}
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  {/* Remove Avatar Button */}
                  {currentAvatar && !uploading && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="text-xs text-red-600 hover:text-red-800 mb-2"
                    >
                      Remove Photo
                    </button>
                  )}

                  {/* User Info */}
                  <div className="text-center">
                    <h3 className="font-bold text-amber-900 text-lg">
                      {user?.full_name || user?.username || user?.email?.split('@')[0] || 'User'}
                    </h3>
                    <p className="text-xs text-amber-600">{user?.role || 'user'}</p>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <div key={item.id}>
                      <button
                        onClick={() => handleNavigationClick(item)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                          activeSection === item.id
                            ? 'bg-amber-200 text-amber-900'
                            : item.id === 'logout'
                            ? 'text-red-600 hover:bg-red-100'
                            : 'text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </button>
                      
                      {item.id === 'profile' && item.subItems && activeSection === 'profile' && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.subItems.map((subItem) => (
                            <button
                              key={subItem}
                              className="block w-full text-left text-sm text-amber-600 hover:text-amber-800 py-1 transition-colors duration-200"
                            >
                              {subItem}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Content - Profile Form */}
            <div className="lg:col-span-3">
              <div className="bg-amber-100 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-8">
                  My Profile
                </h2>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  {/* Username */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Username:
                    </label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      disabled={saving}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                      placeholder="Enter your username"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Full Name: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      disabled={saving}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Email:
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-gray-100 text-amber-700 cursor-not-allowed transition-all duration-200"
                    />
                    <p className="text-xs text-amber-600 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Phone number:
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={saving}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="text-center pt-6">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving || uploading}
                      className="bg-amber-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage