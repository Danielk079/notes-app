import { useTheme } from '../context/ThemeContext'

function StatsCard({ title, value, emoji, color }) {
  const { isDark } = useTheme()

  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-300 hover:scale-105 cursor-default ${isDark ? 'bg-gray-900' : 'bg-white shadow-md'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {title}
        </p>
        <span className="text-2xl">{emoji}</span>
      </div>
      <p
        className="text-4xl font-bold"
        style={{ color: color || '#BB8FCE' }}
      >
        {value}
      </p>
    </div>
  )
}

export default StatsCard