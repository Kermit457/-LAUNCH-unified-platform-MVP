'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Coins, Rocket } from 'lucide-react'
import { Curve } from '@/types/curve'
import { SimpleBuySellModal } from './SimpleBuySellModal'

interface CurveProfileCardProps {
  ownerType: 'user' | 'project'
  ownerId: string
  ownerName: string
  ownerAvatar?: string
  currentUserId: string
  userBalance: number
}

export function CurveProfileCard({
  ownerType,
  ownerId,
  ownerName,
  ownerAvatar,
  currentUserId,
  userBalance
}: CurveProfileCardProps) {
  const [curve, setCurve] = useState<Curve | null>(null)
  const [userKeys, setUserKeys] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const isOwner = currentUserId === ownerId

  useEffect(() => {
    loadCurve()
  }, [ownerId])

  const loadCurve = async () => {
    try {
      // Fetch curve by owner
      const res = await fetch(`/api/curve/owner?ownerType=${ownerType}&ownerId=${ownerId}`)
      const data = await res.json()

      if (data.curve) {
        setCurve(data.curve)

        // Fetch user's holdings
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
      ? { amount: keys, userId: currentUserId, isKeysInput: true }
      : { keys, userId: currentUserId }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (res.ok) {
      await loadCurve() // Reload data
    } else {
      const error = await res.json()
      throw new Error(error.error || 'Trade failed')
    }
  }

  const handleLaunch = async () => {
    if (!curve || !isOwner) return

    if (!confirm('Are you sure you want to launch this token? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/curve/${curve.id}/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId })
      })

      if (res.ok) {
        const data = await res.json()
        alert(`Token launched successfully! ${data.message}`)
        await loadCurve()
      } else {
        const error = await res.json()
        alert(`Launch failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Launch failed:', error)
      alert('Launch failed. Check console for details.')
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 bg-gradient-to-br from-lime-500/10 to-pink-500/10 rounded-3xl border border-white/10">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-lime-500/30 border-t-lime-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!curve) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-500/10 to-gray-600/10 rounded-3xl border border-white/10">
        <div className="text-center text-gray-400">
          No curve found for this {ownerType}
        </div>
      </div>
    )
  }

  const canLaunch = curve.supply >= 100 && curve.holders >= 4 && curve.reserve >= 10
  const showLaunchButton = isOwner && curve.state === 'active' && canLaunch

  return (
    <>
      <div className="p-8 bg-gradient-to-br from-lime-500/10 to-pink-500/10 rounded-3xl border border-lime-500/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {ownerAvatar ? (
              <img src={ownerAvatar} alt={ownerName} className="w-16 h-16 rounded-full border-2 border-lime-500" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lime-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl border-2 border-white/20">
                {ownerName[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold text-white">{ownerName}</h3>
              <p className="text-sm text-gray-400">{ownerType === 'user' ? 'Creator' : 'Project'} Keys</p>
            </div>
          </div>

          <div className={`
            px-4 py-2 rounded-full text-sm font-bold uppercase
            ${curve.state === 'active' ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30' : ''}
            ${curve.state === 'frozen' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : ''}
            ${curve.state === 'launched' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
          `}>
            {curve.state}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <Coins className="w-4 h-4" />
              Price
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-1">
              <span className="text-orange-500">◎</span>
              {curve.price.toFixed(4)}
            </div>
            {/* <div className="text-sm text-green-400 mt-1">+{curve.change24h?.toFixed(1) || 0}%</div> */}
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <Users className="w-4 h-4" />
              Holders
            </div>
            <div className="text-2xl font-bold text-white">{curve.holders}</div>
            <div className="text-sm text-gray-500 mt-1">{curve.supply.toFixed(0)} keys</div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Reserve
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-1">
              <span className="text-orange-500">◎</span>
              {curve.reserve.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500 mt-1">Market Cap</div>
          </div>
        </div>

        {/* Your Holdings */}
        {userKeys > 0 && (
          <div className="p-4 bg-gradient-to-r from-lime-500/10 to-pink-500/10 rounded-2xl border border-lime-500/20 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Your Holdings</div>
                <div className="text-xl font-bold text-white">{userKeys.toFixed(2)} keys</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Current Value</div>
                <div className="text-xl font-bold text-white flex items-center gap-1">
                  <span className="text-orange-500">◎</span>
                  {(userKeys * curve.price).toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Launch Threshold Progress (Owner Only) */}
        {isOwner && curve.state === 'active' && (
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 mb-6">
            <div className="text-sm font-semibold text-amber-400 mb-3">Launch Requirements</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={curve.supply >= 100 ? 'text-green-400' : 'text-gray-400'}>
                  {curve.supply >= 100 ? '✅' : '⏳'} Supply: {curve.supply.toFixed(0)} / 100 keys
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={curve.holders >= 4 ? 'text-green-400' : 'text-gray-400'}>
                  {curve.holders >= 4 ? '✅' : '⏳'} Holders: {curve.holders} / 4
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={curve.reserve >= 10 ? 'text-green-400' : 'text-gray-400'}>
                  {curve.reserve >= 10 ? '✅' : '⏳'} Reserve: {curve.reserve.toFixed(2)} / 10 SOL
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {curve.state === 'active' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-lime-500 to-pink-500 hover:from-lime-600 hover:to-pink-600 transition-all shadow-lg shadow-lime-500/25"
            >
              Trade Keys
            </button>
          )}

          {showLaunchButton && (
            <button
              onClick={handleLaunch}
              className="flex-1 py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Launch Token
            </button>
          )}

          {curve.state === 'launched' && (
            <div className="flex-1 py-4 rounded-2xl font-bold text-white text-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5 text-green-400" />
              <span className="text-green-400">Token Launched!</span>
            </div>
          )}
        </div>
      </div>

      {/* Buy/Sell Modal */}
      <SimpleBuySellModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        curve={curve}
        ownerName={ownerName}
        ownerAvatar={ownerAvatar}
        twitterHandle=""
        userBalance={userBalance}
        userKeys={userKeys}
        onTrade={handleTrade}
      />
    </>
  )
}
