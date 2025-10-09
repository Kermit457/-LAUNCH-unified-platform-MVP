'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, Gift, Upload, Inbox,
  Users, Target
} from 'lucide-react';
import { GlassCard, PremiumButton } from '@/components/design-system/DesignSystemShowcase';
import { KPIStat } from '@/components/design-test/KPIStat';
import { FilterBar } from '@/components/design-test/FilterBar';
import { EarnOpportunityCard, EarnOpportunity } from '@/components/design-test/EarnOpportunityCard';
import { ClipCard, Clip } from '@/components/design-test/ClipCard';
import { EmptyState } from '@/components/design-test/EmptyState';
import { Swords, Crosshair } from 'lucide-react';

// Mock Data - Unified opportunities
const mockOpportunities: EarnOpportunity[] = [
  {
    id: '1',
    type: 'campaign',
    title: 'Create 5 Viral Meme Videos',
    description: 'Submit your best meme content using our templates. Top submissions win big!',
    reward: 500,
    deadline: 'Ends in 2 days',
    participants: 34,
    progress: 68,
    icon: <Gift className="w-6 h-6" />,
  },
  {
    id: '2',
    type: 'bounty',
    title: 'Stream 10 Hours This Week',
    description: 'Go live and engage with your community. Consistency pays off!',
    reward: 250,
    deadline: 'Ends in 5 days',
    participants: 18,
    progress: 42,
    icon: <Target className="w-6 h-6" />,
  },
  {
    id: '3',
    type: 'raid',
    title: 'Refer 3 Active Traders',
    description: 'Invite friends who complete at least 5 trades to earn rewards.',
    reward: 750,
    deadline: 'Ends in 7 days',
    participants: 52,
    progress: 85,
    icon: <Swords className="w-6 h-6" />,
  },
  {
    id: '4',
    type: 'campaign',
    title: 'Trading Tutorial Series',
    description: 'Create educational content about crypto trading strategies.',
    reward: 1200,
    deadline: 'Ends in 10 days',
    participants: 67,
    progress: 45,
  },
  {
    id: '5',
    type: 'bounty',
    title: 'Design Launch Graphics Pack',
    description: 'Create a complete branding kit for new project launches.',
    reward: 800,
    deadline: 'Ends in 4 days',
    participants: 23,
    progress: 62,
  },
  {
    id: '6',
    type: 'raid',
    title: 'Community Growth Challenge',
    description: 'Bring new members to LaunchOS and earn per active user.',
    reward: 1500,
    deadline: 'Ends in 14 days',
    participants: 91,
    progress: 78,
    icon: <Crosshair className="w-6 h-6" />,
  },
];

const mockClips: Clip[] = [
  {
    id: '1',
    title: 'Epic Trading Win Compilation',
    status: 'approved',
    cpm: 12.5,
    views: 45230,
  },
  {
    id: '2',
    title: 'How to Launch on LaunchOS',
    status: 'paid',
    cpm: 15,
    views: 128450,
  },
  {
    id: '3',
    title: 'Meme Review: Top 10 This Week',
    status: 'pending',
    cpm: 10,
    views: 8900,
  },
  {
    id: '4',
    title: 'Stream Highlights: 10K Followers Celebration',
    status: 'approved',
    cpm: 13,
    views: 34120,
  },
];

export default function EarnPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filterOptions = ['All', 'Campaigns', 'Bounties', 'Raids', 'Clips'];

  // Filter logic
  const filteredOpportunities = mockOpportunities.filter(opp => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Campaigns') return opp.type === 'campaign';
    if (activeFilter === 'Bounties') return opp.type === 'bounty';
    if (activeFilter === 'Raids') return opp.type === 'raid';
    return false;
  });

  const showClips = activeFilter === 'All' || activeFilter === 'Clips';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Section - KPI Stats */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 relative">
        {/* Background glow */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* KPI Strip */}
          <div className="grid md:grid-cols-3 gap-6">
            <KPIStat
              label="Today"
              value="$247"
              icon={DollarSign}
              trend={{ value: '+12%', direction: 'up' }}
              gradient="from-green-500 to-emerald-500"
              delay={0}
            />
            <KPIStat
              label="Last 7 Days"
              value="$1,842"
              icon={TrendingUp}
              trend={{ value: '+24%', direction: 'up' }}
              gradient="from-emerald-500 to-teal-500"
              delay={0.1}
            />
            <KPIStat
              label="Last 30 Days"
              value="$7,521"
              icon={Gift}
              trend={{ value: '+8%', direction: 'up' }}
              gradient="from-teal-500 to-cyan-500"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Filter and CTAs Section */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Filter Bar */}
            <FilterBar
              options={filterOptions}
              active={activeFilter}
              onChange={setActiveFilter}
              sticky={false}
            />

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => console.log('Create Campaign')}
                className="px-4 py-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white text-sm font-medium transition-all shadow-lg hover:shadow-green-500/25"
              >
                + Campaign
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => console.log('Create Bounty')}
                className="px-4 py-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-sm font-medium transition-all shadow-lg hover:shadow-cyan-500/25"
              >
                + Bounty
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => console.log('Create Raid')}
                className="px-4 py-2 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white text-sm font-medium transition-all shadow-lg hover:shadow-violet-500/25"
              >
                + Raid
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Opportunities Section */}
        {filteredOpportunities.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {activeFilter === 'All' ? 'All Opportunities' : activeFilter}
                </h2>
                <p className="text-zinc-400 text-sm">
                  {filteredOpportunities.length} active {activeFilter.toLowerCase()}
                </p>
              </div>
            </div>

            {filteredOpportunities.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpportunities.map((opportunity) => (
                  <EarnOpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    onJoin={(id) => console.log('Join opportunity:', id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Target}
                title="No Opportunities Found"
                description="Check back soon for new earning opportunities"
              />
            )}
          </section>
        )}

        {/* Clips Section */}
        {showClips && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Clips to Earn</h2>
              <PremiumButton variant="secondary" className="text-sm px-4 py-2">
                <Upload className="w-4 h-4" />
                Upload Clip
              </PremiumButton>
            </div>
            {mockClips.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockClips.map((clip) => (
                  <ClipCard
                    key={clip.id}
                    clip={clip}
                    onClick={(id) => console.log('View clip:', id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Inbox}
                title="No Clips Yet"
                description="Upload your first clip and start earning from views"
                action={{
                  label: 'Upload First Clip',
                  onClick: () => console.log('Upload clip'),
                }}
              />
            )}
          </section>
        )}

        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: '1. Choose Your Path',
                description: 'Pick campaigns, bounties, or create clips based on your skills and interests',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: Users,
                title: '2. Create & Engage',
                description: 'Produce content, complete tasks, or refer friends to start earning',
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                icon: DollarSign,
                title: '3. Get Paid',
                description: 'Earn automatically as your content performs or tasks complete',
                gradient: 'from-teal-500 to-cyan-500',
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 text-center h-full">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-zinc-400">{step.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
