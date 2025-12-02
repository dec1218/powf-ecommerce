import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from './Header'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [activeSection, setActiveSection] = useState('profile')
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    console.log('Saving profile:', profileData)
    // Here you would typically save to backend
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

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />
      
      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-amber-100 rounded-xl p-6">
                {/* User Profile */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-amber-600">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 text-lg">
                      {user?.full_name || user?.email?.split('@')[0] || 'User'}
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
                      
                      {/* Sub-items for My Account */}
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

                <form className="space-y-6">
                  {/* Username */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Username:
                    </label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your username"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Full Name:
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-amber-900 font-medium mb-2">
                      Email:
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      disabled
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
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="text-center pt-6">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-amber-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                    >
                      Save Changes
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