'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrivy } from '@privy-io/react-auth'
import { addVote, removeVote, getVoteCount, hasUserVoted } from '@/lib/appwrite/services/votes'

interface VoteButtonProps {
  initialVotes: number
  projectId: string
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'vertical' | 'horizontal'
}

export function VoteButton({
  initialVotes,
  projectId,
  size = 'md',
  orientation = 'vertical'
}: VoteButtonProps) {
  const { authenticated, user } = usePrivy()
  const [votes, setVotes] = useState(initialVotes)
  const [hasVoted, setHasVoted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if user has voted on mount
  useEffect(() => {
    if (authenticated && user?.id) {
      hasUserVoted(projectId, user.id).then(voted => {
        setHasVoted(voted)
      })

      // Fetch current vote count
      getVoteCount(projectId).then(count => {
        setVotes(count)
      })
    }
  }, [authenticated, user?.id, projectId])

  const handleVote = async () => {
    if (!authenticated || !user?.id) {
      alert('Please connect your wallet to vote')
      return
    }

    if (isLoading) return

    setIsLoading(true)
    setIsAnimating(true)

    try {
      if (hasVoted) {
        // Remove vote
        await removeVote(projectId, user.id)
        setVotes(prev => Math.max(0, prev - 1))
        setHasVoted(false)
      } else {
        // Add vote
        await addVote(projectId, user.id)
        setVotes(prev => prev + 1)
        setHasVoted(true)
      }
    } catch (error: any) {
      console.error('Vote error:', error)
      alert(error.message || 'Failed to vote')
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  }

  if (orientation === 'horizontal') {
    return (
      <button
        onClick={handleVote}
        disabled={isLoading || !authenticated}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg font-bold transition-all duration-200',
          'border border-white/10 hover:border-white/30',
          hasVoted
            ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border-pink-500/30'
            : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer hover:-translate-y-0.5',
          isLoading && 'opacity-50 cursor-wait',
          !authenticated && 'opacity-50 cursor-not-allowed',
          isAnimating && 'scale-110',
          sizeClasses[size]
        )}
      >
        <ChevronUp
          size={iconSizes[size]}
          className={cn(
            'transition-transform',
            isAnimating && 'animate-bounce'
          )}
        />
        <span>{votes}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleVote}
      disabled={isLoading || !authenticated}
      className={cn(
        'flex flex-col items-center gap-1 rounded-xl font-bold transition-all duration-200',
        'border border-white/10 hover:border-white/30',
        hasVoted
          ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-400 border-pink-500/30'
          : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer hover:-translate-y-1',
        isLoading && 'opacity-50 cursor-wait',
        !authenticated && 'opacity-50 cursor-not-allowed',
        isAnimating && 'scale-110',
        size === 'sm' && 'px-2 py-1.5 min-w-[50px]',
        size === 'md' && 'px-3 py-2 min-w-[60px]',
        size === 'lg' && 'px-4 py-3 min-w-[70px]'
      )}
    >
      <ChevronUp
        size={iconSizes[size]}
        className={cn(
          'transition-transform',
          isAnimating && 'animate-bounce'
        )}
      />
      <span className={cn(
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-base'
      )}>
        {votes}
      </span>
    </button>
  )
}
