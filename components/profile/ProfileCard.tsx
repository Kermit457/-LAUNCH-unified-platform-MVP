"use client"

import { Check } from 'lucide-react'
import Link from 'next/link'
import { ProfileCardData, ProfileCardVariant, roleColors } from '@/types/profile'
import { ContributionBubble } from './ContributionBubble'
import { MutualAvatars } from './MutualAvatars'
import { SocialLinks } from './SocialLinks'
import { cn } from '@/lib/cn'
import { useNetwork } from '@/lib/contexts/NetworkContext'
import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { sendNetworkInvite } from '@/lib/appwrite/services/network'
import { createDMThread } from '@/lib/appwrite/services/messages'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'

interface ProfileCardProps {
  data: ProfileCardData
  variant?: ProfileCardVariant
  showActions?: boolean
  onCardClick?: () => void
}

export function ProfileCard({
  data,
  variant = 'default',
  showActions = true,
  onCardClick
}: ProfileCardProps) {
  const {
    id,
    userId,
    username,
    displayName,
    avatar,
    verified,
    roles,
    bio,
    tagline,
    contributions,
    mutuals,
    socials,
    connected,
    inviteSent: initialInviteSent,
    onInvite,
    onMessage
  } = data

  const { user } = useUser()
  const { login } = usePrivy()
  const router = useRouter()
  const { addInvite, addMessage } = useNetwork()
  const [inviteSent, setInviteSent] = useState(initialInviteSent || false)

  // Update inviteSent when the prop changes (e.g., when data refreshes)
  useEffect(() => {
    setInviteSent(initialInviteSent || false)
  }, [initialInviteSent])

  const isCompact = variant === 'compact'
  const isMinimal = variant === 'minimal'

  const handleInviteClick = async () => {
    if (!user) {
      // Show Privy login modal
      login()
      return
    }

    const targetUserId = userId || id

    try {
      // Call Appwrite to send network invite
      await sendNetworkInvite({
        senderId: (user as any).$id || (user as any).id,
        receiverId: targetUserId,
        message: `Hi ${displayName}, let's connect!`
      })

      // Also call the optional onInvite callback
      if (onInvite) {
        onInvite()
      }

      // Update local state
      addInvite(targetUserId, username, displayName, avatar)
      setInviteSent(true)
    } catch (error: any) {
      console.error('Failed to send invite:', error)
      if (error.message?.includes('already sent')) {
        // Mark as sent even if the API says it's already sent
        setInviteSent(true)
      } else {
        console.error('Unexpected error sending invite:', error)
      }
    }
  }

  const handleMessageClick = async () => {
    if (!user) {
      // Show Privy login modal
      login()
      return
    }

    const targetUserId = userId || id

    try {
      // Create or get existing DM thread
      const thread = await createDMThread((user as any).$id || (user as any).id, targetUserId)

      // Navigate to dashboard/network with the thread open
      router.push(`/dashboard/network?thread=${thread.$id}`)

      // Also call the optional onMessage callback
      if (onMessage) {
        onMessage()
      }
    } catch (error) {
      console.error('Failed to create message thread:', error)
      // Silently fail - user can try again if needed
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300",
        !isMinimal && "hover:border-fuchsia-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-[1.02]",
        isMinimal ? "p-3" : isCompact ? "p-4" : "p-6"
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fuchsia-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-fuchsia-500/5 group-hover:via-purple-500/5 group-hover:to-cyan-500/5 transition-all pointer-events-none" />

      <div className="relative">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <Link href={`/profile/${username}`}>
            <div className="relative group/avatar cursor-pointer">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 group-hover/avatar:border-fuchsia-500/50 group-hover/avatar:scale-110 transition-all">
                {avatar ? (
                  <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                    {displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </Link>

          {/* Name & Roles */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/profile/${username}`} className="hover:underline">
                <h3 className="text-xl font-bold text-white truncate">{displayName}</h3>
              </Link>
              {verified && (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="text-sm text-zinc-400 mb-2">@{username}</div>

            {/* Role Pills */}
            {!isMinimal && roles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <span
                    key={role}
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-bold border",
                      roleColors[role] || roleColors.Creator
                    )}
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}

            {/* Tagline (compact mode only) */}
            {isCompact && tagline && (
              <div className="text-xs text-zinc-500 mt-1 italic">{tagline}</div>
            )}
          </div>
        </div>

        {/* Bio Section - Only in default mode */}
        {!isCompact && !isMinimal && bio && (
          <div className="mb-4">
            <p className="text-sm text-zinc-400 line-clamp-2">{bio}</p>
          </div>
        )}

        {/* Contributions Row - Not in minimal */}
        {!isMinimal && contributions.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              {contributions.slice(0, 6).map((contribution) => (
                <ContributionBubble key={contribution.name} contribution={contribution} />
              ))}
              {contributions.length > 6 && (
                <span className="text-xs text-zinc-500">+{contributions.length - 6} more</span>
              )}
            </div>
          </div>
        )}

        {/* Mutuals Row - Not in minimal */}
        {!isMinimal && mutuals.length > 0 && (
          <div className="mb-4">
            <MutualAvatars mutuals={mutuals} />
          </div>
        )}

        {/* Actions Row - Only if showActions and not minimal */}
        {showActions && !isMinimal && (
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
            {/* Social Links */}
            <SocialLinks socials={socials} />

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Invite Button - Only show if NOT connected */}
              {!connected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleInviteClick()
                  }}
                  disabled={inviteSent}
                  className={cn(
                    "rounded-xl font-semibold transition-all",
                    isCompact
                      ? "px-4 py-2 text-xs"
                      : "px-6 py-2.5 text-sm",
                    inviteSent
                      ? "bg-white/10 text-zinc-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] text-white"
                  )}
                >
                  {inviteSent ? '✓ Invited' : 'Invite'}
                </button>
              )}

              {/* Message Button - Only if connected */}
              {connected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMessageClick()
                  }}
                  className={cn(
                    "rounded-xl font-semibold transition-all",
                    isCompact
                      ? "px-4 py-2 text-xs"
                      : "px-6 py-2.5 text-sm",
                    "bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] text-white"
                  )}
                >
                  Message
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
