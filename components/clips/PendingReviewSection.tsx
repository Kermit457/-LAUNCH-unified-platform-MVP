'use client'

import { memo } from 'react'
import { type Clip } from '@/lib/appwrite/services/clips'
import { type Campaign } from '@/lib/appwrite/services/campaigns'
import { cn } from '@/lib/utils'

interface PendingReviewSectionProps {
  pendingClips: Clip[]
  campaigns: Campaign[]
  userId: string | null
  selectedReviewClips: Set<string>
  collapsedCampaigns: Set<string>
  batchActionLoading: boolean
  pendingLoading: boolean
  onToggleSelection: (clipId: string) => void
  onToggleCampaignCollapse: (campaignId: string) => void
  onApprove: (clipId: string) => void
  onReject: (clipId: string) => void
  onBatchApprove: () => void
  onBatchReject: () => void
  onClearSelection: () => void
}

function PendingReviewSectionComponent({
  pendingClips,
  campaigns,
  userId,
  selectedReviewClips,
  collapsedCampaigns,
  batchActionLoading,
  pendingLoading,
  onToggleSelection,
  onToggleCampaignCollapse,
  onApprove,
  onReject,
  onBatchApprove,
  onBatchReject,
  onClearSelection
}: PendingReviewSectionProps) {
  if (pendingLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse">
            <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (pendingClips.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
        <p className="text-white/60">No pending clips to review right now.</p>
      </div>
    )
  }

  return (
    <>
      {/* Batch Actions Bar */}
      {selectedReviewClips.size > 0 && (
        <div className="sticky top-[120px] z-20 rounded-2xl border border-white/10 bg-neutral-900/95 backdrop-blur p-4 flex items-center justify-between">
          <div className="text-sm text-white/80">
            {selectedReviewClips.size} clip{selectedReviewClips.size !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClearSelection}
              className="px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition"
              disabled={batchActionLoading}
            >
              Clear
            </button>
            <button
              onClick={onBatchReject}
              className="px-4 py-2 rounded-xl text-sm border border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
              disabled={batchActionLoading}
            >
              {batchActionLoading ? 'Rejecting...' : 'Reject Selected'}
            </button>
            <button
              onClick={onBatchApprove}
              className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] text-white font-semibold hover:from-[#B8E008] hover:to-[#A0C007] transition"
              disabled={batchActionLoading}
            >
              {batchActionLoading ? 'Approving...' : 'Approve Selected'}
            </button>
          </div>
        </div>
      )}

      {/* Campaign Groups */}
      <div className="space-y-4">
        {campaigns
          .filter(campaign =>
            campaign.createdBy === userId &&
            pendingClips.some(clip => clip.campaignId === campaign.campaignId)
          )
          .map(campaign => {
            const campaignClips = pendingClips.filter(clip => clip.campaignId === campaign.campaignId)
            const isCollapsed = collapsedCampaigns.has(campaign.campaignId)

            return (
              <div key={campaign.$id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                {/* Campaign Header */}
                <button
                  onClick={() => onToggleCampaignCollapse(campaign.campaignId)}
                  className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full bg-gradient-to-br from-[#D1FD0A] to-[#B8E008] flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-white">{campaign.title.charAt(0)}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">{campaign.title}</h3>
                      <p className="text-sm text-white/60">{campaignClips.length} pending clip{campaignClips.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <svg
                    className={cn(
                      "w-5 h-5 text-white/60 transition-transform",
                      isCollapsed ? "" : "rotate-180"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Campaign Clips */}
                {!isCollapsed && (
                  <div className="border-t border-white/10 p-4 space-y-3">
                    {campaignClips.map(clip => (
                      <div
                        key={clip.$id}
                        className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 transition"
                      >
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <label className="flex items-center cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={selectedReviewClips.has(clip.$id)}
                              onChange={() => onToggleSelection(clip.$id)}
                              className="w-5 h-5 rounded border-white/20 bg-white/5 text-lime-500 focus:ring-2 focus:ring-lime-500 focus:ring-offset-0 cursor-pointer"
                            />
                          </label>

                          {/* Video Preview */}
                          <div className="relative w-28 h-48 rounded-lg overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 flex-shrink-0">
                            {clip.thumbnailUrl ? (
                              <img
                                src={clip.thumbnailUrl}
                                alt={clip.title || 'Clip'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                                {clip.platform.toUpperCase()}
                              </div>
                            )}
                            {/* Platform Badge */}
                            <div className={cn(
                              "absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center",
                              clip.platform === 'youtube' && "bg-red-600",
                              clip.platform === 'tiktok' && "bg-black",
                              clip.platform === 'twitter' && "bg-black",
                              clip.platform === 'twitch' && "bg-lime-600",
                              clip.platform === 'instagram' && "bg-gradient-to-br from-lime-500 via-lime-500 to-orange-500"
                            )}>
                              {clip.platform === 'youtube' && (
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                              )}
                              {clip.platform === 'tiktok' && (
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                </svg>
                              )}
                              {clip.platform === 'twitter' && (
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                              )}
                            </div>
                          </div>

                          {/* Clip Info */}
                          <div className="flex-1 min-w-0 space-y-3">
                            {/* Creator Info */}
                            <div className="flex items-center gap-2">
                              <img
                                src={clip.creatorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${clip.submittedBy}`}
                                alt={clip.creatorUsername || 'Creator'}
                                className="w-8 h-8 rounded-full border border-white/20"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">
                                  {clip.creatorUsername ? `@${clip.creatorUsername}` : clip.submittedBy.slice(0, 12)}
                                </div>
                                <div className="text-xs text-white/50">
                                  Submitted {new Date(clip.$createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-4 gap-3">
                              <div className="text-center">
                                <div className="text-sm font-semibold text-white font-led-dot">{clip.views.toLocaleString()}</div>
                                <div className="text-xs text-white/50">Views</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-semibold text-white font-led-dot">{clip.likes.toLocaleString()}</div>
                                <div className="text-xs text-white/50">Likes</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-semibold text-white font-led-dot">{clip.comments.toLocaleString()}</div>
                                <div className="text-xs text-white/50">Comments</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-semibold text-[#D1FD0A] font-led-dot">{clip.engagement.toFixed(1)}%</div>
                                <div className="text-xs text-white/50">Engagement</div>
                              </div>
                            </div>

                            {/* Title/Link */}
                            {clip.title && (
                              <div className="text-sm text-white/80 line-clamp-2">
                                {clip.title}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => window.open(clip.embedUrl, '_blank')}
                                className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white hover:bg-white/10 transition"
                              >
                                View Clip
                              </button>
                              <button
                                onClick={() => onReject(clip.$id)}
                                className="px-4 py-2 rounded-lg border border-red-500/50 bg-red-500/10 text-sm text-red-400 hover:bg-red-500/20 transition"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => onApprove(clip.$id)}
                                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] text-sm text-white font-semibold hover:from-[#B8E008] hover:to-[#A0C007] transition"
                              >
                                Approve
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </>
  )
}

export const PendingReviewSection = memo(PendingReviewSectionComponent, (prev, next) => {
  // Only re-render if data or selection changes
  return (
    prev.pendingClips.length === next.pendingClips.length &&
    prev.campaigns.length === next.campaigns.length &&
    prev.selectedReviewClips.size === next.selectedReviewClips.size &&
    prev.collapsedCampaigns.size === next.collapsedCampaigns.size &&
    prev.batchActionLoading === next.batchActionLoading &&
    prev.pendingLoading === next.pendingLoading &&
    prev.userId === next.userId
  )
})
