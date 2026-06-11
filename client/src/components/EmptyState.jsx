import { useTheme } from '../context/ThemeContext'

function EmptyState({ title, description, emoji }) {
  const { isDark } = useTheme()

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="text-7xl mb-6 animate-bounce">{emoji || '📝'}</div>
      <h3 className={`text-2xl font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title || 'Nothing here yet'}
      </h3>
      <p className={`text-center max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {description || 'Get started by creating your first note'}
      </p>
    </div>
  )
}

export default EmptyState