"use client"

import { DollarSign, Eye, CheckCircle, Clock, TrendingUp, Zap } from 'lucide-react'
import { SeasonBanner } from '@/components/SeasonBanner'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import { HallOfFame } from '@/components/HallOfFame'
import { CURRENT_SEASON, HALL_OF_FAME } from '@/lib/leaderboardData'

// Sample quest data using existing ActionCard-compatible format
const FEATURED_QUESTS = [
  {
    id: '1',
    group: 'quest' as const,
    title: 'Stream 10 Hours',
    subtitle: 'Go live and stream for a total of 10 hours this week',
    image: '/quest-stream.jpg',
    reward: { type: 'impact' as const, value: 50, label: 'Impact Score' },
    budget: { spent: 0, total: 10 },
    progress: { completed: 0, total: 10 },
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    verified: true
  },
  {
    id: '2',
    group: 'quest' as const,
    title: 'Submit 5 Approved Clips',
    subtitle: 'Create and get 5 clips approved across any campaigns',
    image: '/quest-clips.jpg',
    reward: { type: 'impact' as const, value: 30, label: 'Impact Score' },
    budget: { spent: 0, total: 5 },
    progress: { completed: 0, total: 5 },
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    verified: true
  },
  {
    id: '3',
    group: 'quest' as const,
    title: 'Stake 1000 $LAUNCH',
    subtitle: 'Boost your profile visibility by staking $LAUNCH tokens',
    image: '/quest-stake.jpg',
    reward: { type: 'impact' as const, value: 20, label: 'Impact Score' },
    budget: { spent: 0, total: 1000 },
    progress: { completed: 0, total: 1000 },
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    verified: true
  }
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Season Banner */}
      <div className="mb-12">
        <SeasonBanner season={CURRENT_SEASON} />
      </div>

      {/* How to Rank Section */}
      <div className="mb-12">
        <div className="rounded-2xl bg-gradient-to-br from-neutral-900/70 to-neutral-800/50 border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            How to Rank
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white mb-1">Earnings (40%)</div>
                <div className="text-sm text-white/70">Verified USD earned in 30 days</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white mb-1">Views (20%)</div>
                <div className="text-sm text-white/70">Verified views × average CPM</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white mb-1">Submissions (15%)</div>
                <div className="text-sm text-white/70">Approved clips & content</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white mb-1">Live Hours (10%)</div>
                <div className="text-sm text-white/70">Streaming activity</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white mb-1">Conviction (10%)</div>
                <div className="text-sm text-white/70">Community belief growth</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white mb-1">Boosts (5%)</div>
                <div className="text-sm text-white/70">$LAUNCH staked for visibility</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Embed */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Current Rankings</h2>
        <LeaderboardTable />
      </div>

      {/* Featured Quests */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Featured Quests</h2>
            <p className="text-white/60">Complete quests to boost your Impact Score</p>
          </div>
          <a
            href="/earn"
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all"
          >
            View All Quests
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED_QUESTS.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>

      {/* Hall of Fame */}
      <HallOfFame entries={HALL_OF_FAME} />
    </div>
  )
}

function QuestCard({ quest }: { quest: typeof FEATURED_QUESTS[0] }) {
  const progress = (quest.progress.completed / quest.progress.total) * 100

  return (
    <div className="rounded-2xl bg-gradient-to-br from-neutral-900/70 to-neutral-800/50 border border-white/10 hover:border-purple-500/30 transition-all overflow-hidden group">
      {/* Image Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
        <div className="relative text-6xl">🎯</div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-white text-lg mb-2">{quest.title}</h3>
        <p className="text-sm text-white/60 mb-4">{quest.subtitle}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span>Progress</span>
            <span>{quest.progress.completed} / {quest.progress.total}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Reward */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">+{quest.reward.value} Impact</span>
          </div>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-sm transition-all shadow-lg">
            Start Quest
          </button>
        </div>
      </div>
    </div>
  )
}
