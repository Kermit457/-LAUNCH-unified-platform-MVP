"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Rocket, Shield, Users, Network, TrendingUp, Target,
  CheckCircle2, ArrowRight, Lightbulb, Lock
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { SubmitLaunchDrawer } from '@/components/launch/SubmitLaunchDrawer'
// import { useCreateCurve } from '@/hooks/useCreateCurve'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'

export default function LaunchPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  // const { createCurve, isCreating, error } = useCreateCurve()
  const { username } = useUser()
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      console.log('Launch submitted:', data)

      // const curveId = await createCurve({
      //   name: data.title,
      //   symbol: data.subtitle,
      //   description: data.description,
      //   logoFile: data.logoFile,
      //   scope: data.scope,
      //   platforms: data.platforms,
      //   twitterHandle: username || 'default',
      // })

      setDrawerOpen(false)

      // if (curveId) {
      //   router.push(`/launch/${curveId}`)
      // }
    } catch (err) {
      console.error('Error creating curve:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-16">

        {/* Hero Section - TINY on mobile */}
        <div className="text-center mb-3 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 md:border-2 text-[10px] md:text-sm font-bold mb-2 md:mb-6"
          >
            <Rocket className="w-3 h-3 md:w-5 md:h-5 text-[#00FF88]" />
            <span className="text-[#00FF88]">
              Pre-Launch Protocol
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-[#00FF88] mb-2 md:mb-6"
          >
            20x Higher Launch Success
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-lg md:text-xl lg:text-2xl text-zinc-300 max-w-3xl mx-auto mb-2 md:mb-4"
          >
            Sniper and bundle proof. Community first.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-xs md:text-lg text-zinc-400 max-w-2xl mx-auto mb-3 md:mb-12 hidden sm:block"
          >
            ICM Network = Find the perfect team. Incubation, platform acceleration, launch advisory. Building in public.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 md:gap-3 px-4 py-2 md:px-8 md:py-4 rounded-lg md:rounded-xl text-black font-bold text-sm md:text-lg transition-all bg-[#00FF88] hover:bg-[#00FFFF] hover:scale-105"
          >
            <Rocket className="w-4 h-4 md:w-6 md:h-6" />
            Start Your Launch
            <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
          </motion.button>
        </div>

        {/* Core Features - 2x3 Grid */}
        <div className="mb-3 md:mb-20">
          <h2 className="text-base md:text-3xl font-bold text-center mb-3 md:mb-12 text-white">
            Why Our Pre-Launch Protocol
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            <FeatureCard
              icon={Shield}
              title="Sniper & Bundle Proof"
              description="Advanced anti-bot protection ensures fair distribution and organic price discovery"
              color="cyan"
            />
            <FeatureCard
              icon={Users}
              title="Community First"
              description="Build engaged community before launch through collaborative token rewards"
              color="green"
            />
            <FeatureCard
              icon={Network}
              title="ICM Network"
              description="Find the perfect team from our network of builders, marketers, and contributors"
              color="yellow"
            />
            <FeatureCard
              icon={Target}
              title="Incubation Support"
              description="Platform acceleration and dedicated launch advisory from experienced teams"
              color="blue"
            />
            <FeatureCard
              icon={Lightbulb}
              title="Building in Public"
              description="Transparent development increases trust and attracts early supporters"
              color="purple"
            />
            <FeatureCard
              icon={TrendingUp}
              title="20x Success Rate"
              description="Proven protocol with significantly higher success rate vs traditional launches"
              color="orange"
            />
          </div>
        </div>

        {/* Success Stats */}
        <div className="mb-3 md:mb-20">
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl md:rounded-3xl border md:border-2 border-[#00FFFF]/20 p-4 md:p-12">
            <h3 className="text-base md:text-3xl font-bold text-center mb-3 md:mb-10 text-white">Launch Success Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
              <StatCard
                value="20x"
                label="Higher Success"
                color="cyan"
              />
              <StatCard
                value="94%"
                label="Community Retention"
                color="green"
              />
              <StatCard
                value="$12.4M"
                label="Total Raised"
                color="yellow"
              />
              <StatCard
                value="248"
                label="Projects Launched"
                color="purple"
              />
            </div>
          </div>
        </div>

        {/* How It Works - 4 Steps */}
        <div className="mb-3 md:mb-20">
          <h2 className="text-base md:text-3xl font-bold text-center mb-2 md:mb-4 text-white">
            Launch Protocol Steps
          </h2>
          <p className="text-center text-zinc-400 mb-3 md:mb-12 text-xs md:text-lg max-w-2xl mx-auto hidden sm:block">
            Our proven 4-step process ensures maximum success and community engagement
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
            <ProcessStep
              step={1}
              icon={Users}
              title="Build Your Team"
              description="Use ICM Network to find perfect co-founders, developers, marketers, and community managers"
              color="cyan"
            />
            <ProcessStep
              step={2}
              icon={Lightbulb}
              title="Incubation Phase"
              description="Get platform acceleration, launch advisory, and strategic guidance from experienced teams"
              color="green"
            />
            <ProcessStep
              step={3}
              icon={Shield}
              title="Protected Pre-Launch"
              description="Build in public with community rewards. Anti-sniper protection ensures fair distribution"
              color="yellow"
            />
            <ProcessStep
              step={4}
              icon={Rocket}
              title="Pump.fun Launch"
              description="Graduate to Pump.fun with engaged community, proven traction, and anti-bundle protection"
              color="purple"
            />
          </div>
        </div>

        {/* Protection Features */}
        <div className="mb-3 md:mb-20">
          <h2 className="text-base md:text-3xl font-bold text-center mb-3 md:mb-12 text-white">
            Anti-Sniper Protection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
            <ProtectionCard
              icon={Lock}
              title="Bundle Prevention"
              description="Advanced detection prevents multi-wallet bundle attacks"
            />
            <ProtectionCard
              icon={Shield}
              title="Fair Launch"
              description="Progressive unlock ensures organic price discovery"
            />
            <ProtectionCard
              icon={CheckCircle2}
              title="Verified Humans"
              description="Community verification reduces bot participation"
            />
          </div>
        </div>

        {/* Benefits List */}
        <div className="mb-3 md:mb-20">
          <div className="bg-gradient-to-br from-[#00FFFF]/5 via-[#00FF88]/5 to-[#FFD700]/5 rounded-xl md:rounded-3xl border md:border-2 border-[#00FFFF]/20 p-4 md:p-12">
            <h2 className="text-base md:text-3xl font-bold text-center mb-3 md:mb-12 text-white">
              What You Get
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 max-w-4xl mx-auto">
              <BenefitItem text="Access to ICM Network talent pool" />
              <BenefitItem text="Dedicated launch advisory team" />
              <BenefitItem text="Platform acceleration program" />
              <BenefitItem text="Community building tools" />
              <BenefitItem text="Anti-sniper smart contracts" />
              <BenefitItem text="Marketing & growth support" />
              <BenefitItem text="Token economics guidance" />
              <BenefitItem text="Post-launch monitoring" />
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="inline-block p-4 md:p-12 rounded-xl md:rounded-3xl bg-zinc-900/80 border md:border-2 border-[#00FFFF]/30 backdrop-blur-xl max-w-3xl">
            <h3 className="text-base md:text-3xl font-bold text-white mb-2 md:mb-4">
              Ready to Launch Successfully?
            </h3>
            <p className="text-xs md:text-lg text-zinc-300 mb-3 md:mb-8 hidden sm:block">
              Join 248+ projects that achieved 20x higher success rate through our protocol
            </p>
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 md:gap-3 px-4 py-2 md:px-10 md:py-5 rounded-lg md:rounded-xl text-black font-bold text-sm md:text-xl transition-all bg-[#00FFFF] hover:bg-[#00FF88] hover:scale-105"
            >
              <Rocket className="w-4 h-4 md:w-6 md:h-6" />
              Start Pre-Launch Protocol
              <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

      </div>

      {/* Launch Wizard Drawer */}
      <SubmitLaunchDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        isLoading={false}
        error={null}
      />
    </div>
  )
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
  color
}: {
  icon: any
  title: string
  description: string
  color: 'cyan' | 'green' | 'yellow' | 'blue' | 'purple' | 'orange'
}) {
  const colors = {
    cyan: {
      bg: 'from-[#00FFFF]/10 to-[#00FFFF]/5',
      border: 'border-[#00FFFF]/30',
      icon: 'text-[#00FFFF]'
    },
    green: {
      bg: 'from-[#00FF88]/10 to-[#00FF88]/5',
      border: 'border-[#00FF88]/30',
      icon: 'text-[#00FF88]'
    },
    yellow: {
      bg: 'from-[#FFD700]/10 to-[#FFD700]/5',
      border: 'border-[#FFD700]/30',
      icon: 'text-[#FFD700]'
    },
    blue: {
      bg: 'from-[#0088FF]/10 to-[#0088FF]/5',
      border: 'border-[#0088FF]/30',
      icon: 'text-[#0088FF]'
    },
    purple: {
      bg: 'from-[#8800FF]/10 to-[#8800FF]/5',
      border: 'border-[#8800FF]/30',
      icon: 'text-[#8800FF]'
    },
    orange: {
      bg: 'from-[#FF8800]/10 to-[#FF8800]/5',
      border: 'border-[#FF8800]/30',
      icon: 'text-[#FF8800]'
    }
  }

  const scheme = colors[color]

  return (
    <div className={cn(
      "p-3 md:p-6 rounded-lg md:rounded-2xl border md:border-2 bg-gradient-to-br backdrop-blur-sm transition-all hover:scale-105",
      scheme.bg,
      scheme.border
    )}>
      <Icon className={cn("w-6 h-6 md:w-12 md:h-12 mb-2 md:mb-4", scheme.icon)} />
      <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-3">{title}</h3>
      <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  )
}

// Stat Card Component
function StatCard({
  value,
  label,
  color
}: {
  value: string
  label: string
  color: 'cyan' | 'green' | 'yellow' | 'purple'
}) {
  const colors = {
    cyan: 'text-[#00FFFF]',
    green: 'text-[#00FF88]',
    yellow: 'text-[#FFD700]',
    purple: 'text-[#8800FF]'
  }

  return (
    <div className="text-center">
      <div className={cn("text-2xl md:text-5xl lg:text-6xl font-black mb-1 md:mb-3", colors[color])}>
        {value}
      </div>
      <div className="text-[10px] md:text-sm text-zinc-400 uppercase tracking-wider font-bold">
        {label}
      </div>
    </div>
  )
}

// Process Step Component
function ProcessStep({
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
  color: 'cyan' | 'green' | 'yellow' | 'purple'
}) {
  const colors = {
    cyan: {
      number: 'bg-[#00FFFF] text-black',
      icon: 'bg-[#00FFFF]/20 border-[#00FFFF]/30 text-[#00FFFF]'
    },
    green: {
      number: 'bg-[#00FF88] text-black',
      icon: 'bg-[#00FF88]/20 border-[#00FF88]/30 text-[#00FF88]'
    },
    yellow: {
      number: 'bg-[#FFD700] text-black',
      icon: 'bg-[#FFD700]/20 border-[#FFD700]/30 text-[#FFD700]'
    },
    purple: {
      number: 'bg-[#8800FF] text-white',
      icon: 'bg-[#8800FF]/20 border-[#8800FF]/30 text-[#8800FF]'
    }
  }

  const scheme = colors[color]

  return (
    <div className="relative p-3 md:p-8 rounded-lg md:rounded-2xl bg-zinc-900/50 border md:border-2 border-zinc-800 hover:border-zinc-700 transition-all">
      {/* Step Number */}
      <div className={cn(
        "absolute -top-3 -left-3 md:-top-5 md:-left-5 w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center font-black text-sm md:text-2xl",
        scheme.number
      )}>
        {step}
      </div>

      {/* Icon */}
      <div className={cn(
        "w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-5 border md:border-2 mt-2 md:mt-4",
        scheme.icon
      )}>
        <Icon className="w-5 h-5 md:w-8 md:h-8" />
      </div>

      {/* Content */}
      <h3 className="text-sm md:text-2xl font-bold text-white mb-1 md:mb-3">{title}</h3>
      <p className="text-xs md:text-base text-zinc-400 leading-relaxed">{description}</p>
    </div>
  )
}

// Protection Card Component
function ProtectionCard({
  icon: Icon,
  title,
  description
}: {
  icon: any
  title: string
  description: string
}) {
  return (
    <div className="p-3 md:p-6 rounded-lg md:rounded-2xl bg-zinc-900/50 border md:border-2 border-[#FF0040]/20 hover:border-[#FF0040]/40 transition-all">
      <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-[#FF0040]/20 border md:border-2 border-[#FF0040]/30 flex items-center justify-center mb-2 md:mb-4">
        <Icon className="w-4 h-4 md:w-7 md:h-7 text-[#FF0040]" />
      </div>
      <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-3">{title}</h3>
      <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  )
}

// Benefit Item Component
function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-1.5 md:gap-3">
      <CheckCircle2 className="w-3.5 h-3.5 md:w-6 md:h-6 text-[#00FF88] flex-shrink-0 mt-0.5" />
      <span className="text-xs md:text-base text-zinc-300">{text}</span>
    </div>
  )
}
