'use client'

import { Video, Megaphone, Briefcase, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function UserJourneyCards() {
  const journeys = [
    {
      icon: Video,
      title: 'For Creators',
      description: 'Launch tokens, run predictions, and monetize your content with interactive widgets',
      features: ['Token launches', 'Prediction markets', 'Viewer engagement tools'],
      cta: 'Start Creating',
      href: '/tools',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: Megaphone,
      title: 'For Streamers',
      description: 'Engage your audience with raids, campaigns, and community-driven quests',
      features: ['Stream raids', 'Social campaigns', 'Quest systems'],
      cta: 'Start Streaming',
      href: '/engage',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Briefcase,
      title: 'For Agencies',
      description: 'Manage multiple clients, track performance, and scale content monetization',
      features: ['Multi-client dashboard', 'Analytics & insights', 'Revenue tracking'],
      cta: 'Scale Your Business',
      href: '/community',
      gradient: 'from-blue-500 to-cyan-600'
    }
  ]

  return (
    <section className="container mx-auto px-4 py-20 border-t border-white/10">
      <h2 className="text-4xl font-bold text-center mb-4 gradient-text-shimmer">
        Choose Your Path
      </h2>
      <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">
        Whether you're a creator, streamer, or agency - $LAUNCH has the tools to grow your audience and revenue
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {journeys.map((journey, index) => (
          <div
            key={journey.title}
            className="glass-card p-8 group hover:scale-105 transition-all duration-300 hover:bg-white/[0.08]"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Icon */}
            <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${journey.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <journey.icon className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-white mb-3">{journey.title}</h3>
            <p className="text-white/60 mb-6">{journey.description}</p>

            {/* Features List */}
            <ul className="space-y-2 mb-6">
              {journey.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${journey.gradient}`} />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link href={journey.href}>
              <button className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r ${journey.gradient} text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 group-hover:gap-3`}>
                {journey.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
