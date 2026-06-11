import { useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

function Navbar({ onSearch, searchValue, onNewNote }) {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()
  const searchRef = useRef(null)

  return (
    <header className={`sticky top-0 z-40 px-4 py-3 flex items-center gap-3 transition-colors duration-300 ${isDark ? 'bg-gray-950 border-b border-gray-800' : 'bg-gray-50 border-b border-gray-200'}`}>

      {/* Search bar */}
      <div className="flex-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          ref={searchRef}
          type="text"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search notes... (Ctrl+K)"
          className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:border-purple-500 transition text-sm ${isDark ? 'bg-gray-900 text-white border-gray-700 placeholder-gray-500' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
        />
      </div>

      {/* New note button */}
      <button
        onClick={onNewNote}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition shadow-md"
      >
        <span className="text-lg">+</span>
        <span className="hidden sm:inline">New Note</span>
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-xl text-xl transition ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100 shadow'}`}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* User avatar */}
      <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-bold">
          {user?.username?.charAt(0).toUpperCase()}
        </span>
      </div>

    </header>
  )
}

export default Navbar