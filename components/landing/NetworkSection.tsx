"use client"

import { landingData } from '@/lib/landingData'
import { CheckCircle, Shield, TrendingUp } from 'lucide-react'

const iconMap = {
  'Conviction Scores': TrendingUp,
  'Verified Identity': Shield,
  'Referral Economy': CheckCircle
}

export function NetworkSection() {
  const { network } = landingData

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            {network.headline}
          </h2>
          <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
            {network.subline}
          </p>
        </div>

        {/* Network Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {network.benefits.map((benefit) => {
            const IconComponent = iconMap[benefit.title as keyof typeof iconMap] || CheckCircle

            return (
              <div
                key={benefit.title}
                className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl text-center hover:border-cyan-500/50 transition-all group"
              >
                {/* Icon */}
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>

                {/* Description */}
                <p className="text-zinc-400">{benefit.description}</p>
              </div>
            )
          })}
        </div>

        {/* Network Graph Visual */}
        <div className="mt-16 relative h-64 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
          {/* Animated nodes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Central node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-lime-500 to-cyan-500 animate-pulse" />

              {/* Surrounding nodes */}
              <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-lime-500/50 animate-pulse delay-100" />
              <div className="absolute top-1/4 right-1/4 w-8 h-8 rounded-full bg-cyan-500/50 animate-pulse delay-200" />
              <div className="absolute bottom-1/4 left-1/3 w-8 h-8 rounded-full bg-lime-500/50 animate-pulse delay-300" />
              <div className="absolute bottom-1/4 right-1/3 w-8 h-8 rounded-full bg-lime-500/50 animate-pulse delay-400" />

              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full">
                <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="33%" y2="75%" stroke="rgba(217,70,239,0.3)" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="67%" y2="75%" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
