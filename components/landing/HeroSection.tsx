"use client"

import { TrendingUp, Users, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { CounterCard } from './CounterCard'
import { landingData } from '@/lib/landingData'

export function HeroSection() {
  const { hero, counters } = landingData

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-24 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-lime-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto w-full">
        {/* Hero Content */}
        <div className="text-center mb-16">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 bg-clip-text text-transparent">
              {hero.headline}
            </span>
          </h1>

          {/* Subline */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-12">
            {hero.subline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            {hero.ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className={
                  cta.variant === 'primary'
                    ? 'px-8 py-4 rounded-xl bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] text-white font-bold text-lg transition-all'
                    : cta.variant === 'secondary'
                    ? 'px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-lg transition-all'
                    : 'px-8 py-4 rounded-xl text-white/70 hover:text-white font-medium text-lg transition-all'
                }
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <CounterCard
            value={counters.totalEarned}
            label="Total Earned"
            prefix="$"
            icon={<DollarSign className="w-8 h-8" />}
          />
          <CounterCard
            value={counters.contributions}
            label="Contributions"
            suffix="+"
            icon={<Users className="w-8 h-8" />}
          />
          <CounterCard
            value={counters.feesGenerated}
            label="Fees Generated"
            prefix="$"
            icon={<TrendingUp className="w-8 h-8" />}
          />
        </div>
      </div>
    </section>
  )
}
