'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench, Gift, Rocket, Video, Users, Zap,
  Target, TrendingUp, Share2, DollarSign, Calendar, BarChart3
} from 'lucide-react';
import { GlassCard, PremiumButton } from '@/components/design-system/DesignSystemShowcase';

// Tool categories with tools
const toolCategories = [
  {
    name: 'OBS Widgets',
    color: 'from-blue-500 to-cyan-500',
    tools: [
      {
        id: 'alerts',
        title: 'Stream Alerts',
        description: 'Real-time alerts for donations, followers, and more',
        icon: Zap,
        badge: 'Popular'
      },
      {
        id: 'overlays',
        title: 'Custom Overlays',
        description: 'Beautiful overlays for your stream',
        icon: Video,
        badge: null
      },
      {
        id: 'chat-widget',
        title: 'Chat Widget',
        description: 'Interactive chat overlay with engagement tools',
        icon: Users,
        badge: null
      }
    ]
  },
  {
    name: 'Growth & Campaigns',
    color: 'from-purple-500 to-fuchsia-500',
    tools: [
      {
        id: 'clipping',
        title: 'Clipping Campaign',
        description: 'Create viral clips and reward your community',
        icon: Video,
        badge: 'Hot'
      },
      {
        id: 'raid',
        title: 'Raid Campaign',
        description: 'Coordinate raids and grow your network',
        icon: Users,
        badge: null
      },
      {
        id: 'bounty',
        title: 'Bounty System',
        description: 'Set challenges and reward completions',
        icon: Target,
        badge: 'New'
      }
    ]
  },
  {
    name: 'Launch',
    color: 'from-orange-500 to-red-500',
    tools: [
      {
        id: 'token-launch',
        title: 'Token Launch',
        description: 'Launch your own token on Solana',
        icon: Rocket,
        badge: 'Popular'
      },
      {
        id: 'nft-campaign',
        title: 'NFT Campaign',
        description: 'Create and distribute NFTs to your community',
        icon: Share2,
        badge: null
      }
    ]
  },
  {
    name: 'Creator Ops',
    color: 'from-green-500 to-emerald-500',
    tools: [
      {
        id: 'analytics',
        title: 'Analytics Dashboard',
        description: 'Track your growth and engagement metrics',
        icon: BarChart3,
        badge: null
      },
      {
        id: 'scheduler',
        title: 'Content Scheduler',
        description: 'Plan and schedule your streams and content',
        icon: Calendar,
        badge: null
      },
      {
        id: 'monetization',
        title: 'Monetization Hub',
        description: 'Manage earnings, sponsors, and payouts',
        icon: DollarSign,
        badge: 'Beta'
      }
    ]
  }
];

// Tool Card Component
const ToolCard = ({ tool, categoryColor }: { tool: any; categoryColor: string }) => {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative group cursor-pointer"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${categoryColor} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity`} />

      <GlassCard className="relative p-6 h-full">
        {/* Badge */}
        {tool.badge && (
          <div className="absolute top-4 right-4">
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-gradient-to-r ${categoryColor} text-white`}>
              {tool.badge}
            </span>
          </div>
        )}

        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColor} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-zinc-400 transition-all">
          {tool.title}
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          {tool.description}
        </p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          Launch Tool
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </GlassCard>
    </motion.div>
  );
};

// Main Tools Page
export default function DesignTestToolsPage() {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
            >
              <Wrench className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Creator Tools
            </h1>
          </div>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Widgets, campaigns, launches, and monetization tools for streamers & creators
          </p>
        </motion.div>

        {/* Tool Categories */}
        <div className="space-y-16">
          {toolCategories.map((category, catIndex) => (
            <motion.section
              key={category.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${category.color}`} />
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                  {category.name}
                </h2>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool, toolIndex) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: toolIndex * 0.1 }}
                  >
                    <ToolCard tool={tool} categoryColor={category.color} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Rewards & Earnings Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 blur-3xl" />

            <GlassCard className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    Rewards & Payouts
                  </h2>
                  <p className="text-zinc-400">
                    Manage your earnings, claim rewards, and track payouts
                  </p>
                </div>
                <PremiumButton variant="primary" className="px-6 py-3">
                  View Earnings
                </PremiumButton>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Pending', value: '$234.50', color: 'from-yellow-500 to-orange-500' },
                  { label: 'Claimable', value: '$567.80', color: 'from-green-500 to-emerald-500' },
                  { label: 'Total Earned', value: '$12,430', color: 'from-blue-500 to-cyan-500' },
                  { label: 'Points', value: '1,840', color: 'from-purple-500 to-fuchsia-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="relative group cursor-pointer"
                  >
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur transition-opacity`} />
                    <div className="relative p-4 rounded-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800">
                      <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">
                        {stat.label}
                      </div>
                      <div className={`text-2xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
