import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import StatsCard from '../components/StatsCard'
import EmptyState from '../components/EmptyState'
import { CATEGORY_COLORS } from '../utils/noteColors'

function Dashboard() {
  const { getAuthHeaders, API, user } = useAuth()
  const { isDark } = useTheme()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API}/api/notes/stats`,
        getAuthHeaders()
      )
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">

        <Navbar
          searchValue={search}
          onSearch={setSearch}
          onNewNote={() => {}}
        />

        <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">

          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Dashboard 📊
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Welcome back, {user?.username}! Here's your notes overview.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-28 rounded-2xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          ) : stats ? (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                  title="Total Notes"
                  value={stats.totalNotes}
                  emoji="📝"
                  color="#BB8FCE"
                />
                <StatsCard
                  title="Pinned"
                  value={stats.pinnedNotes}
                  emoji="📌"
                  color="#45B7D1"
                />
                <StatsCard
                  title="In Trash"
                  value={stats.trashedNotes}
                  emoji="🗑️"
                  color="#FF6B6B"
                />
                <StatsCard
                  title="Categories"
                  value={stats.byCategory.length}
                  emoji="🏷️"
                  color="#96CEB4"
                />
              </div>

              {/* Category breakdown */}
              <div className={`rounded-2xl p-6 mb-6 ${isDark ? 'bg-gray-900' : 'bg-white shadow-md'}`}>
                <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Notes by Category
                </h2>
                {stats.byCategory.length === 0 ? (
                  <EmptyState
                    emoji="🏷️"
                    title="No categories yet"
                    description="Create some notes to see your category breakdown"
                  />
                ) : (
                  <div className="space-y-3">
                    {stats.byCategory.map((cat) => {
                      const color = CATEGORY_COLORS[cat._id] || CATEGORY_COLORS.Other
                      const percentage = Math.round(
                        (cat.count / stats.totalNotes) * 100
                      )
                      return (
                        <div key={cat._id}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color.bg }}
                              />
                              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {cat._id}
                              </span>
                            </div>
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {cat.count} notes ({percentage}%)
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: color.bg,
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Latest notes */}
              <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-900' : 'bg-white shadow-md'}`}>
                <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recently Added
                </h2>
                {stats.latestNotes?.length === 0 ? (
                  <EmptyState
                    emoji="📝"
                    title="No notes yet"
                    description="Create your first note to see it here"
                  />
                ) : (
                  <div className="space-y-3">
                    {stats.latestNotes?.map((note) => (
                      <div
                        key={note._id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex-shrink-0"
                          style={{ backgroundColor: note.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {note.title}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {note.category} • {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {note.isPinned && <span>📌</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}

        </main>
      </div>
    </div>
  )
}

export default Dashboard