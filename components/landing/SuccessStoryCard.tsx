"use client"

interface SuccessStoryCardProps {
  name: string
  logo: string
  stat: string
  quote: string
  category: string
  color: 'fuchsia' | 'cyan' | 'purple'
}

export function SuccessStoryCard({ name, logo, stat, quote, category, color }: SuccessStoryCardProps) {
  const colorClasses = {
    fuchsia: 'from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-500/30',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30'
  }

  const badgeColors = {
    fuchsia: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
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
      <div className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-6">
        {stat}
      </div>

      {/* Quote */}
      <blockquote className="text-zinc-400 italic border-l-2 border-white/20 pl-4">
        "{quote}"
      </blockquote>
    </div>
  )
}
