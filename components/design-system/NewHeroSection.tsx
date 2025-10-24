// LaunchOS Hero Section - Matching the exact design
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, Gift, PlaySquare, Users, Wallet, LineChart,
  Zap, BarChart3, Megaphone, Radio, Network, Cpu
} from 'lucide-react';

export default function NewHeroSection({ onLaunchApp }: { onLaunchApp?: () => void }) {
  // App grid configuration - 3x4 grid
  const apps = [
    {
      icon: Rocket,
      label: 'Launch',
      gradient: 'from-[#D1FD0A] to-[#B8E008]',
      borderColor: '#D1FD0A'
    },
    {
      icon: LineChart,
      label: 'Earn',
      gradient: 'from-orange-500 to-amber-600',
      borderColor: 'rgb(251, 146, 60)'
    },
    {
      icon: Users,
      label: 'Network',
      gradient: 'from-cyan-500 to-blue-600',
      borderColor: 'rgb(6, 182, 212)'
    },
    {
      icon: Gift,
      label: 'Bounty',
      gradient: 'from-red-500 to-red-600',
      borderColor: 'rgb(239, 68, 68)'
    },
    {
      icon: PlaySquare,
      label: 'Clips',
      gradient: 'from-blue-500 to-indigo-600',
      borderColor: 'rgb(59, 130, 246)'
    },
    {
      icon: Wallet,
      label: 'Wallet',
      gradient: 'from-emerald-500 to-green-600',
      borderColor: 'rgb(16, 185, 129)'
    },
    {
      icon: Megaphone,
      label: 'Campaigns',
      gradient: 'from-pink-500 to-rose-600',
      borderColor: 'rgb(236, 72, 153)'
    },
    {
      icon: BarChart3,
      label: 'Predictions',
      gradient: 'from-teal-500 to-emerald-600',
      borderColor: 'rgb(20, 184, 166)'
    },
    {
      icon: Cpu,
      label: 'Agents',
      gradient: 'from-slate-500 to-zinc-600',
      borderColor: 'rgb(148, 163, 184)'
    },
    {
      icon: Radio,
      label: 'OBS',
      gradient: 'from-indigo-500 to-lime-600',
      borderColor: 'rgb(99, 102, 241)'
    },
    {
      icon: Network,
      label: 'Frenwork',
      gradient: 'from-lime-500 to-green-600',
      borderColor: 'rgb(132, 204, 22)'
    }
  ];

  const stats = [
    {
      label: 'Total Contributions',
      value: '$1.4M',
      color: 'text-violet-400'
    },
    {
      label: 'Launches',
      value: '1,287',
      color: 'text-cyan-400'
    },
    {
      label: 'Bounties',
      value: '643',
      color: 'text-orange-400'
    },
    {
      label: 'Earnings Paid',
      value: '$325K',
      color: 'text-emerald-400'
    },
  ];

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Background gradient - lime mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-lime-600/30 rounded-full blur-[200px]" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-sm text-zinc-400"
            >
              <Zap className="h-4 w-4" />
              <span>Live OS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Solana • OBS • Agents</span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight">
                The Creator's<br />
                Operating System
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-zinc-400 max-w-xl"
            >
              Launch, earn, and collaborate in one place. Instant access to campaigns, bounties, predictions, widgets, and analytics.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={onLaunchApp}
                className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors"
              >
                Launch App
              </button>
              <button className="px-8 py-4 border border-zinc-700 text-white font-semibold rounded-full hover:bg-zinc-900/50 transition-colors">
                Explore Launches
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8"
            >
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - App Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            <div className="grid grid-cols-3 gap-4">
              {apps.map((app, index) => (
                <motion.div
                  key={app.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group cursor-pointer"
                >
                  {/* App container with gradient border */}
                  <div
                    className="relative rounded-3xl p-[2px] overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${app.borderColor}, transparent)`
                    }}
                  >
                    {/* Inner container */}
                    <div className="bg-zinc-950 rounded-3xl p-6 h-full flex flex-col items-center justify-center space-y-3 group-hover:bg-zinc-900/80 transition-colors">
                      {/* Icon */}
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${app.gradient}`}>
                        <app.icon className="h-6 w-6 text-white" />
                      </div>
                      {/* Label */}
                      <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                        {app.label}
                      </span>
                    </div>
                  </div>

                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"
                    style={{
                      background: `linear-gradient(135deg, ${app.borderColor}, transparent)`
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-lime-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}