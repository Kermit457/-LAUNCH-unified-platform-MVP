"use client"

import { landingData } from '@/lib/landingData'

export function SocialProofBar() {
  const { socialProof } = landingData

  return (
    <section className="py-12 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Partners */}
          <div className="flex items-center gap-8 flex-wrap justify-center">
            {socialProof.partners.map((partner) => (
              <div
                key={partner.name}
                className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                title={partner.name}
              >
                <span className="text-xs text-white/70 font-semibold">{partner.name.slice(0, 3).toUpperCase()}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="text-center md:text-right">
            <div className="text-sm text-zinc-500 uppercase tracking-wide mb-1">
              {socialProof.stats.label}
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
              {socialProof.stats.creators} creators
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
