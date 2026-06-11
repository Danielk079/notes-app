import { useEffect } from 'react'

const useKeyboardShortcuts = ({ onNewNote, onSearch, onCloseModal }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + M → New note (avoiding browser conflicts)
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault()
        onNewNote && onNewNote()
      }

      // Ctrl + F is also browser controlled, use Ctrl + K instead
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        onSearch && onSearch()
      }

      // Escape → Close modal
      if (e.key === 'Escape') {
        onCloseModal && onCloseModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNewNote, onSearch, onCloseModal])
}

export default useKeyboardShortcuts