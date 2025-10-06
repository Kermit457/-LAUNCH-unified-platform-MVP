"use client"

import { Rocket, Zap, DollarSign, Users } from 'lucide-react'
import Link from 'next/link'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  cta: { label: string; href: string }
  gradient: string
}

const iconMap = {
  Rocket,
  Zap,
  DollarSign,
  Users
}

export function FeatureCard({ icon, title, description, cta, gradient }: FeatureCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Rocket

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />

      {/* Card */}
      <div className="relative rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl hover:border-white/20 transition-all">
        {/* Icon */}
        <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${gradient} mb-6`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>

        {/* Description */}
        <p className="text-zinc-400 mb-6">{description}</p>

        {/* CTA */}
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium transition-colors group/cta"
        >
          {cta.label}
          <span className="group-hover/cta:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  )
}
