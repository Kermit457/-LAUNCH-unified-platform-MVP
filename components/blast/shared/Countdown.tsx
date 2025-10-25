/**
 * Countdown - Live countdown timer for rooms
 */

'use client'

import { useState, useEffect } from 'react'
import { Clock, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CountdownProps {
  endTime: string
  onExpire?: () => void
  className?: string
  showIcon?: boolean
}

export function Countdown({
  endTime,
  onExpire,
  className,
  showIcon = true
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isExpired, setIsExpired] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false) // < 1 hour

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = new Date(endTime).getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft('Closed')
        setIsExpired(true)
        onExpire?.()
        return
      }

      // Calculate time components
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      // Set urgent if < 1 hour
      setIsUrgent(diff < 1000 * 60 * 60)

      // Format display
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`${minutes}m`)
      }
    }

    // Initial calculation
    calculateTimeLeft()

    // Update every minute (or every 10s if urgent)
    const interval = setInterval(
      calculateTimeLeft,
      isUrgent ? 10_000 : 60_000
    )

    return () => clearInterval(interval)
  }, [endTime, onExpire, isUrgent])

  return (
    <div className={cn(
      'flex items-center gap-1.5 font-mono text-xs',
      isExpired && 'text-zinc-600',
      isUrgent && !isExpired && 'text-red-400 animate-pulse',
      !isUrgent && !isExpired && 'text-zinc-400',
      className
    )}>
      {showIcon && (
        isUrgent && !isExpired ? (
          <Flame className="w-3 h-3" />
        ) : (
          <Clock className="w-3 h-3" />
        )
      )}
      <span>{timeLeft}</span>
    </div>
  )
}

/**
 * Detailed countdown with progress bar
 */
export function DetailedCountdown({
  startTime,
  endTime,
  className
}: {
  startTime: string
  endTime: string
  className?: string
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      const start = new Date(startTime).getTime()
      const end = new Date(endTime).getTime()
      const now = new Date().getTime()

      const total = end - start
      const elapsed = now - start

      const percent = Math.min(100, Math.max(0, (elapsed / total) * 100))
      setProgress(percent)
    }

    calculateProgress()
    const interval = setInterval(calculateProgress, 60_000) // Update every minute

    return () => clearInterval(interval)
  }, [startTime, endTime])

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">Time Remaining</span>
        <Countdown endTime={endTime} showIcon={false} />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-1000',
            progress > 80 ? 'bg-red-500' : progress > 50 ? 'bg-orange-500' : 'bg-green-500'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
