"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, UserPlus, Send, Gift, Info, MoreHorizontal, ShoppingCart } from 'lucide-react'
import { useCurveActivation } from '@/contexts/CurveActivationContext'
import { SimpleBuySellModal } from '@/components/curve/SimpleBuySellModal'
import { useToast } from '@/hooks/useToast'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { createDMThread } from '@/lib/appwrite/services/messages'
import { sendNetworkInvite } from '@/lib/appwrite/services/network'

export interface UserCardProps {
  user: {
    id: string
    handle: string
    avatar?: string
    skills?: string[]
    online?: boolean
    motionScore?: number
    price?: number
    projectsCompleted?: number
    responseTime?: string
    holdings?: number
    contributions?: number
  }
  onConnect?: (userId: string) => void
  onInvite?: (userId: string) => void
  onMessage?: (userId: string) => void
  onTip?: (userId: string) => void
  compact?: boolean
}

export function UserCard({
  user,
  onConnect,
  onInvite,
  onMessage,
  onTip,
  compact = false
}: UserCardProps) {
  const { isActivated } = useCurveActivation()
  const { user: privyUser } = usePrivy()
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [showInfoPopup, setShowInfoPopup] = useState(false)
  const [showBuyKeyModal, setShowBuyKeyModal] = useState(false)
  const [buyKeyAction, setBuyKeyAction] = useState<'connect' | 'invite' | 'message' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock data for SimpleBuySellModal - TODO: Replace with real curve data from Appwrite
  const userBalance = 10 // SOL
  const userKeys = 0 // Keys owned of this user

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isActivated) {
      setBuyKeyAction('connect')
      setShowBuyKeyModal(true)
      return
    }
    onConnect?.(user.id)
  }

  const handleInvite = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!privyUser?.id) {
      showError('Not Authenticated', 'Please log in to send invites')
      return
    }

    if (!isActivated) {
      setBuyKeyAction('invite')
      setShowBuyKeyModal(true)
      return
    }

    // Send network invite
    setIsProcessing(true)
    try {
      const invite = await sendNetworkInvite({
        senderId: privyUser.id,
        receiverId: user.id,
        message: `Let's collaborate!`
      })

      if (invite) {
        success('Invite Sent!', `Network invite sent to @${user.handle}`)
        onInvite?.(user.id)
      } else {
        showError('Invite Failed', 'You may have already sent an invite to this user')
      }
    } catch (error: any) {
      showError('Failed to Send Invite', error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMessage = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!privyUser?.id) {
      showError('Not Authenticated', 'Please log in to send messages')
      return
    }

    if (!isActivated) {
      setBuyKeyAction('message')
      setShowBuyKeyModal(true)
      return
    }

    // Create DM thread and navigate to chat
    setIsProcessing(true)
    try {
      const thread = await createDMThread(privyUser.id, user.id)
      success('Opening Chat', `Starting conversation with @${user.handle}`)
      router.push(`/chat?thread=${thread.$id}`)
      onMessage?.(user.id)
    } catch (error: any) {
      showError('Failed to Open Chat', error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBuyKey = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowBuyKeyModal(true)
    setBuyKeyAction(null)
  }

  // Compact horizontal version for top performers row
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="p-1.5 md:p-3 rounded-lg md:rounded-xl border backdrop-blur-sm transition-all cursor-pointer bg-zinc-900/50 hover:bg-zinc-800/50 border-zinc-800 h-full relative"
      >
        {/* Compact Avatar */}
        <div className="flex flex-col items-center mb-1 md:mb-2">
          <div className="relative mb-1 md:mb-2">
            <div className={`w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-xl p-0.5 ${
              user.motionScore && user.motionScore >= 90
                ? 'bg-gradient-to-br from-[#FFD700] to-[#FF8800]'
                : user.motionScore && user.motionScore >= 80
                ? 'bg-gradient-to-br from-[#00FF88] to-[#00FFFF]'
                : 'bg-gradient-to-br from-[#8800FF] to-[#00FFFF]'
            }`}>
              <div className="w-full h-full rounded-lg md:rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold text-xs md:text-lg">
                {user.avatar || user.handle.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
          <h3 className="font-bold text-white text-[10px] md:text-sm text-center truncate w-full">@{user.handle}</h3>
        </div>

        {/* Motion Score & Price */}
        <div className="mb-1 md:mb-2 grid grid-cols-2 gap-0.5 md:gap-1">
          {user.motionScore !== undefined && (
            <div className="p-1 md:p-2 rounded-md md:rounded-lg bg-zinc-800/30 border border-zinc-700/50 text-center">
              <div className="text-[8px] md:text-[9px] text-zinc-500 mb-0.5">Motion</div>
              <div className={`text-xs md:text-sm font-bold ${
                user.motionScore >= 90 ? 'text-[#FFD700]' :
                user.motionScore >= 80 ? 'text-[#00FF88]' :
                'text-white'
              }`}>{user.motionScore}</div>
            </div>
          )}
          {user.price !== undefined && (
            <div className="p-1 md:p-2 rounded-md md:rounded-lg bg-zinc-800/30 border border-zinc-700/50 text-center">
              <div className="text-[8px] md:text-[9px] text-zinc-500 mb-0.5">Price</div>
              <div className="text-xs md:text-sm font-bold text-[#00FFFF]">{user.price}</div>
            </div>
          )}
        </div>

        {/* Compact CTAs - DM & Invite */}
        <div className="grid grid-cols-2 gap-0.5 md:gap-1">
          <button
            onClick={handleMessage}
            disabled={isProcessing}
            className="px-1.5 md:px-2 py-1 md:py-1.5 rounded-md md:rounded-lg font-bold text-[9px] md:text-xs transition-all flex items-center justify-center gap-0.5 md:gap-1 bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle className="w-2.5 h-2.5 md:w-3 md:h-3" />
          </button>
          <button
            onClick={handleInvite}
            disabled={isProcessing}
            className="px-1.5 md:px-2 py-1 md:py-1.5 rounded-md md:rounded-lg font-bold text-[9px] md:text-xs transition-all flex items-center justify-center gap-0.5 md:gap-1 bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-2.5 h-2.5 md:w-3 md:h-3" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="p-2 md:p-4 rounded-lg md:rounded-xl border backdrop-blur-sm transition-all cursor-pointer bg-zinc-900/50 hover:bg-zinc-800/50 border-zinc-800 relative"
      >
        {/* Header */}
        <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
          {/* Avatar */}
          <div className="relative">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl p-0.5 ${
              user.motionScore && user.motionScore >= 90
                ? 'bg-gradient-to-br from-[#FFD700] to-[#FF8800]'
                : user.motionScore && user.motionScore >= 80
                ? 'bg-gradient-to-br from-[#00FF88] to-[#00FFFF]'
                : 'bg-gradient-to-br from-[#8800FF] to-[#00FFFF]'
            }`}>
              <div className="w-full h-full rounded-lg md:rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold text-xs md:text-sm">
                {user.avatar || user.handle.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate text-xs md:text-base">@{user.handle}</h3>
          </div>

          {/* Info & Menu Icons */}
          <div className="flex items-center gap-1">
            <button
              className="p-1 rounded hover:bg-zinc-800 transition-colors relative"
              onMouseEnter={() => setShowInfoPopup(true)}
              onMouseLeave={() => setShowInfoPopup(false)}
            >
              <Info className="w-3 h-3 md:w-4 md:h-4 text-zinc-400" />
            </button>
            <button className="p-1 rounded hover:bg-zinc-800 transition-colors">
              <MoreHorizontal className="w-3 h-3 md:w-4 md:h-4 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Info Popup - Hover */}
        <AnimatePresence>
          {showInfoPopup && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-0 right-0 z-50 w-64 p-3 rounded-lg bg-zinc-900 border border-zinc-700 shadow-2xl"
              onMouseEnter={() => setShowInfoPopup(true)}
              onMouseLeave={() => setShowInfoPopup(false)}
            >
              <div className="mb-2 pb-2 border-b border-zinc-800">
                <h4 className="text-sm font-bold text-white mb-1">@{user.handle}</h4>
                <div className="text-xs text-zinc-400">Profile Details</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                {user.motionScore !== undefined && (
                  <div className="p-2 rounded bg-zinc-800/50 border border-zinc-700/50">
                    <div className="text-[9px] text-zinc-500 mb-0.5">Motion Score</div>
                    <div className={`text-sm font-bold ${
                      user.motionScore >= 90 ? 'text-[#FFD700]' :
                      user.motionScore >= 80 ? 'text-[#00FF88]' :
                      'text-white'
                    }`}>{user.motionScore}</div>
                  </div>
                )}
                {user.holdings !== undefined && (
                  <div className="p-2 rounded bg-zinc-800/50 border border-zinc-700/50">
                    <div className="text-[9px] text-zinc-500 mb-0.5">Holdings</div>
                    <div className="text-sm font-bold text-[#00FFFF]">{user.holdings}</div>
                  </div>
                )}
                {user.contributions !== undefined && (
                  <div className="p-2 rounded bg-zinc-800/50 border border-zinc-700/50">
                    <div className="text-[9px] text-zinc-500 mb-0.5">Contributions</div>
                    <div className="text-sm font-bold text-white">{user.contributions}</div>
                  </div>
                )}
                {user.projectsCompleted !== undefined && (
                  <div className="p-2 rounded bg-zinc-800/50 border border-zinc-700/50">
                    <div className="text-[9px] text-zinc-500 mb-0.5">Completed</div>
                    <div className="text-sm font-bold text-white">{user.projectsCompleted}</div>
                  </div>
                )}
              </div>

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <div>
                  <div className="text-[9px] text-zinc-500 mb-1">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {user.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-zinc-800/50 text-zinc-400 border border-zinc-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Motion Score & Price */}
        {(user.motionScore !== undefined || user.price !== undefined) && (
          <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-2 md:mb-3 p-1.5 md:p-2 rounded-md md:rounded-lg bg-zinc-800/30 border border-zinc-700/50">
            {user.motionScore !== undefined && (
              <div>
                <div className="text-[8px] md:text-[10px] text-zinc-500">Motion</div>
                <div className={`text-xs md:text-sm font-bold ${
                  user.motionScore >= 90 ? 'text-[#FFD700]' :
                  user.motionScore >= 80 ? 'text-[#00FF88]' :
                  'text-white'
                }`}>
                  {user.motionScore}
                </div>
              </div>
            )}
            {user.price !== undefined && (
              <div>
                <div className="text-[8px] md:text-[10px] text-zinc-500">Price</div>
                <div className="text-xs md:text-sm font-bold text-[#00FFFF]">
                  {user.price}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2 md:mb-3">
            {user.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="px-1.5 md:px-2 py-0.5 rounded text-[8px] md:text-[10px] font-bold bg-zinc-800/50 text-zinc-400 border border-zinc-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 md:gap-2">
          <button
            onClick={handleMessage}
            disabled={isProcessing}
            className="px-2 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg font-bold text-[9px] md:text-xs transition-all flex items-center justify-center gap-0.5 md:gap-1 bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
          </button>
          <button
            onClick={handleInvite}
            disabled={isProcessing}
            className="px-2 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg font-bold text-[9px] md:text-xs transition-all flex items-center justify-center gap-0.5 md:gap-1 bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Buy/Sell Modal - Integrated */}
      <SimpleBuySellModal
        isOpen={showBuyKeyModal}
        onClose={() => {
          setShowBuyKeyModal(false)
          setBuyKeyAction(null)
        }}
        curve={{
          id: user.id,
          supply: 100, // Mock supply - replace with real data
          holders: 10, // Mock holders - replace with real data
        } as any}
        ownerName={user.handle}
        ownerAvatar={user.avatar}
        twitterHandle={`@${user.handle}`}
        userBalance={userBalance}
        userKeys={userKeys}
        onTrade={async (type, keys) => {
          try {
            success(
              type === 'buy' ? 'Keys Purchased!' : 'Keys Sold!',
              `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${keys} key${keys > 1 ? 's' : ''}`
            )
            setShowBuyKeyModal(false)

            // Execute the original action if applicable
            if (type === 'buy' && buyKeyAction) {
              if (buyKeyAction === 'message') onMessage?.(user.id)
              if (buyKeyAction === 'invite') onInvite?.(user.id)
              if (buyKeyAction === 'connect') onConnect?.(user.id)
            }
            setBuyKeyAction(null)
          } catch (error: any) {
            showError('Transaction Failed', error.message)
          }
        }}
      />
    </>
  )
}
