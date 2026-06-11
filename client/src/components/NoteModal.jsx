import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { useTheme } from '../context/ThemeContext'
import { CATEGORY_COLORS } from '../utils/noteColors'

const CATEGORIES = ['Work', 'Personal', 'Ideas', 'Other']

function NoteModal({ isOpen, onClose, onSave, editNote, loading }) {
  const { isDark } = useTheme()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Other')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(null)

  // Populate form when editing
  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title)
      setContent(editNote.content || '')
      setCategory(editNote.category)
      updateCounts(editNote.content || '')
    } else {
      setTitle('')
      setContent('')
      setCategory('Other')
      setWordCount(0)
      setCharCount(0)
    }
  }, [editNote, isOpen])

  const updateCounts = (text) => {
    const stripped = text.replace(/<[^>]*>/g, '').trim()
    setCharCount(stripped.length)
    setWordCount(stripped ? stripped.split(/\s+/).filter(Boolean).length : 0)
  }

  const handleContentChange = (value) => {
    setContent(value || '')
    updateCounts(value || '')

    // Typing indicator
    setIsTyping(true)
    if (typingTimeout) clearTimeout(typingTimeout)
    const timeout = setTimeout(() => setIsTyping(false), 1000)
    setTypingTimeout(timeout)
  }

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title, content, category })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
        style={{ maxHeight: '90vh' }}
      >

        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {editNote ? '✏️ Edit Note' : '✨ New Note'}
          </h2>
          <div className="flex items-center gap-3">
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  typing
                </span>
                <div className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-purple-500 transition text-lg font-semibold ${isDark ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-500' : 'bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400'}`}
          />

          {/* Category selector */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const color = CATEGORY_COLORS[cat]
              const isSelected = category === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: isSelected ? color.bg : 'transparent',
                    color: isSelected ? color.text : isDark ? '#9CA3AF' : '#6B7280',
                    border: `2px solid ${color.bg}`,
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Rich text editor */}
          <div data-color-mode={isDark ? 'dark' : 'light'}>
            <MDEditor
              value={content}
              onChange={handleContentChange}
              height={250}
              preview="edit"
              hideToolbar={false}
            />
          </div>

          {/* Word and char count */}
          <div className="flex items-center gap-4">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              📝 {wordCount} words
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              🔤 {charCount} characters
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              ⌨️ Ctrl+M for new note
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 p-5 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition shadow-md"
          >
            {loading ? 'Saving...' : editNote ? 'Save Changes' : 'Create Note'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default NoteModal