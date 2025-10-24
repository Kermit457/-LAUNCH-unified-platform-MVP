'use client'

import { Rocket, Users, DollarSign, TrendingUp, Repeat } from 'lucide-react'

export function Flywheel() {
  const pillars = [
    {
      icon: Rocket,
      title: 'Launch',
      description: 'Create token or campaign',
      color: 'from-launchos-lime to-pink-600',
    },
    {
      icon: Users,
      title: 'Engage',
      description: 'Raids, clips, predictions, streams',
      color: 'from-launchos-violet to-lime-600',
    },
    {
      icon: DollarSign,
      title: 'Earn',
      description: 'Payouts + boosts → visibility → more launches',
      color: 'from-launchos-cyan to-blue-600',
    },
  ]

  return (
    <section className="container mx-auto px-4 py-20 border-t border-white/10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold gradient-text-launchos mb-4">
          How Growth Compounds
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          The viral feedback loop that turns attention into capital
        </p>
      </div>

      {/* Three Pillars */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {pillars.map((pillar, index) => (
          <div
            key={pillar.title}
            className="relative glass-launchos p-8 rounded-2xl group hover:scale-105 transition-all duration-300 neon-glow-hover"
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          >
            {/* Icon */}
            <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <pillar.icon className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-white mb-3">{pillar.title}</h3>
            <p className="text-white/60">{pillar.description}</p>

            {/* Arrow (except last) */}
            {index < pillars.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-10">
                <TrendingUp className="w-6 h-6 text-launchos-cyan rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Circular Loop Visualization */}
      <div className="glass-launchos rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-white/80 font-medium">Fees</span>
            <TrendingUp className="w-4 h-4 text-launchos-lime" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/80 font-medium">Boosts</span>
            <TrendingUp className="w-4 h-4 text-launchos-violet" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/80 font-medium">Visibility</span>
            <TrendingUp className="w-4 h-4 text-launchos-cyan" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/80 font-medium">Demand</span>
            <TrendingUp className="w-4 h-4 text-launchos-lime" />
          </div>
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-white/80 font-medium">Repeat</span>
          </div>
        </div>
      </div>
    </section>
  )
}
