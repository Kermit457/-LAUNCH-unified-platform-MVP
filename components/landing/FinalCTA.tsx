"use client"

import Link from 'next/link'
import { landingData } from '@/lib/landingData'

export function FinalCTA() {
  const { finalCTA } = landingData

  return (
    <section className="py-32 px-4 bg-gradient-to-b from-transparent via-purple-950/20 to-black">
      <div className="max-w-5xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-6">
          {finalCTA.headline}
        </h2>

        {/* Subline */}
        <p className="text-xl text-zinc-400 mb-8">
          {finalCTA.subline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {finalCTA.ctas.map((cta) => (
            <Link
              key={cta.label}
              href={cta.href}
              className={
                cta.variant === 'primary'
                  ? 'px-10 py-5 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] text-white font-bold text-lg transition-all'
                  : 'px-10 py-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-lg transition-all'
              }
            >
              {cta.label}
            </Link>
          ))}
        </div>

        {/* Incentive */}
        <div className="inline-block px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          {finalCTA.incentive}
        </div>
      </div>
    </section>
  )
}
