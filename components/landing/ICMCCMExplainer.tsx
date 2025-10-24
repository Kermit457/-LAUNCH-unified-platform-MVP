"use client"

import { Rocket, Video, Globe } from 'lucide-react'
import { landingData } from '@/lib/landingData'

const iconMap = {
  Rocket,
  Video,
  Globe
}

export function ICMCCMExplainer() {
  const { icmccm } = landingData

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-transparent via-lime-950/10 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            {icmccm.headline}
          </h2>
          <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
            {icmccm.subline}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {icmccm.benefits.map((benefit) => {
            const IconComponent = iconMap[benefit.icon as keyof typeof iconMap] || Rocket

            return (
              <div key={benefit.title} className="text-center">
                {/* Icon */}
                <div className="inline-flex p-6 rounded-2xl bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 mb-6">
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>

                {/* Description */}
                <p className="text-zinc-400 mb-2">{benefit.description}</p>

                {/* Tagline */}
                <p className="text-sm text-lime-400 italic">"{benefit.tagline}"</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
