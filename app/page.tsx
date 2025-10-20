// LaunchOS Landing Page
// Complete showcase of the new native app-like design system

'use client';

import React, { useState } from 'react';
import {
  Rocket, Gift, Users,
  Radio, Network,
  ChevronRight, Sparkles, Target,
  TrendingUp, Clock, Eye, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  GlassCard,
  PremiumButton,
  PerfectHeroSection,
  SheetModal,
  StoriesViewer,
  InteractiveListItem,
  SegmentedControl,
  SectionDivider,
  ScrollNavigation
} from '@/components/design-system';

// Import new sections
import { NetworkSection } from '@/components/landing/NetworkSection';
import { LiveSection } from '@/components/landing/LiveSection';

// Section navigation config
const navigationSections = [
  { id: 'earn', label: 'EARN', icon: Target, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 'network', label: 'NETWORK', icon: Network, gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)' },
  { id: 'live', label: 'LIVE', icon: Radio, gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  { id: 'interactive', label: 'DEMOS', icon: Sparkles, gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
];

// ============= PAGE SECTIONS =============

// Launches Grid Section - Top & Upcoming
const LaunchesGridSection = () => {
  const topLaunches = [
    {
      id: 1,
      title: 'ICM.RUN',
      subtitle: 'Revolutionary trading platform for ICM tokens',
      logo: '🚀',
      upvotes: 342,
      comments: 89,
      views: 2547,
      scope: 'ICM',
      trending: true
    },
    {
      id: 2,
      title: 'LaunchOS Mobile',
      subtitle: 'Native mobile app with advanced features',
      logo: '📱',
      upvotes: 278,
      comments: 64,
      views: 1893,
      scope: 'CCM',
      trending: true
    }
  ];

  const upcomingLaunches = [
    {
      id: 3,
      title: 'NFT Marketplace',
      subtitle: 'Trade and discover exclusive NFT collections',
      logo: '🎨',
      launchDate: '3 days',
      followers: 456,
      scope: 'ICM'
    },
    {
      id: 4,
      title: 'DeFi Yield Optimizer',
      subtitle: 'Maximize your yields across multiple protocols',
      logo: '💎',
      launchDate: '5 days',
      followers: 312,
      scope: 'CCM'
    }
  ];

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 text-transparent bg-clip-text">
              Hunt Your next ICM CCM Launch
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Top Launches */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <h3 className="text-2xl font-bold text-white">Top Launches</h3>
            </div>
            <div className="space-y-4">
              {topLaunches.map((launch) => (
                <motion.div
                  key={launch.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                  <div className="relative p-5 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-orange-500/50 transition-all">
                    <div className="flex gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-2xl flex-shrink-0">
                        {launch.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h4 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">{launch.title}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${launch.scope === 'ICM' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'}`}>
                            {launch.scope}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1">{launch.subtitle}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-800">
                        <div className="flex items-center gap-1 mb-0.5">
                          <ChevronRight className="w-3 h-3 text-orange-400 rotate-[-90deg]" />
                          <span className="text-[10px] text-zinc-500">Upvotes</span>
                        </div>
                        <div className="text-sm font-bold text-white">{launch.upvotes}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-800">
                        <div className="flex items-center gap-1 mb-0.5">
                          <MessageSquare className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] text-zinc-500">Comments</span>
                        </div>
                        <div className="text-sm font-bold text-white">{launch.comments}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-800">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Eye className="w-3 h-3 text-green-400" />
                          <span className="text-[10px] text-zinc-500">Views</span>
                        </div>
                        <div className="text-sm font-bold text-white">{launch.views}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Launches */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">Upcoming Launches</h3>
            </div>
            <div className="space-y-4">
              {upcomingLaunches.map((launch) => (
                <motion.div
                  key={launch.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                  <div className="relative p-5 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-cyan-500/50 transition-all">
                    <div className="flex gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-2xl flex-shrink-0">
                        {launch.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{launch.title}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${launch.scope === 'ICM' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'}`}>
                            {launch.scope}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1">{launch.subtitle}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-800">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span className="text-[10px] text-zinc-500">Launches in</span>
                        </div>
                        <div className="text-sm font-bold text-white">{launch.launchDate}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-800">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Users className="w-3 h-3 text-violet-400" />
                          <span className="text-[10px] text-zinc-500">Followers</span>
                        </div>
                        <div className="text-sm font-bold text-white">{launch.followers}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Interactive Components Section
const InteractiveSection = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [showStories, setShowStories] = useState(false);
  const [segmentValue, setSegmentValue] = useState('All');

  const earnCards = [
    {
      id: '1',
      title: 'Create 5 Viral Meme Videos',
      description: 'Submit your best meme content using our templates. Top submissions win big!',
      reward: '$500',
      endsIn: 'Ends in 2 days',
      joined: '34 joined',
      progress: 68,
      icon: Gift
    },
    {
      id: '2',
      title: 'Trading Tutorial Series',
      description: 'Create educational content about crypto trading strategies.',
      reward: '$1200',
      endsIn: 'Ends in 10 days',
      joined: '67 joined',
      progress: 45,
      icon: Gift
    }
  ];

  const stories = [
    { id: '1', user: 'alex_crypto', avatar: '', content: 'Just launched a new campaign! 🚀', timestamp: '2m ago' },
    { id: '2', user: 'sarah_streams', avatar: '', content: 'Hit 10K followers! Thank you LaunchOS fam 💜', timestamp: '5m ago' },
    { id: '3', user: 'mike_memes', avatar: '', content: 'New bounty alert: $500 for best meme 🎨', timestamp: '12m ago' },
  ];

  return (
    <section className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
            Interactive Components
          </span>
        </h2>

        {/* Global Contribution Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 blur-xl opacity-50" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Community Contribution Meter</h3>
                  <p className="text-sm text-zinc-400">Every campaign participation fuels our ecosystem growth</p>
                </div>
              </div>

              {/* Contribution Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-400">Monthly Goal Progress</span>
                  <span className="text-green-400 font-bold">78% Complete</span>
                </div>
                <div className="h-4 bg-zinc-800 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 relative"
                  >
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-lg bg-zinc-800/50">
                  <div className="text-xl font-bold text-green-400">234</div>
                  <div className="text-xs text-zinc-500">Active Campaigns</div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-800/50">
                  <div className="text-xl font-bold text-emerald-400">1.2k</div>
                  <div className="text-xs text-zinc-500">Contributors</div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-800/50">
                  <div className="text-xl font-bold text-cyan-400">$45k</div>
                  <div className="text-xs text-zinc-500">Rewards Pool</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Clipping Campaigns Cards */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-zinc-300">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
                Clipping Campaigns
              </span>
            </h3>
            <div className="space-y-4">
              {earnCards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-green-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <card.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-white mb-2">{card.title}</h4>
                      <p className="text-sm text-zinc-400 mb-3">{card.description}</p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{card.endsIn}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{card.joined}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-zinc-500">Progress</span>
                          <span className="text-green-400 font-semibold">{card.progress}%</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${card.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Reward & CTA */}
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-green-400">{card.reward}</div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors"
                        >
                          Join Now
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interactive List - More Activities */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-6 text-zinc-300">Live Activity Feed</h3>

            {/* Segmented Control */}
            <SegmentedControl
              options={['All', 'Launches', 'Bounties', 'Network']}
              value={segmentValue}
              onChange={setSegmentValue}
            />

            {/* List Items - More Activities */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              <InteractiveListItem
                title="New Launch: Meme Competition"
                subtitle="$2,500 in prizes • Ends in 2 days"
                avatar={<Rocket className="h-6 w-6 text-white" />}
                badge={3}
                trailing={<ChevronRight className="h-5 w-5" />}
                onClick={() => setShowSheet(true)}
                onSwipeLeft={() => console.log('Archived')}
                onSwipeRight={() => console.log('Joined')}
              />
              <InteractiveListItem
                title="Bounty Completed"
                subtitle="You earned $125 from Stream Challenge"
                avatar={<Gift className="h-6 w-6 text-white" />}
                trailing={<span className="text-green-400 text-sm">+$125</span>}
                onClick={() => setShowSheet(true)}
              />
              <InteractiveListItem
                title="Network Update"
                subtitle="Sarah just joined your network"
                avatar={<Users className="h-6 w-6 text-white" />}
                badge={1}
                trailing={<ChevronRight className="h-5 w-5" />}
                onClick={() => setShowSheet(true)}
              />
              <InteractiveListItem
                title="ICM.RUN went live"
                subtitle="Trending #1 • 342 upvotes"
                avatar={<Rocket className="h-6 w-6 text-white" />}
                badge={2}
                trailing={<ChevronRight className="h-5 w-5" />}
                onClick={() => setShowSheet(true)}
              />
              <InteractiveListItem
                title="Stream 10 Hours Challenge"
                subtitle="$250 reward • 18 participants"
                avatar={<Target className="h-6 w-6 text-white" />}
                trailing={<ChevronRight className="h-5 w-5" />}
                onClick={() => setShowSheet(true)}
              />
              <InteractiveListItem
                title="New follower: @crypto_mike"
                subtitle="Has 5 mutual connections"
                avatar={<Users className="h-6 w-6 text-white" />}
                trailing={<ChevronRight className="h-5 w-5" />}
                onClick={() => setShowSheet(true)}
              />
              <InteractiveListItem
                title="Campaign ending soon"
                subtitle="Trading Tutorial Series • 2 hours left"
                avatar={<Gift className="h-6 w-6 text-white" />}
                badge={1}
                trailing={<ChevronRight className="h-5 w-5" />}
                onClick={() => setShowSheet(true)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <PremiumButton
                variant="primary"
                onClick={() => setShowStories(true)}
                className="flex-1"
              >
                View Stories
              </PremiumButton>
              <PremiumButton
                variant="secondary"
                onClick={() => setShowSheet(true)}
                className="flex-1"
              >
                Open Details
              </PremiumButton>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SheetModal
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        title="Campaign Details"
      >
        <div className="space-y-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold text-white mb-2">Meme Competition</h3>
            <p className="text-zinc-400 text-sm">Create and submit your best memes for a chance to win up to $1,000!</p>
          </GlassCard>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <p className="text-zinc-400 text-xs mb-1">Prize Pool</p>
              <p className="text-xl font-bold text-white">$2,500</p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <p className="text-zinc-400 text-xs mb-1">Participants</p>
              <p className="text-xl font-bold text-white">127</p>
            </div>
          </div>
          <PremiumButton variant="primary" className="w-full">
            Join Campaign
          </PremiumButton>
        </div>
      </SheetModal>

      <StoriesViewer
        stories={stories}
        isOpen={showStories}
        onClose={() => setShowStories(false)}
      />
    </section>
  );
};

// Main Landing Page
export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Clean Hero Section with Native iOS App Feel */}
      <PerfectHeroSection onLaunchApp={() => console.log('Launch App clicked')} />

      {/* Section Divider */}
      <SectionDivider />

      {/* Top & Upcoming Launches Grid */}
      <div id="launches">
        <LaunchesGridSection />
      </div>

      {/* Section Divider */}
      <SectionDivider />

      {/* Interactive Components Section */}
      <div id="interactive">
        <InteractiveSection />
      </div>

      {/* Section Divider */}
      <SectionDivider />

      {/* LIVE & NETWORK Side by Side */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LIVE Section - Stream Window Only */}
            <div id="live">
              <div className="mb-6">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  LIVE
                </h2>
              </div>
              <LiveSection />
            </div>

            {/* NETWORK Section - Bubble Map Only */}
            <div id="network">
              <div className="mb-6">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  NETWORK
                </h2>
              </div>
              <NetworkSection />
            </div>
          </div>
        </div>
      </section>

      {/* Page-specific Scroll Navigation */}
      <ScrollNavigation sections={navigationSections} />

    </div>
  );
}
