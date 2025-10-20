'use client'

import { useState, useEffect } from 'react'
import { Twitter, Globe, CheckCircle2 } from 'lucide-react'
import { Curve } from '@/types/curve'
import { SimpleBuySellModal } from './SimpleBuySellModal'

interface UserProfileCurveCardProps {
  userId: string
  userName: string
  userHandle: string
  userAvatar?: string
  userBadges?: string[]
  userBio?: string
  currentUserId: string
  userBalance: number
  isVerified?: boolean
}

export function UserProfileCurveCard({
  userId,
  userName,
  userHandle,
  userAvatar,
  userBadges = [],
  userBio,
  currentUserId,
  userBalance,
  isVerified = false
}: UserProfileCurveCardProps) {
  const [curve, setCurve] = useState<Curve | null>(null)
  const [userKeys, setUserKeys] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const isOwner = currentUserId === userId

  useEffect(() => {
    loadCurve()
  }, [userId])

  const loadCurve = async () => {
    try {
      const res = await fetch(`/api/curve/owner?ownerType=user&ownerId=${userId}`)
      const data = await res.json()

      if (data.curve) {
        setCurve(data.curve)

        const holderRes = await fetch(`/api/curve/${data.curve.id}/holder/${currentUserId}`)
        if (holderRes.ok) {
          const holderData = await holderRes.json()
          setUserKeys(holderData.holder?.balance || 0)
        }
      }
    } catch (error) {
      console.error('Failed to load curve:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrade = async (type: 'buy' | 'sell', keys: number) => {
    if (!curve) return

    const endpoint = `/api/curve/${curve.id}/${type}`
    const body = type === 'buy'
      ? { keys, userId: currentUserId }
      : { keys, userId: currentUserId }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (res.ok) {
      await loadCurve()
    } else {
      const error = await res.json()
      throw new Error(error.error || 'Trade failed')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-[#0f0f1e] rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-gradient-to-br from-[#0f0f1e] to-[#1a1a2e] rounded-2xl border border-purple-500/20 overflow-hidden">
        {/* Profile Header */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-16 h-16 rounded-full border-2 border-purple-500/30" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl border-2 border-purple-500/30">
                {userName[0]}
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">{userName}</h3>
                {isVerified && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
              </div>
              <p className="text-sm text-gray-400 mb-2">{userHandle}</p>

              {/* Badges */}
              {userBadges.length > 0 && (
                <div className="flex gap-2">
                  {userBadges.map((badge, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-md text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {userBio && (
            <p className="text-sm text-gray-400 mb-4 flex items-center gap-1">
              <span className="text-orange-500">🔒</span>
              {userBio}
            </p>
          )}

          {/* Social Links */}
          <div className="flex gap-2 mb-4">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <Twitter className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <Globe className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Curve Stats */}
          {curve && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Price</div>
                <div className="text-lg font-bold text-white flex items-center gap-1">
                  <span className="text-orange-500">◎</span>
                  {curve.price.toFixed(4)}
                </div>
              </div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Holders</div>
                <div className="text-lg font-bold text-white">{curve.holders}</div>
              </div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Keys</div>
                <div className="text-lg font-bold text-white">{curve.supply.toFixed(0)}</div>
              </div>
            </div>
          )}

          {/* Your Holdings */}
          {userKeys > 0 && (
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">You own:</span>
                <span className="text-white font-bold">{userKeys.toFixed(2)} keys</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {curve && curve.state === 'active' && (
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/25"
              >
                Buy Keys
              </button>
            )}

            <button className="flex-1 px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-semibold text-sm transition-all border border-purple-500/30">
              Invite
            </button>
          </div>
        </div>
      </div>

      {curve && (
        <SimpleBuySellModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          curve={curve}
          ownerName={userName}
          ownerAvatar={userAvatar}
          twitterHandle=""
          userBalance={userBalance}
          userKeys={userKeys}
          onTrade={handleTrade}
        />
      )}
    </>
  )
}
