import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'

const ProfilePage = ({ onBackToHome, onShowLogin, onShowOrderHistory }) => {
  const [activeSection, setActiveSection] = useState('profile')
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    username: '',
    name: '',
    email: 'piren****@gmail.com',
    phone: ''
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
      id: 'log out',
      label: 'Log Out',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
        </svg>
      )
    },
    {
      id: 'Pruchases',
      label: 'My Purchase',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-amber-50">
      <Header onShowLogin={onShowLogin} />
      
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
                    <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 text-lg">Pirena</h3>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <div key={item.id}>
                      <button
                        onClick={() => {
                          if (item.id === 'Pruchases') {
                            navigate('/order-history')
                          } else {
                            setActiveSection(item.id)
                          }
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                          activeSection === item.id
                            ? 'bg-amber-200 text-amber-900'
                            : 'text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </button>
                      
                      {/* Sub-items for My Account */}
                      {item.id === 'profile' && item.subItems && (
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
                      Name:
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
                    />
                    <button
                      type="button"
                      className="text-sm text-amber-600 hover:text-amber-800 underline mt-1 transition-colors duration-200"
                    >
                      Change
                    </button>
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
                    <button
                      type="button"
                      className="text-sm text-amber-600 hover:text-amber-800 underline mt-1 transition-colors duration-200"
                    >
                      Change
                    </button>
                  </div>

                  {/* Save Button */}
                  <div className="text-center pt-6">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-white text-amber-900 font-bold py-3 px-8 rounded-lg border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                    >
                      Save
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
