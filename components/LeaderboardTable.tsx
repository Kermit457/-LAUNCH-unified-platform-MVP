"use client"

import { useState, useMemo } from 'react'
import { Check, Share2, Link as LinkIcon, Radio } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CreatorEntry, ProjectEntry, AgencyEntry, TimeFilter, TabType, Badge } from '@/types/leaderboard'
import { impactScoreCreator, impactScoreProject, impactScoreAgency, getCreatorBadges, getProjectBadges, getAgencyBadges } from '@/lib/impactScore'
import { CREATORS, PROJECTS, AGENCIES } from '@/lib/leaderboardData'
import { RankBadge } from './RankBadge'
import { ImpactScorePill } from './ImpactScorePill'
import { ConvictionMeter } from './ConvictionMeter'
import { StatStrip } from './StatStrip'

interface LeaderboardTableProps {
  defaultTab?: TabType
  className?: string
}

export function LeaderboardTable({ defaultTab = 'creators', className }: LeaderboardTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [chainFilter, setChainFilter] = useState<string | null>(null)
  const [liveOnly, setLiveOnly] = useState(false)

  const ROLES = ['Streamer', 'Clipper', 'Editor', 'Trader', 'Project Ops', 'Degen', 'Designer']
  const CHAINS = ['SOL', 'BASE', 'ETH']

  // Calculate scores and rank entries
  const rankedCreators = useMemo(() => {
    let filtered = [...CREATORS]

    if (roleFilter) {
      filtered = filtered.filter(c => c.roles.includes(roleFilter))
    }
    if (liveOnly) {
      filtered = filtered.filter(c => c.isLive)
    }

    const withScores = filtered.map(entry => ({
      entry,
      score: impactScoreCreator(entry, filtered),
      badges: [] as Badge[]
    }))

    const allScores = withScores.map(w => w.score)

    return withScores
      .map(w => ({
        ...w,
        badges: getCreatorBadges(w.entry, w.score, allScores, filtered)
      }))
      .sort((a, b) => b.score - a.score)
      .map((w, index) => ({ ...w, rank: index + 1 }))
  }, [roleFilter, liveOnly])

  const rankedProjects = useMemo(() => {
    let filtered = [...PROJECTS]

    if (chainFilter) {
      filtered = filtered.filter(p => p.chain === chainFilter)
    }
    if (liveOnly) {
      filtered = filtered.filter(p => p.isLive)
    }

    const withScores = filtered.map(entry => ({
      entry,
      score: impactScoreProject(entry, filtered),
      badges: [] as Badge[]
    }))

    const allScores = withScores.map(w => w.score)

    return withScores
      .map(w => ({
        ...w,
        badges: getProjectBadges(w.entry, w.score, allScores)
      }))
      .sort((a, b) => b.score - a.score)
      .map((w, index) => ({ ...w, rank: index + 1 }))
  }, [chainFilter, liveOnly])

  const rankedAgencies = useMemo(() => {
    let filtered = [...AGENCIES]

    if (liveOnly) {
      // For agencies, we don't have isLive, so this filter does nothing
      filtered = filtered
    }

    const withScores = filtered.map(entry => ({
      entry,
      score: impactScoreAgency(entry, filtered),
      badges: [] as Badge[]
    }))

    const allScores = withScores.map(w => w.score)

    return withScores
      .map(w => ({
        ...w,
        badges: getAgencyBadges(w.entry, w.score, allScores)
      }))
      .sort((a, b) => b.score - a.score)
      .map((w, index) => ({ ...w, rank: index + 1 }))
  }, [liveOnly])

  return (
    <div className={cn('space-y-6', className)}>
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10">
        <TabButton
          active={activeTab === 'creators'}
          onClick={() => {
            setActiveTab('creators')
            setChainFilter(null)
          }}
        >
          Creators
        </TabButton>
        <TabButton
          active={activeTab === 'projects'}
          onClick={() => {
            setActiveTab('projects')
            setRoleFilter(null)
          }}
        >
          Projects
        </TabButton>
        <TabButton
          active={activeTab === 'agencies'}
          onClick={() => {
            setActiveTab('agencies')
            setRoleFilter(null)
            setChainFilter(null)
          }}
        >
          Agencies
        </TabButton>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Time Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <span className="text-xs text-white/60">Time:</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            className="bg-transparent text-sm text-white font-medium outline-none cursor-pointer"
          >
            <option value="7d">7 days</option>
            <option value="30d">30 days</option>
            <option value="all">All-time</option>
          </select>
        </div>

        {/* Role Filter (Creators only) */}
        {activeTab === 'creators' && (
          <div className="flex items-center gap-2">
            {ROLES.map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(roleFilter === role ? null : role)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  roleFilter === role
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                )}
              >
                {role}
              </button>
            ))}
          </div>
        )}

        {/* Chain Filter (Projects only) */}
        {activeTab === 'projects' && (
          <div className="flex items-center gap-2">
            {CHAINS.map(chain => (
              <button
                key={chain}
                onClick={() => setChainFilter(chainFilter === chain ? null : chain)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  chainFilter === chain
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                )}
              >
                {chain}
              </button>
            ))}
          </div>
        )}

        {/* Live Toggle */}
        <button
          onClick={() => setLiveOnly(!liveOnly)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            liveOnly
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
          )}
        >
          <Radio className={cn('w-3.5 h-3.5', liveOnly && 'animate-pulse')} />
          Live Now
        </button>

        {/* Clear Filters */}
        {(roleFilter || chainFilter || liveOnly) && (
          <button
            onClick={() => {
              setRoleFilter(null)
              setChainFilter(null)
              setLiveOnly(false)
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white transition-colors underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Entry Cards - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {activeTab === 'creators' && rankedCreators.map(({ entry, score, badges, rank }) => (
          <CreatorCard key={entry.id} entry={entry} score={score} badges={badges} rank={rank} />
        ))}

        {activeTab === 'projects' && rankedProjects.map(({ entry, score, badges, rank }) => (
          <ProjectCard key={entry.id} entry={entry} score={score} badges={badges} rank={rank} />
        ))}

        {activeTab === 'agencies' && rankedAgencies.map(({ entry, score, badges, rank }) => (
          <AgencyCard key={entry.id} entry={entry} score={score} badges={badges} rank={rank} />
        ))}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-6 py-3 text-sm font-bold transition-all relative',
        active
          ? 'text-white'
          : 'text-white/40 hover:text-white/70'
      )}
    >
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-600" />
      )}
    </button>
  )
}

function CreatorCard({
  entry,
  score,
  badges,
  rank
}: {
  entry: CreatorEntry
  score: number
  badges: Badge[]
  rank: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="glass-launchos rounded-2xl p-4 border border-white/10 hover:border-purple-500/30 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        {/* Rank Badge */}
        <RankBadge rank={rank} />

        {/* Avatar & Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                {entry.avatar || entry.handle.slice(0, 2).toUpperCase()}
              </div>

              {/* Name & Roles */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{entry.name}</h3>
                  {entry.verified && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {entry.isLive && (
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-xs font-bold"
                      aria-live="polite"
                      aria-label="Live now"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      LIVE
                    </div>
                  )}
                </div>
                <p className="text-sm text-white/60">{entry.handle}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {entry.roles.slice(0, 3).map(role => (
                    <span
                      key={role}
                      className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-white/70"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Impact Score */}
            <ImpactScorePill score={score} />
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              {badges.map(badge => (
                <div
                  key={badge.type}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r shadow-lg',
                    badge.color
                  )}
                >
                  {badge.label}
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <StatStrip
            variant="creator"
            earnUsd={entry.stats.earnUsd30d}
            approvedSubs={entry.stats.approvedSubs30d}
            views={entry.stats.verifiedViews30d}
            liveHours={entry.stats.liveHours30d}
            className="mb-4"
          />

          {/* Conviction & CTAs */}
          <div className="flex items-center justify-between">
            <ConvictionMeter
              convictionPct={entry.stats.convictionPct}
              delta7d={entry.stats.convictionDelta7d}
            />

            <div className="flex items-center gap-2">
              {/* Hover Actions */}
              {isHovered && (
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    aria-label={`Share ${entry.name}`}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    aria-label={`Copy link to ${entry.name}`}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Main CTAs */}
              <button
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/10"
                aria-label={`Follow ${entry.name}`}
              >
                Follow
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-sm transition-all shadow-lg"
                aria-label={`Invite ${entry.name} to campaign`}
              >
                Invite to Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({
  entry,
  score,
  badges,
  rank
}: {
  entry: ProjectEntry
  score: number
  badges: Badge[]
  rank: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  const getChainColor = () => {
    if (entry.chain === 'SOL') return 'from-purple-500 to-violet-600'
    if (entry.chain === 'BASE') return 'from-blue-500 to-cyan-600'
    return 'from-gray-500 to-gray-700'
  }

  return (
    <div
      className="glass-launchos rounded-2xl p-4 border border-white/10 hover:border-purple-500/30 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        {/* Rank Badge */}
        <RankBadge rank={rank} />

        {/* Logo & Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg', getChainColor())}>
                {entry.logo || entry.symbol.slice(0, 2)}
              </div>

              {/* Name & Chain */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{entry.name}</h3>
                  {entry.verified && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {entry.isLive && (
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-xs font-bold"
                      aria-live="polite"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      LIVE
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white/60">${entry.symbol}</p>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-white/70">
                    {entry.chain}
                  </span>
                </div>
              </div>
            </div>

            {/* Impact Score */}
            <ImpactScorePill score={score} />
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              {badges.map(badge => (
                <div
                  key={badge.type}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r shadow-lg',
                    badge.color
                  )}
                >
                  {badge.label}
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <StatStrip
            variant="project"
            feesUsd={entry.stats.feesUsd30d}
            contributors={entry.stats.uniqueContributors30d}
            completionRate={entry.stats.completionRate30d}
            buybacksUsd={entry.stats.buybacksUsd30d}
            className="mb-4"
          />

          {/* Conviction & CTAs */}
          <div className="flex items-center justify-between">
            <ConvictionMeter
              convictionPct={entry.stats.convictionPct}
              delta7d={0}
            />

            <div className="flex items-center gap-2">
              {/* Hover Actions */}
              {isHovered && (
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    aria-label={`Share ${entry.name}`}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    aria-label={`Copy link to ${entry.name}`}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Main CTAs */}
              <button
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/10"
                aria-label={`Follow ${entry.name}`}
              >
                Follow
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-sm transition-all shadow-lg"
                aria-label={`Join campaigns for ${entry.name}`}
              >
                Join Campaigns
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AgencyCard({
  entry,
  score,
  badges,
  rank
}: {
  entry: AgencyEntry
  score: number
  badges: Badge[]
  rank: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="glass-launchos rounded-2xl p-4 border border-white/10 hover:border-purple-500/30 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        {/* Rank Badge */}
        <RankBadge rank={rank} />

        {/* Logo & Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                {entry.logo || entry.name.slice(0, 2)}
              </div>

              {/* Name */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{entry.name}</h3>
                  {entry.verified && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-white/60">Marketing Agency</p>
              </div>
            </div>

            {/* Impact Score */}
            <ImpactScorePill score={score} />
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              {badges.map(badge => (
                <div
                  key={badge.type}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r shadow-lg',
                    badge.color
                  )}
                >
                  {badge.label}
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <StatStrip
            variant="agency"
            campaigns={entry.stats.totalCampaigns30d}
            successRate={entry.stats.avgCampaignSuccessRate}
            spendUsd={entry.stats.totalSpendUsd30d}
            creators={entry.stats.activeCreators30d}
            className="mb-4"
          />

          {/* Conviction & CTAs */}
          <div className="flex items-center justify-between">
            <ConvictionMeter
              convictionPct={entry.stats.convictionPct}
              delta7d={entry.stats.convictionDelta7d}
            />

            <div className="flex items-center gap-2">
              {/* Hover Actions */}
              {isHovered && (
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    aria-label={`Share ${entry.name}`}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    aria-label={`Copy link to ${entry.name}`}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Main CTAs */}
              <button
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border border-white/10"
                aria-label={`Follow ${entry.name}`}
              >
                Follow
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-sm transition-all shadow-lg"
                aria-label={`Invite ${entry.name} agency`}
              >
                Invite Agency
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
