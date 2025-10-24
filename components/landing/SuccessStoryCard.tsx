"use client"

interface SuccessStoryCardProps {
  name: string
  logo: string
  stat: string
  quote: string
  category: string
  color: 'lime' | 'cyan' | 'lime'
}

export function SuccessStoryCard({ name, logo, stat, quote, category, color }: SuccessStoryCardProps) {
  const colorClasses = {
    lime: 'from-lime-500/20 to-lime-500/5 border-lime-500/30',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
    lime: 'from-lime-500/20 to-lime-500/5 border-lime-500/30'
  }

  const badgeColors = {
    lime: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    lime: 'bg-lime-500/20 text-lime-300 border-lime-500/40'
  }

  return (
    <div className={`relative rounded-2xl bg-gradient-to-br ${colorClasses[color]} border p-8 backdrop-blur-xl hover:scale-105 transition-transform duration-300`}>
      {/* Category Badge */}
      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border mb-4 ${badgeColors[color]}`}>
        {category}
      </span>

      {/* Logo & Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
          <img src={logo} alt={name} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-2xl font-bold text-white">{name}</h3>
      </div>

      {/* Stat */}
      <div className="text-3xl font-bold bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 bg-clip-text text-transparent mb-6">
        {stat}
      </div>

      {/* Quote */}
      <blockquote className="text-zinc-400 italic border-l-2 border-white/20 pl-4">
        "{quote}"
      </blockquote>
    </div>
  )
}
