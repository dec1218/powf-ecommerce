const AdminHeader = ({ user, onLogout, onViewStore }) => {
  return (
    <header className="bg-white shadow-md px-4 py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-amber-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-amber-600">Pawfect Shop Management</p>
            </div>
          </div>

          {/* Admin Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* Admin Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-amber-100 px-4 py-2 rounded-lg">
              <div className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs text-amber-600 font-medium">Admin</p>
                <p className="text-sm text-amber-900 font-semibold">{user?.email}</p>
              </div>
            </div>

            {/* View Store Button */}
            <button
              onClick={onViewStore}
              className="hidden sm:flex items-center space-x-2 bg-amber-200 text-amber-900 px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>View Store</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"/>
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Admin Info */}
        <div className="sm:hidden mt-4 flex items-center justify-between bg-amber-100 px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-xs text-amber-600 font-medium">Admin</p>
              <p className="text-sm text-amber-900 font-semibold">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onViewStore}
            className="bg-amber-200 text-amber-900 px-3 py-1 rounded text-sm font-medium"
          >
            View Store
          </button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader