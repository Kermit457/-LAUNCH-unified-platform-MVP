'use client'

import { useState } from 'react'
import { Check, X, Eye, Heart, MessageCircle, ExternalLink, Play } from 'lucide-react'
import type { Clip } from '@/lib/appwrite/services/clips'
import { approveClip } from '@/lib/appwrite/services/clips'
import { useToast } from '@/hooks/useToast'

interface ClipReviewCardProps {
  clip: Clip
  onApprove: () => void
  onReject: () => void
  userId: string
}

export function ClipReviewCard({ clip, onApprove, onReject, userId }: ClipReviewCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { success, error: showError } = useToast()

  const platformIcons: Record<string, string> = {
    twitter: '𝕏',
    tiktok: '🎵',
    youtube: '▶️',
    twitch: '🎮',
    instagram: '📷',
    linkedin: '💼',
    facebook: '👥',
    reddit: '🤖',
    vimeo: '🎬',
    rumble: '📹',
    kick: '⚡'
  }

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      await approveClip(clip.$id, true, userId)
      success('Clip Approved!', `Clip from ${clip.creatorUsername || 'user'} is now live`)
      onApprove()
    } catch (error: any) {
      showError('Approval Failed', error.message || 'Failed to approve clip')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    try {
      await approveClip(clip.$id, false, userId)
      success('Clip Rejected', 'Clip has been removed')
      onReject()
    } catch (error: any) {
      showError('Rejection Failed', error.message || 'Failed to reject clip')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
      <div className="flex gap-4">
        {/* Thumbnail/Preview */}
        <div className="w-32 h-32 flex-shrink-0 bg-neutral-800 rounded-lg overflow-hidden relative group">
          {clip.thumbnailUrl ? (
            <img
              src={clip.thumbnailUrl}
              alt={clip.title || 'Clip'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {platformIcons[clip.platform] || '🎬'}
            </div>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Clip Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm mb-1 truncate">
                {clip.title || 'Untitled Clip'}
              </h3>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <span className="text-lg">{platformIcons[clip.platform]}</span>
                  {clip.platform}
                </span>
                <span>•</span>
                <span>by {clip.creatorUsername || 'Anonymous'}</span>
              </div>
            </div>

            {/* Platform Badge */}
            <div className="px-2 py-1 bg-neutral-800 rounded text-xs font-medium text-neutral-300">
              {clip.projectName || 'Unknown Project'}
            </div>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-4 mb-3 text-xs text-neutral-400">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{clip.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              <span>{clip.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{clip.comments.toLocaleString()}</span>
            </div>
            {clip.engagement > 0 && (
              <div className="px-2 py-0.5 bg-[#D1FD0A]/10 text-[#D1FD0A] rounded">
                {clip.engagement.toFixed(1)}% engagement
              </div>
            )}
          </div>

          {/* Submitter Info */}
          {clip.creatorAvatar && (
            <div className="flex items-center gap-2 mb-3 text-xs">
              <img
                src={clip.creatorAvatar}
                alt={clip.creatorUsername || 'User'}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-neutral-400">
                Submitted by <span className="text-white font-medium">{clip.creatorUsername}</span>
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              {isProcessing ? 'Processing...' : 'Approve'}
            </button>

            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <X className="w-4 h-4" />
              {isProcessing ? 'Processing...' : 'Reject'}
            </button>

            <a
              href={clip.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
              title="View on platform"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Submitted Date */}
      <div className="mt-3 pt-3 border-t border-neutral-800 text-xs text-neutral-500">
        Submitted {new Date(clip.$createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  )
}
