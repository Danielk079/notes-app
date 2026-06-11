import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/notes', emoji: '📝', label: 'Notes' },
  { path: '/dashboard', emoji: '📊', label: 'Dashboard' },
  { path: '/calendar', emoji: '📅', label: 'Calendar' },
  { path: '/trash', emoji: '🗑️', label: 'Trash' },
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark } = useTheme()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-60 min-h-screen p-4 transition-colors duration-300 ${isDark ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200 shadow-sm'}`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <span className="text-3xl">📝</span>
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Notes
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : isDark
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user?.username}
              </p>
              <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition ${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-red-400' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'}`}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around px-4 py-2 z-50 transition-colors duration-300 ${isDark ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200 shadow-lg'}`}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-purple-500'
                  : isDark
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}

export default Sidebar