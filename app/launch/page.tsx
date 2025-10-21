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
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white pb-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-16">

        {/* Page Title - Mobile */}
        <div className="md:hidden mb-3">
          <h1 className="text-xl font-black text-[#00FF88]">Launch</h1>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-6 md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-3 md:mb-6"
          >
            Stop Getting <span className="text-red-500">Sniped</span>.
            <br/>
            <span className="text-[#00FF88]">Launch Fair</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-xl md:text-2xl lg:text-3xl text-zinc-400 max-w-4xl mx-auto mb-6 md:mb-10"
          >
            Traditional launches fail 99.5% of the time. We give you <span className="text-[#00FFFF] font-bold">50% success rate</span>.
          </motion.p>

          {/* Success Rate Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto mb-6 md:mb-12"
          >
            <div className="grid grid-cols-2 gap-2 md:gap-6">
              {/* Traditional Launch - Red Theme */}
              <div className="relative p-3 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-red-950/40 to-red-900/20 border border-red-500/30">
                <div className="absolute top-2 right-2 text-[10px] md:text-sm font-bold text-red-400 bg-red-950/60 px-1.5 py-0.5 md:px-2 md:py-1 rounded">RISKY</div>
                <h3 className="text-base md:text-2xl font-bold text-red-400 mb-2 md:mb-4">Traditional</h3>
                <div className="text-3xl md:text-6xl font-black text-red-500 mb-1 md:mb-3">0.5%</div>
                <div className="text-[10px] md:text-sm text-zinc-400 mb-2 md:mb-4">Success Rate</div>
                <div className="space-y-1 md:space-y-2 text-left">
                  <div className="flex items-start gap-1.5 md:gap-2 text-[10px] md:text-sm text-red-300">
                    <span className="text-red-500 text-xs md:text-base">✗</span>
                    <span>Snipers take 80% supply</span>
                  </div>
                  <div className="flex items-start gap-1.5 md:gap-2 text-[10px] md:text-sm text-red-300">
                    <span className="text-red-500 text-xs md:text-base">✗</span>
                    <span>Bots farm retail buyers</span>
                  </div>
                  <div className="flex items-start gap-1.5 md:gap-2 text-[10px] md:text-sm text-red-300">
                    <span className="text-red-500 text-xs md:text-base">✗</span>
                    <span>Zero community</span>
                  </div>
                  <div className="flex items-start gap-1.5 md:gap-2 text-[10px] md:text-sm text-red-300">
                    <span className="text-red-500 text-xs md:text-base">✗</span>
                    <span>Instant dump</span>
                  </div>
                </div>
              </div>

              {/* LaunchReady - Green Theme */}
              <div className="relative p-3 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-950/40 to-cyan-900/20 border border-[#00FF88]/50 shadow-lg shadow-[#00FF88]/20">
                <div className="absolute top-2 right-2 text-[10px] md:text-sm font-bold text-[#00FF88] bg-emerald-950/60 px-1.5 py-0.5 md:px-2 md:py-1 rounded">SAFE</div>
                <h3 className="text-base md:text-2xl font-bold text-[#00FF88] mb-2 md:mb-4">LaunchReady</h3>
                <div className="text-3xl md:text-6xl font-black text-[#00FF88] mb-1 md:mb-3">50%</div>
                <div className="text-[10px] md:text-sm text-zinc-400 mb-2 md:mb-4">Success Rate</div>
                <div className="space-y-1 md:space-y-2 text-left">
                  <div className="flex items-start gap-1.5 md:gap-2 text-[10px] md:text-sm text-emerald-300">
                    <span className="text-[#00FF88] text-xs md:text-base">✓</span>
                    <span>Anti-sniper protection</span>
                  </div>
                  <div className="flex items-start gap-1.5 md:gap-2 text-[10px] md:text-sm text-emerald-300">
                    <span className="text-[#00FF88] text-xs md:text-base">✓</span>
                    <span>Fair 20-30% distribution</span>
                  </div>
                  <div className="flex items-start gap-1.5 md:gap-2 text-[10px] md:text-sm text-emerald-300">
                    <span className="text-[#00FF88] text-xs md:text-base">✓</span>
                    <span>Pre-launch community</span>
                  </div>
                  <div className="flex items-start gap-1.5 md:gap-2 text-[10px] md:text-sm text-emerald-300">
                    <span className="text-[#00FF88] text-xs md:text-base">✓</span>
                    <span>Holder rewards</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 rounded-xl text-black font-bold text-base md:text-xl transition-all bg-[#00FF88] hover:bg-[#00FFFF] hover:scale-105 shadow-lg shadow-[#00FF88]/30"
          >
            <Rocket className="w-5 h-5 md:w-7 md:h-7" />
            Launch Fair Now
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        </div>

        {/* How Bonding Curve Works */}
        <div className="mb-4 md:mb-20">
          <h2 className="text-lg md:text-3xl font-bold text-center mb-3 md:mb-8 text-white">
            How The Bonding Curve Works
          </h2>

          {/* Visual Curve - Redesigned */}
          <div className="relative mb-4 md:mb-8 p-4 md:p-8 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800/90 border border-zinc-700/50 shadow-2xl">
            <svg viewBox="0 0 500 240" className="w-full h-auto">
              <defs>
                {/* Grid Pattern */}
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#18181b" strokeWidth="0.5" opacity="0.5"/>
                </pattern>

                {/* Gradients */}
                <linearGradient id="preLaunchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00FF88" />
                  <stop offset="50%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#00FFFF" />
                </linearGradient>

                <linearGradient id="postLaunchGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#00FFFF" />
                  <stop offset="100%" stopColor="#9945FF" />
                </linearGradient>

                <linearGradient id="extraFundingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00FFFF" />
                  <stop offset="100%" stopColor="#9945FF" />
                </linearGradient>

                {/* Glow filters */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Background Grid */}
              <rect width="500" height="240" fill="url(#grid)"/>

              {/* Axes with glow */}
              <line x1="50" y1="195" x2="470" y2="195" stroke="#3f3f46" strokeWidth="2"/>
              <line x1="50" y1="195" x2="50" y2="30" stroke="#3f3f46" strokeWidth="2"/>

              {/* PRE-LAUNCH Phase Background */}
              <rect x="50" y="30" width="150" height="165" fill="#00FF88" opacity="0.05" rx="8"/>

              {/* Pre-Launch Bonding Curve */}
              <path
                d="M 50 195 Q 90 170, 130 140 Q 170 105, 200 80"
                fill="none"
                stroke="url(#preLaunchGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                filter="url(#glow)"
              />

              {/* 32 SOL Launch Threshold Line */}
              <line x1="200" y1="195" x2="200" y2="80" stroke="#00FFFF" strokeWidth="3" strokeDasharray="8,4" opacity="0.6"/>

              {/* Extra Funding (Optional) - Dashed curves */}
              <path
                d="M 200 80 Q 250 55, 300 40"
                fill="none"
                stroke="url(#extraFundingGradient)"
                strokeWidth="4"
                strokeDasharray="10,5"
                opacity="0.5"
              />
              <path
                d="M 300 40 Q 350 30, 400 25"
                fill="none"
                stroke="#9945FF"
                strokeWidth="3.5"
                strokeDasharray="10,6"
                opacity="0.3"
              />

              {/* Key Points with Glows */}
              <circle cx="50" cy="195" r="8" fill="#00FF88" stroke="#fff" strokeWidth="2" filter="url(#glow)"/>
              <circle cx="200" cy="80" r="10" fill="#00FFFF" stroke="#fff" strokeWidth="2.5" filter="url(#glow)"/>

              {/* Connection Line from LAUNCH READY to Rocket (Dashed) */}
              <line x1="200" y1="80" x2="265" y2="195" stroke="#FFD700" strokeWidth="3" strokeDasharray="8,4" opacity="0.7"/>

              {/* ROCKET LAUNCH INDICATOR */}
              <text x="265" y="205" fontSize="28" filter="url(#glow)">🚀</text>

              {/* Post-Launch Trading Chart (Volatile Growth) */}
              <path
                d="M 280 195 L 295 185 L 310 190 L 325 175 L 340 180 L 355 160 L 370 165 L 385 145 L 400 150 L 415 125 L 430 130 L 445 105 L 460 100"
                fill="none"
                stroke="url(#postLaunchGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />

              {/* Arrow at end of trajectory */}
              <path d="M 460 100 L 455 105 L 458 98 Z" fill="#9945FF" filter="url(#glow)"/>

              {/* Labels - Phase 1: PRE-LAUNCH - ON TOP OF GREEN BOX */}
              <text x="125" y="25" fill="#00FF88" fontSize="14" fontWeight="bold" textAnchor="middle">PRE-LAUNCH</text>

              {/* Labels - 32 SOL Marker */}
              <rect x="160" y="202" width="80" height="22" rx="11" fill="#00FFFF" opacity="0.15"/>
              <text x="200" y="217" fill="#00FFFF" fontSize="13" fontWeight="bold" textAnchor="middle">32 SOL</text>
              <text x="200" y="55" fill="#00FFFF" fontSize="13" fontWeight="bold" textAnchor="middle">LAUNCH READY</text>

              {/* Labels - LAUNCH ON PUMP */}
              <text x="370" y="80" fill="#FFD700" fontSize="14" fontWeight="bold" textAnchor="middle">LAUNCH ON PUMP</text>

              {/* Start Label */}
              <text x="50" y="218" fill="#00FF88" fontSize="11" fontWeight="bold" textAnchor="middle">Start</text>
            </svg>
          </div>

          {/* 32 SOL Distribution Breakdown */}
          <div className="mb-4 md:mb-8 p-3 md:p-6 rounded-xl bg-[#00FFFF]/5 border border-[#00FFFF]/20">
            <h3 className="text-sm md:text-xl font-bold text-[#00FFFF] mb-2 md:mb-4 text-center">32 SOL Distribution Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <div className="p-2 md:p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs md:text-sm font-bold text-[#00FF88] mb-1">~8 SOL</div>
                <div className="text-[9px] md:text-xs text-zinc-400">Buy 20% Supply</div>
              </div>
              <div className="p-2 md:p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs md:text-sm font-bold text-[#FFD700] mb-1">~20%</div>
                <div className="text-[9px] md:text-xs text-zinc-400">Airdrop Key Holders</div>
              </div>
              <div className="p-2 md:p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs md:text-sm font-bold text-[#00FFFF] mb-1">2.99 SOL</div>
                <div className="text-[9px] md:text-xs text-zinc-400">DEX Boost (Max 39.99)</div>
              </div>
              <div className="p-2 md:p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs md:text-sm font-bold text-[#9945FF] mb-1">Rest</div>
                <div className="text-[9px] md:text-xs text-zinc-400">Marketing & TG Promo</div>
              </div>
            </div>
            <div className="mt-2 md:mt-3 text-center">
              <p className="text-[9px] md:text-xs text-zinc-500">20-30% Max Supply Distributed | 70-80% Reserved for Community Growth</p>
            </div>
          </div>

          {/* Simple Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="p-3 md:p-4 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/30">
              <div className="text-2xl md:text-3xl font-bold text-[#00FF88] mb-1 md:mb-2">1. Early Entry</div>
              <p className="text-xs md:text-sm text-zinc-300">
                Start buying at the lowest price. As more people buy, the price increases automatically.
              </p>
            </div>

            <div className="p-3 md:p-4 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
              <div className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-1 md:mb-2">2. Fair Growth</div>
              <p className="text-xs md:text-sm text-zinc-300">
                No snipers or bots. The curve ensures everyone gets a fair price based on when they join.
              </p>
            </div>

            <div className="p-3 md:p-4 rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/30">
              <div className="text-2xl md:text-3xl font-bold text-[#00FFFF] mb-1 md:mb-2">3. Pump Launch</div>
              <p className="text-xs md:text-sm text-zinc-300">
                When the curve fills, liquidity moves to Pump.fun automatically. Early supporters profit most.
              </p>
            </div>
          </div>
        </div>

        {/* Core Features - 2x3 Grid */}
        <div className="mb-2 md:mb-20">
          <h2 className="text-[10px] md:text-3xl font-bold text-center mb-1.5 md:mb-12 text-white">
            Why Our Pre-Launch Protocol
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-6">
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
        <div className="mb-2 md:mb-20 hidden">
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
        <div className="mb-2 md:mb-20 hidden">
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
        <div className="mb-2 md:mb-20 hidden">
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
        <div className="mb-2 md:mb-20 hidden">
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
        <div className="text-center hidden">
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
      "p-1.5 md:p-6 rounded-md md:rounded-2xl border md:border-2 bg-gradient-to-br backdrop-blur-sm transition-all hover:scale-105",
      scheme.bg,
      scheme.border
    )}>
      <Icon className={cn("w-12 h-12 md:w-12 md:h-12 mb-1 md:mb-4", scheme.icon)} />
      <h3 className="text-[9px] md:text-xl font-bold text-white mb-0.5 md:mb-3">{title}</h3>
      <p className="text-[7px] md:text-sm text-zinc-400 leading-tight md:leading-relaxed">{description}</p>
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
