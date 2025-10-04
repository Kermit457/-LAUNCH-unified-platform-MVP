'use client'

import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/cn'
import { getBalance, deductBalance, hasBoosted, markBoosted, getBoostCost } from '@/lib/wallet'
import { useToast } from '@/hooks/useToast'

interface BoostButtonProps {
  projectId: string
  onBoost: () => void
  size?: 'sm' | 'md' | 'lg'
}

export function BoostButton({ projectId, onBoost, size = 'md' }: BoostButtonProps) {
  const [balance, setBalance] = useState(0)
  const [boosted, setBoosted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { success, error } = useToast()
  const cost = getBoostCost()

  // Load state on mount
  useEffect(() => {
    setBalance(getBalance())
    setBoosted(hasBoosted(projectId))
  }, [projectId])

  const handleBoost = () => {
    if (boosted) return

    const currentBalance = getBalance()

    if (currentBalance < cost) {
      error('Insufficient balance', `You need ${cost} $LAUNCH to boost this project`)
      // Shake animation
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 500)
      return
    }

    // Deduct balance
    if (deductBalance(cost)) {
      markBoosted(projectId)
      setBoosted(true)
      setBalance(getBalance())
      onBoost()

      // Pulse animation
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)

      success(
        'Project boosted! 🚀',
        `You spent ${cost} $LAUNCH. Balance: ${getBalance()} $LAUNCH`
      )
    }
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      onClick={handleBoost}
      disabled={boosted}
      className={cn(
        'rounded-lg font-bold transition-all duration-200 flex items-center gap-2',
        boosted
          ? 'bg-white/5 text-white/40 cursor-not-allowed'
          : 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700 hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105',
        isAnimating && !boosted && 'animate-pulse scale-110',
        isAnimating && boosted && 'animate-shake',
        sizeClasses[size]
      )}
      title={`Boost project for ${cost} $LAUNCH (Balance: ${balance})`}
    >
      <Zap
        size={size === 'sm' ? 14 : size === 'md' ? 16 : 20}
        className={cn(
          boosted ? '' : 'fill-yellow-200',
          isAnimating && 'animate-bounce'
        )}
      />
      {boosted ? (
        <>Boosted ✓</>
      ) : (
        <>
          Boost ({cost} $LAUNCH)
        </>
      )}
    </button>
  )
}
