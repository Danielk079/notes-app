import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'

function Calendar() {
  const { getAuthHeaders, API } = useAuth()
  const { isDark } = useTheme()
  const [groupedNotes, setGroupedNotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    fetchCalendarNotes()
  }, [])

  const fetchCalendarNotes = async () => {
    try {
      const response = await axios.get(
        `${API}/api/notes/calendar`,
        getAuthHeaders()
      )
      setGroupedNotes(response.data)
    } catch (error) {
      console.error('Failed to fetch calendar notes')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const dates = Object.keys(groupedNotes).sort((a, b) =>
    new Date(b) - new Date(a)
  )

  const totalNotes = Object.values(groupedNotes).flat().length

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">

        <Navbar
          searchValue={search}
          onSearch={setSearch}
          onNewNote={() => {}}
        />

        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">

          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Calendar 📅
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {totalNotes} notes across {dates.length} days
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`h-32 rounded-2xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          ) : dates.length === 0 ? (
            <EmptyState
              emoji="📅"
              title="No notes yet"
              description="Create some notes and they'll appear here organized by date"
            />
          ) : (
            <div className="space-y-6">
              {dates.map((date) => {
                const isSelected = selectedDate === date
                const notesForDate = groupedNotes[date]

                return (
                  <div key={date}>
                    {/* Date header */}
                    <button
                      onClick={() => setSelectedDate(isSelected ? null : date)}
                      className="flex items-center gap-3 mb-3 w-full text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" />
                        <h2 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatDate(date)}
                        </h2>
                      </div>
                      <div className={`flex-1 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
                      <span className={`text-sm px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                        {notesForDate.length} {notesForDate.length === 1 ? 'note' : 'notes'}
                      </span>
                      <span className={`text-sm transition-transform duration-200 ${isSelected ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        ▼
                      </span>
                    </button>

                    {/* Notes for this date */}
                    {!isSelected && (
                      <div className="space-y-3 pl-5">
                        {notesForDate.map((note) => (
                          <div
                            key={note._id}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.01] ${isDark ? 'bg-gray-900 hover:bg-gray-800' : 'bg-white hover:bg-gray-50 shadow-sm'}`}
                          >
                            {/* Color dot */}
                            <div
                              className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                              style={{ backgroundColor: note.color }}
                            >
                              <span className="text-lg">
                                {note.category === 'Work' ? '💼' :
                                 note.category === 'Personal' ? '👤' :
                                 note.category === 'Ideas' ? '💡' : '📄'}
                              </span>
                            </div>

                            {/* Note info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {note.title}
                                </p>
                                {note.isPinned && <span className="text-sm">📌</span>}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full`}
                                  style={{
                                    backgroundColor: note.color + '40',
                                    color: isDark ? '#fff' : '#333'
                                  }}
                                >
                                  {note.category}
                                </span>
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  🕐 {formatTime(note.createdAt)}
                                </span>
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  📝 {note.wordCount} words
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default Calendar