"use client"

import { motion } from 'framer-motion'
import { Gift, Wallet, Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useReferralRewards } from '@/hooks/useReferralRewards'
import { usePrivy } from '@privy-io/react-auth'

interface RewardsPanelProps {
  variant?: 'full' | 'compact'
}

export const RewardsPanel = ({ variant = 'full' }: RewardsPanelProps) => {
  const { user } = usePrivy()
  const {
    rewards,
    stats,
    isLoading,
    claimReward,
    claimAllRewards,
    getPendingRewards,
    getClaimedRewards,
    getTotalPendingAmount,
    hasPendingRewards
  } = useReferralRewards()

  const [claiming, setClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'pending' | 'claimed'>('pending')

  const walletAddress = user?.wallet?.address

  const handleClaimAll = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first')
      return
    }

    setClaiming(true)
    try {
      const result = await claimAllRewards(walletAddress)
      if (result.success) {
        setClaimSuccess(true)
        setTimeout(() => setClaimSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Failed to claim rewards:', error)
      alert('Failed to claim rewards. Please try again.')
    } finally {
      setClaiming(false)
    }
  }

  const handleClaimSingle = async (rewardId: string) => {
    if (!walletAddress) {
      alert('Please connect your wallet first')
      return
    }

    setClaiming(true)
    try {
      const success = await claimReward(rewardId, walletAddress)
      if (success) {
        setClaimSuccess(true)
        setTimeout(() => setClaimSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Failed to claim reward:', error)
      alert('Failed to claim reward. Please try again.')
    } finally {
      setClaiming(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/3 mb-4" />
        <div className="h-24 bg-zinc-900 rounded" />
      </div>
    )
  }

  const pendingRewards = getPendingRewards()
  const claimedRewards = getClaimedRewards()
  const totalPending = getTotalPendingAmount()

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-950 rounded-xl border border-zinc-800 p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm font-medium text-white">Rewards</p>
              <p className="text-xs text-zinc-500">{pendingRewards.length} pending</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-purple-400">${totalPending.toFixed(2)}</p>
          </div>
        </div>

        {hasPendingRewards && (
          <button
            onClick={handleClaimAll}
            disabled={claiming || !walletAddress}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {claiming ? (
              <>Claiming...</>
            ) : claimSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Claimed!
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                Claim All
              </>
            )}
          </button>
        )}

        {!walletAddress && hasPendingRewards && (
          <p className="text-xs text-zinc-500 mt-2 text-center">Connect wallet to claim</p>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Gift className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Your Rewards</h3>
              <p className="text-sm text-zinc-400">Claim your referral earnings</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 rounded-lg p-3">
            <p className="text-xs text-zinc-500 mb-1">Pending</p>
            <p className="text-lg font-bold text-purple-400">${stats?.pendingAmount.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-zinc-600">{stats?.pendingCount || 0} rewards</p>
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-3">
            <p className="text-xs text-zinc-500 mb-1">Claimed</p>
            <p className="text-lg font-bold text-green-400">${stats?.claimedAmount.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-zinc-600">{stats?.claimedCount || 0} rewards</p>
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-3">
            <p className="text-xs text-zinc-500 mb-1">Total</p>
            <p className="text-lg font-bold text-white">${stats?.totalAmount.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-zinc-600">all time</p>
          </div>
        </div>
      </div>

      {/* Claim All Button */}
      {hasPendingRewards && (
        <div className="bg-purple-500/5 border-b border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClaimAll}
              disabled={claiming || !walletAddress}
              className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {claiming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Claiming...
                </>
              ) : claimSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Successfully Claimed!
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Claim All ${totalPending.toFixed(2)}
                </>
              )}
            </button>
          </div>
          {!walletAddress && (
            <div className="flex items-center gap-2 mt-3 text-sm text-orange-400">
              <AlertCircle className="w-4 h-4" />
              <span>Connect your wallet to claim rewards</span>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            selectedTab === 'pending'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-zinc-500 hover:text-zinc-400'
          }`}
        >
          Pending ({pendingRewards.length})
        </button>
        <button
          onClick={() => setSelectedTab('claimed')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            selectedTab === 'claimed'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-zinc-500 hover:text-zinc-400'
          }`}
        >
          Claimed ({claimedRewards.length})
        </button>
      </div>

      {/* Rewards List */}
      <div className="p-6">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {selectedTab === 'pending' ? (
            pendingRewards.length > 0 ? (
              pendingRewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <p className="text-sm font-medium text-white capitalize">
                          {reward.type.replace('_', ' ')}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {formatDate(reward.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-400">
                        ${reward.amount.toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleClaimSingle(reward.id)}
                        disabled={claiming || !walletAddress}
                        className="text-xs text-purple-400 hover:text-purple-300 disabled:text-zinc-600 mt-1"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Gift className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No pending rewards</p>
                <p className="text-sm text-zinc-600 mt-1">Rewards will appear here when earned</p>
              </div>
            )
          ) : (
            claimedRewards.length > 0 ? (
              claimedRewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-zinc-900 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <p className="text-sm font-medium text-white capitalize">
                          {reward.type.replace('_', ' ')}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-500">
                        Claimed {reward.claimedAt ? formatDate(reward.claimedAt) : 'recently'}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-green-400">
                      ${reward.amount.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No claimed rewards yet</p>
                <p className="text-sm text-zinc-600 mt-1">Start referring to earn rewards</p>
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  )
}