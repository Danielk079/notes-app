import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'

function Trash() {
  const { getAuthHeaders, API } = useAuth()
  const { isDark } = useTheme()
  const [trashedNotes, setTrashedNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchTrashedNotes()
  }, [])

  const fetchTrashedNotes = async () => {
    try {
      const response = await axios.get(
        `${API}/api/notes/trash`,
        getAuthHeaders()
      )
      setTrashedNotes(response.data)
    } catch (error) {
      console.error('Failed to fetch trashed notes')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (noteId) => {
    try {
      await axios.put(
        `${API}/api/notes/${noteId}/restore`,
        {},
        getAuthHeaders()
      )
      setTrashedNotes(trashedNotes.filter(n => n._id !== noteId))
    } catch (error) {
      console.error('Failed to restore note')
    }
  }

  const handlePermanentDelete = async (noteId) => {
    if (!window.confirm('Permanently delete this note? This cannot be undone!')) return
    try {
      await axios.delete(
        `${API}/api/notes/${noteId}/permanent`,
        getAuthHeaders()
      )
      setTrashedNotes(trashedNotes.filter(n => n._id !== noteId))
    } catch (error) {
      console.error('Failed to permanently delete note')
    }
  }

  const handleRestoreAll = async () => {
    if (!window.confirm('Restore all notes from trash?')) return
    try {
      await Promise.all(
        trashedNotes.map(note =>
          axios.put(
            `${API}/api/notes/${note._id}/restore`,
            {},
            getAuthHeaders()
          )
        )
      )
      setTrashedNotes([])
    } catch (error) {
      console.error('Failed to restore all notes')
    }
  }

  const handleEmptyTrash = async () => {
    if (!window.confirm('Permanently delete ALL notes in trash? This cannot be undone!')) return
    try {
      await Promise.all(
        trashedNotes.map(note =>
          axios.delete(
            `${API}/api/notes/${note._id}/permanent`,
            getAuthHeaders()
          )
        )
      )
      setTrashedNotes([])
    } catch (error) {
      console.error('Failed to empty trash')
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDaysLeft = (deletedAt) => {
    if (!deletedAt) return 7
    const deleted = new Date(deletedAt)
    const now = new Date()
    const diffMs = 7 * 24 * 60 * 60 * 1000 - (now - deleted)
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return Math.max(0, daysLeft)
  }

  const filteredNotes = trashedNotes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase())
  )

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Trash 🗑️
              </h1>
              <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Notes are permanently deleted after 7 days
              </p>
            </div>

            {/* Bulk actions */}
            {trashedNotes.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleRestoreAll}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition ${isDark ? 'bg-gray-800 text-green-400 hover:bg-gray-700' : 'bg-white text-green-600 hover:bg-green-50 shadow-sm'}`}
                >
                  ♻️ Restore All
                </button>
                <button
                  onClick={handleEmptyTrash}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition ${isDark ? 'bg-gray-800 text-red-400 hover:bg-gray-700' : 'bg-white text-red-600 hover:bg-red-50 shadow-sm'}`}
                >
                  🗑️ Empty Trash
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`h-24 rounded-2xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <EmptyState
              emoji="🗑️"
              title="Trash is empty"
              description="Deleted notes will appear here for 7 days before being permanently removed"
            />
          ) : (
            <div className="space-y-3">
              {filteredNotes.map((note) => {
                const daysLeft = getDaysLeft(note.deletedAt)
                return (
                  <div
                    key={note._id}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isDark ? 'bg-gray-900' : 'bg-white shadow-sm'}`}
                  >
                    {/* Color block */}
                    <div
                      className="w-12 h-12 rounded-xl flex-shrink-0 opacity-60"
                      style={{ backgroundColor: note.color }}
                    />

                    {/* Note info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {note.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          🗑️ Deleted {formatDate(note.deletedAt)}
                        </span>
                        <span className={`text-xs font-medium ${daysLeft <= 1 ? 'text-red-500' : daysLeft <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                          ⏳ {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleRestore(note._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${isDark ? 'bg-gray-800 text-green-400 hover:bg-gray-700' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        ♻️ Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(note._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${isDark ? 'bg-gray-800 text-red-400 hover:bg-gray-700' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                      >
                        🗑️ Delete
                      </button>
                    </div>
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

export default Trash