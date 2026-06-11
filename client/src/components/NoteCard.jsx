import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { CATEGORY_COLORS } from '../utils/noteColors'

function NoteCard({ note, onEdit, onDelete, onPin }) {
  const { isDark } = useTheme()
  const [isFlipped, setIsFlipped] = useState(false)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '').trim()
  }

  const categoryColor = CATEGORY_COLORS[note.category] || CATEGORY_COLORS.Other

  return (
    <div
      className="relative h-64 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full transition-all duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >

        {/* Front of card */}
        <div
          className="absolute inset-0 rounded-2xl p-5 flex flex-col"
          style={{
            backgroundColor: note.color,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Top row */}
          <div className="flex items-start justify-between mb-3">
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                backgroundColor: categoryColor.bg,
                color: categoryColor.text,
              }}
            >
              {note.category}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPin(note._id, !note.isPinned)
              }}
              className="text-lg transition-transform hover:scale-125"
              title={note.isPinned ? 'Unpin' : 'Pin'}
            >
              {note.isPinned ? '📌' : '🖇️'}
            </button>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
            {note.title}
          </h3>

          {/* Content preview */}
          <p className="text-gray-700 text-sm flex-1 line-clamp-3">
            {stripHtml(note.content) || 'No content'}
          </p>

          {/* Bottom row */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>📅 {formatDate(note.updatedAt)}</span>
              <span>📝 {note.wordCount} words</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(note)
                }}
                className="flex-1 py-1.5 bg-white/40 hover:bg-white/60 text-gray-800 text-xs font-medium rounded-lg transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(note._id)
                }}
                className="flex-1 py-1.5 bg-white/40 hover:bg-red-400/60 text-gray-800 text-xs font-medium rounded-lg transition"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 rounded-2xl p-5 flex flex-col"
          style={{
            backgroundColor: note.color,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-lg">
              {note.title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsFlipped(false)
              }}
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
            >
              ✕ Close
            </button>
          </div>

          {/* Full content */}
          <div
            className="flex-1 overflow-y-auto text-gray-800 text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: note.content || 'No content' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

      </div>
    </div>
  )
}

export default NoteCard