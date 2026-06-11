import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import NoteCard from '../components/NoteCard'
import NoteModal from '../components/NoteModal'
import Confetti from '../components/Confetti'
import EmptyState from '../components/EmptyState'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'

const CATEGORIES = ['All', 'Work', 'Personal', 'Ideas', 'Other']

function Notes() {
  const { getAuthHeaders, API } = useAuth()
  const { isDark } = useTheme()
  const searchRef = useRef(null)

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editNote, setEditNote] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState('')

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewNote: () => {
      setEditNote(null)
      setShowModal(true)
    },
    onSearch: () => searchRef.current?.focus(),
    onCloseModal: () => {
      setShowModal(false)
      setEditNote(null)
    },
  })

  // Fetch notes
  useEffect(() => {
    fetchNotes()
  }, [search, category])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const params = {}
      if (search) params.search = search
      if (category !== 'All') params.category = category

      const response = await axios.get(`${API}/api/notes`, {
        ...getAuthHeaders(),
        params,
      })
      setNotes(response.data)
    } catch (error) {
      setError('Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async ({ title, content, category: cat }) => {
    try {
      setSaving(true)
      if (editNote) {
        // Update existing note
        const response = await axios.put(
          `${API}/api/notes/${editNote._id}`,
          { title, content, category: cat },
          getAuthHeaders()
        )
        setNotes(notes.map(n => n._id === editNote._id ? response.data : n))
      } else {
        // Create new note
        const response = await axios.post(
          `${API}/api/notes`,
          { title, content, category: cat },
          getAuthHeaders()
        )
        setNotes([response.data, ...notes])
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
      setShowModal(false)
      setEditNote(null)
    } catch (error) {
      setError('Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (noteId) => {
    if (!window.confirm('Move this note to trash?')) return
    try {
      await axios.delete(`${API}/api/notes/${noteId}`, getAuthHeaders())
      setNotes(notes.filter(n => n._id !== noteId))
    } catch (error) {
      setError('Failed to delete note')
    }
  }

  const handlePin = async (noteId, isPinned) => {
    try {
      const response = await axios.put(
        `${API}/api/notes/${noteId}`,
        { isPinned },
        getAuthHeaders()
      )
      const updated = notes.map(n => n._id === noteId ? response.data : n)
      // Sort pinned to top
      updated.sort((a, b) => b.isPinned - a.isPinned)
      setNotes(updated)
    } catch (error) {
      setError('Failed to pin note')
    }
  }

  const handleEdit = (note) => {
    setEditNote(note)
    setShowModal(true)
  }

  const pinnedNotes = notes.filter(n => n.isPinned)
  const unpinnedNotes = notes.filter(n => !n.isPinned)

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>

      {/* Confetti */}
      <Confetti trigger={showConfetti} />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">

        {/* Navbar */}
        <Navbar
          searchValue={search}
          onSearch={setSearch}
          onNewNote={() => {
            setEditNote(null)
            setShowModal(true)
          }}
        />

        <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full">

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
                  category === cat
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : isDark
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`h-64 rounded-2xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <EmptyState
              emoji="📝"
              title={search ? 'No notes found' : 'No notes yet'}
              description={
                search
                  ? `No notes matching "${search}"`
                  : 'Press Ctrl+N or click New Note to create your first note!'
              }
            />
          ) : (
            <>
              {/* Pinned notes */}
              {pinnedNotes.length > 0 && (
                <div className="mb-6">
                  <h2 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    📌 Pinned
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pinnedNotes.map(note => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPin={handlePin}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Other notes */}
              {unpinnedNotes.length > 0 && (
                <div>
                  {pinnedNotes.length > 0 && (
                    <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      All Notes
                    </h2>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unpinnedNotes.map(note => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPin={handlePin}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditNote(null)
        }}
        onSave={handleSave}
        editNote={editNote}
        loading={saving}
      />

      {/* Floating new note button (mobile) */}
      <button
        onClick={() => {
          setEditNote(null)
          setShowModal(true)
        }}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-3xl rounded-full shadow-lg flex items-center justify-center transition hover:scale-110 z-40"
      >
        +
      </button>

    </div>
  )
}

export default Notes