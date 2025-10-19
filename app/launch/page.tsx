"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Coins, Video, Flame, ArrowRight, TrendingUp, Users, Network, Trophy } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SubmitLaunchDrawer } from '@/components/launch/SubmitLaunchDrawer'

export default function LaunchPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Example successful projects
  const showcaseProjects = [
    {
      id: 'showcase-1',
      type: 'icm' as const,
      title: 'DeFi Analytics Platform',
      subtitle: 'Real-time on-chain analytics and trading signals',
      ticker: '$DEFA',
      logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=DEFA&backgroundColor=10b981',
      status: 'active' as const,
      beliefScore: 89,
      upvotes: 342,
      commentsCount: 87,
      viewCount: 12400,
      holders: 1240,
      priceChange24h: 45.2,
      currentPrice: 0.12,
      twitterUrl: 'https://twitter.com/example',
      metrics: {
        raised: '$48K',
        holders: 1240,
        successRate: '94%'
      }
    },
    {
      id: 'showcase-2',
      type: 'ccm' as const,
      title: '@TechInfluencer',
      subtitle: 'Crypto educator & market analyst',
      ticker: '$TECH',
      logoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechInfluencer',
      status: 'live' as const,
      beliefScore: 92,
      upvotes: 567,
      commentsCount: 134,
      viewCount: 28900,
      holders: 2100,
      priceChange24h: 32.8,
      currentPrice: 0.24,
      twitterUrl: 'https://twitter.com/example',
      metrics: {
        raised: '$92K',
        holders: 2100,
        successRate: '97%'
      }
    },
    {
      id: 'showcase-3',
      type: 'meme' as const,
      title: 'Solana Doge',
      subtitle: 'The goodest boi on Solana',
      ticker: '$SDOGE',
      logoUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SDOGE&backgroundColor=f97316',
      status: 'live' as const,
      beliefScore: 78,
      upvotes: 1240,
      commentsCount: 423,
      viewCount: 84200,
      holders: 8400,
      priceChange24h: 156.7,
      currentPrice: 0.0089,
      twitterUrl: 'https://twitter.com/example',
      metrics: {
        raised: '$156K',
        holders: 8400,
        successRate: '99%'
      }
    }
  ]

  const handleSubmit = (data: any) => {
    console.log('Launch submitted:', data)
    setDrawerOpen(false)
    // TODO: Handle submission
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 via-purple-500/10 to-orange-500/10 border border-white/10 text-sm font-medium mb-6"
          >
            <Rocket className="w-4 h-4 text-purple-400" />
            <span className="bg-gradient-to-r from-green-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              Launch Your Project
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-green-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-6"
          >
            Turn Ideas Into Value
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12"
          >
            Launch projects, creator curves, or meme coins with built-in community, networking, and contribution rewards.
            <span className="block mt-2 text-lg text-zinc-500">Higher success chance through collaboration.</span>
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105"
          >
            <Rocket className="w-6 h-6" />
            Start Your Launch
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Value Props - Why Launch Here */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Why Launch on Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValuePropCard
              icon={TrendingUp}
              title="Higher Success Rate"
              description="94% of projects reach their funding goals through community backing"
              color="green"
            />
            <ValuePropCard
              icon={Network}
              title="Built-in Network"
              description="Instant access to engaged investors and contributors from day one"
              color="purple"
            />
            <ValuePropCard
              icon={Users}
              title="Contribution Rewards"
              description="Contributors earn tokens for helping projects succeed"
              color="blue"
            />
            <ValuePropCard
              icon={Trophy}
              title="Anti-Sniper Protection"
              description="Fair launch mechanics ensure organic community growth"
              color="orange"
            />
          </div>
        </div>

        {/* Success Metrics */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-purple-900/20 via-zinc-900/40 to-pink-900/20 backdrop-blur-xl rounded-3xl border border-white/10 p-12">
            <h3 className="text-2xl font-bold text-center mb-10 text-white">Platform Success Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <MetricCard
                value="$12.4M"
                label="Total Raised"
                color="green"
              />
              <MetricCard
                value="248"
                label="Projects Launched"
                color="purple"
              />
              <MetricCard
                value="94%"
                label="Success Rate"
                color="blue"
              />
              <MetricCard
                value="42K+"
                label="Active Users"
                color="orange"
              />
            </div>
          </div>
        </div>

        {/* Showcase Projects */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Featured Launches
          </h2>
          <p className="text-center text-zinc-400 mb-12 text-lg">
            Real projects that launched successfully on our platform
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {showcaseProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ShowcaseCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              icon={Coins}
              title="Choose Your Type"
              description="Select Project (ICM), Creator (CCM), or Meme coin launch"
              color="green"
            />
            <StepCard
              step={2}
              icon={Rocket}
              title="Launch with Community"
              description="Contributors help market, build, and grow your project for token rewards"
              color="purple"
            />
            <StepCard
              step={3}
              icon={TrendingUp}
              title="Reach DEX Launch"
              description="Hit bonding curve target → Auto LP creation → Trade on DEX"
              color="orange"
            />
          </div>
        </div>

        {/* Launch Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Choose Your Launch Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LaunchTypeCard
              type="icm"
              icon={Coins}
              emoji="💼"
              name="Project Launch"
              description="Launch tokens for startups, protocols, DAOs, or dApps"
              examples={['DeFi Protocol', 'AI Platform', 'GameFi']}
            />
            <LaunchTypeCard
              type="ccm"
              icon={Video}
              emoji="🎥"
              name="Creator Curve"
              description="Monetize your personal brand, content, or influence"
              examples={['YouTubers', 'Influencers', 'Educators']}
            />
            <LaunchTypeCard
              type="meme"
              icon={Flame}
              emoji="🔥"
              name="Meme Coin"
              description="Launch community-driven meme tokens with viral potential"
              examples={['$DEGEN', '$PEPE', '$BONK']}
            />
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="inline-block p-12 rounded-3xl bg-gradient-to-br from-purple-900/30 via-zinc-900/50 to-pink-900/30 border border-white/10 backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Launch?
            </h3>
            <p className="text-lg text-zinc-400 mb-8 max-w-xl">
              Join 248+ projects that have successfully launched on our platform
            </p>
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl text-white font-bold text-xl transition-all bg-gradient-to-r from-green-500 via-purple-500 to-orange-500 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105"
            >
              <Rocket className="w-6 h-6" />
              Launch Your Project Now
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

      </div>

      {/* Launch Wizard Drawer */}
      <SubmitLaunchDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

// Value Proposition Card
function ValuePropCard({
  icon: Icon,
  title,
  description,
  color
}: {
  icon: any
  title: string
  description: string
  color: 'green' | 'purple' | 'blue' | 'orange'
}) {
  const colors = {
    green: 'from-green-500/20 to-emerald-500/10 border-green-500/30 text-green-400',
    purple: 'from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-400',
    blue: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    orange: 'from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-400'
  }

  return (
    <div className={cn(
      "p-6 rounded-2xl border bg-gradient-to-br backdrop-blur-sm transition-all hover:scale-105",
      colors[color]
    )}>
      <Icon className="w-10 h-10 mb-4" />
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  )
}

// Metric Card
function MetricCard({
  value,
  label,
  color
}: {
  value: string
  label: string
  color: 'green' | 'purple' | 'blue' | 'orange'
}) {
  const colors = {
    green: 'text-green-400',
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    orange: 'text-orange-400'
  }

  return (
    <div className="text-center">
      <div className={cn("text-4xl sm:text-5xl font-black mb-2", colors[color])}>
        {value}
      </div>
      <div className="text-sm text-zinc-500 uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}

// Showcase Card
function ShowcaseCard({ project }: { project: any }) {
  const typeColors = {
    icm: { border: 'border-green-500/50', badge: 'bg-green-500/20 text-green-400' },
    ccm: { border: 'border-purple-500/50', badge: 'bg-purple-500/20 text-purple-400' },
    meme: { border: 'border-orange-500/50', badge: 'bg-orange-500/20 text-orange-400' }
  } as const

  const colors = typeColors[project.type as keyof typeof typeColors]

  return (
    <div className={cn(
      "p-6 rounded-2xl border-2 bg-zinc-900/50 backdrop-blur-sm hover:scale-105 transition-all",
      colors.border
    )}>
      {/* Logo + Title */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={project.logoUrl}
          alt={project.title}
          className="w-16 h-16 rounded-xl"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg truncate">{project.title}</h3>
          <p className="text-sm text-zinc-400 truncate">{project.subtitle}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-xs text-zinc-500 mb-1">Raised</div>
          <div className="font-bold text-white">{project.metrics.raised}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500 mb-1">Holders</div>
          <div className="font-bold text-white">{project.metrics.holders}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500 mb-1">Success</div>
          <div className="font-bold text-green-400">{project.metrics.successRate}</div>
        </div>
      </div>

      {/* Badge */}
      <div className={cn("inline-flex px-3 py-1 rounded-lg text-xs font-medium", colors.badge)}>
        {project.type === 'icm' && '💼 Project'}
        {project.type === 'ccm' && '🎥 Creator'}
        {project.type === 'meme' && '🔥 Meme'}
      </div>
    </div>
  )
}

// Step Card
function StepCard({
  step,
  icon: Icon,
  title,
  description,
  color
}: {
  step: number
  icon: any
  title: string
  description: string
  color: 'green' | 'purple' | 'orange'
}) {
  const colors = {
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-violet-500',
    orange: 'from-orange-500 to-amber-500'
  }

  return (
    <div className="relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all">
      {/* Step Number */}
      <div className={cn(
        "absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl bg-gradient-to-r shadow-lg",
        colors[color]
      )}>
        {step}
      </div>

      {/* Icon */}
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br mt-4",
        colors[color]
      )}>
        <Icon className="w-7 h-7 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  )
}

// Launch Type Card
function LaunchTypeCard({
  type,
  icon: Icon,
  emoji,
  name,
  description,
  examples
}: {
  type: 'icm' | 'ccm' | 'meme'
  icon: any
  emoji: string
  name: string
  description: string
  examples: string[]
}) {
  const colors = {
    icm: { gradient: 'from-green-500 to-emerald-500', border: 'border-green-500/50', bg: 'bg-green-500/10' },
    ccm: { gradient: 'from-purple-500 to-violet-500', border: 'border-purple-500/50', bg: 'bg-purple-500/10' },
    meme: { gradient: 'from-orange-500 to-amber-500', border: 'border-orange-500/50', bg: 'bg-orange-500/10' }
  }

  const color = colors[type]

  return (
    <div className={cn(
      "p-6 rounded-2xl border-2 transition-all hover:scale-105",
      color.border,
      color.bg
    )}>
      {/* Icon */}
      <div className={cn(
        "w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
        color.gradient
      )}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        {emoji} {name}
      </h3>
      <p className="text-sm text-zinc-400 mb-4">{description}</p>

      {/* Examples */}
      <div className="flex flex-wrap gap-2">
        {examples.map((example, i) => (
          <span
            key={i}
            className="px-2 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-400"
          >
            {example}
          </span>
        ))}
      </div>
    </div>
  )
}