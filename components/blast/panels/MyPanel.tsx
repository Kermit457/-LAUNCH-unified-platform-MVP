/**
 * MyPanel - Right sidebar showing user stats
 */

'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useKeyGate, useTierInfo } from '@/hooks/blast/useKeyGate'
import { useMotionScore } from '@/hooks/blast/useMotionScore'
import { useVault } from '@/hooks/blast/useVault'
import { useUserApplications } from '@/hooks/blast/useUserApplications'
import { Key, Flame, Award, Wallet } from 'lucide-react'
import { MotionMeter } from '../shared/MotionMeter'
import { getTierLabel, getTierColor } from '@/lib/constants/blast'
import { cn } from '@/lib/utils'

export function MyPanel() {
  const { user, authenticated } = usePrivy()
  const { keyBalance, tier } = useKeyGate()
  const { nextTier, keysToNextTier } = useTierInfo()
  const { data: vault } = useVault(user?.id)
  const { data: motionScore } = useMotionScore(user?.id)
  const { data: applications = [] } = useUserApplications()

  const pendingApps = applications.filter(a => a.status === 'pending').length
  const acceptedApps = applications.filter(a => a.status === 'accepted').length

  if (!authenticated) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4 py-8">
          <p className="text-sm text-zinc-400">
            Connect wallet to see your stats
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-black text-white mb-2 btdemo-text-glow">
          My Panel
        </h2>
        <p className="text-xs text-zinc-400">
          Your stats & activity
        </p>
      </div>

      {/* Tier Badge */}
      <div className="glass-premium p-4 rounded-xl border-2 border-primary/50">
        <div className="flex items-center justify-between mb-2">
          <span className="stat-label">TIER</span>
          <div className={cn('text-xl', getTierColor(tier))}>
            {tier === 'partner' && '👑'}
            {tier === 'curator' && '⭐'}
            {tier === 'contributor' && '✍️'}
            {tier === 'viewer' && '👁️'}
          </div>
        </div>

        <p className={cn('font-led-dot text-5xl', getTierColor(tier))}>
          {getTierLabel(tier).toUpperCase()}
        </p>

        {nextTier && (
          <p className="text-xs text-zinc-400 mt-2">
            <span className="font-led-dot text-xl text-primary">{keysToNextTier}</span> keys to {getTierLabel(nextTier)}
          </p>
        )}
      </div>

      {/* Key Balance */}
      <div className="glass-premium p-4 rounded-xl border-2 border-primary/50">
        <div className="flex items-center justify-between mb-2">
          <span className="stat-label">KEYS</span>
          <Key className="w-4 h-4 icon-primary" />
        </div>
        <p className="font-led-dot text-5xl text-primary">
          {keyBalance}
        </p>
      </div>

      {/* Motion Score */}
      {motionScore && (
        <div className="glass-premium p-4 rounded-xl border-2 border-primary/50">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label">MOTION SCORE</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <MotionMeter
            userId={user!.id}
            showBreakdown={false}
            size="lg"
          />
        </div>
      )}

      {/* Quick Stats */}
      <div className="space-y-2">
        <div className="glass-interactive p-3 rounded-xl border-2 border-primary/50">
          <div className="flex items-center justify-between">
            <span className="stat-label">My Rooms</span>
            <span className="font-led-dot text-xl text-primary">0</span>
          </div>
        </div>

        <div className="glass-interactive p-3 rounded-xl border-2 border-primary/50">
          <div className="flex items-center justify-between">
            <span className="stat-label">Applications</span>
            <span className="font-led-dot text-xl text-primary">{applications.length}</span>
          </div>
          {applications.length > 0 && (
            <div className="mt-2 flex gap-2 text-xs">
              {pendingApps > 0 && (
                <span className="text-zinc-500">
                  <span className="font-led-dot text-sm text-zinc-400">{pendingApps}</span> pending
                </span>
              )}
              {acceptedApps > 0 && (
                <span className="text-[#D1FD0A]">
                  <span className="font-led-dot text-sm text-primary">{acceptedApps}</span> accepted
                </span>
              )}
            </div>
          )}
        </div>

        <div className="glass-interactive p-3 rounded-xl border-2 border-primary/50">
          <div className="flex items-center justify-between">
            <span className="stat-label">Intros</span>
            <span className="font-led-dot text-xl text-primary">0</span>
          </div>
        </div>
      </div>

      {/* Vault */}
      {vault && (
        <div className="glass-premium p-4 rounded-xl border-2 border-primary/50">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label">VAULT</span>
            <Wallet className="w-4 h-4 text-purple-400" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Locked:</span>
              <span className="font-led-dot text-sm text-primary">
                {vault.totalLocked}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">SOL:</span>
              <span className="font-led-dot text-sm text-primary">
                {vault.earnings.sol.toFixed(3)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Points:</span>
              <span className="font-led-dot text-sm text-primary">
                {vault.earnings.points.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Referral */}
      <div className="glass-premium p-4 rounded-xl border-2 border-primary/50">
        <div className="stat-label mb-2">REFERRALS</div>
        <p className="text-sm text-zinc-300 mb-3">
          Invite holders → earn rewards
        </p>
        <button className="w-full py-2 bg-[#D1FD0A] hover:bg-[#B8E309] text-black rounded-lg text-xs font-bold transition-all">
          Copy Link
        </button>
      </div>
    </div>
  )
}
