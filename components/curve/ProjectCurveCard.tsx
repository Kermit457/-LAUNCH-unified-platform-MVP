'use client'

import { useState, useEffect } from 'react'
import { Flame, Users2, ChevronUp } from 'lucide-react'
import { Curve } from '@/types/curve'
import { SimpleBuySellModal } from './SimpleBuySellModal'

interface ProjectCurveCardProps {
  projectId: string
  projectName: string
  projectLogo?: string
  projectTags?: string[]
  projectDescription?: string
  currentUserId: string
  userBalance: number
  rank?: number
  conviction?: number
}

export function ProjectCurveCard({
  projectId,
  projectName,
  projectLogo,
  projectTags = [],
  projectDescription,
  currentUserId,
  userBalance,
  rank = 1,
  conviction = 0
}: ProjectCurveCardProps) {
  const [curve, setCurve] = useState<Curve | null>(null)
  const [userKeys, setUserKeys] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadCurve()
  }, [projectId])

  const loadCurve = async () => {
    try {
      const res = await fetch(`/api/curve/owner?ownerType=project&ownerId=${projectId}`)
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
    const body = { keys, userId: currentUserId }

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
      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
        {/* Rank Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg w-12 h-12 flex flex-col items-center justify-center shadow-lg">
            <ChevronUp className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">{rank}</span>
          </div>
        </div>

        {/* Conviction Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2 border border-white/10">
            <span className="text-xs text-gray-400">@</span>
            <span className="text-white font-semibold">{conviction}</span>
            <span className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-xs text-purple-400">pool</span>
            <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
            <span className="text-xs text-cyan-400">fees</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 pt-20">
          {/* Project Header */}
          <div className="flex items-start gap-4 mb-4">
            {projectLogo ? (
              <img src={projectLogo} alt={projectName} className="w-16 h-16 rounded-xl" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{projectName[0]}</span>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">{projectName}</h3>
                {projectTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">RUN</p>
            </div>
          </div>

          {/* Description */}
          {projectDescription && (
            <p className="text-sm text-gray-400 mb-4">{projectDescription}</p>
          )}

          {/* Stats */}
          {curve && (
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-orange-500">◎</span>
                <span className="text-white font-semibold">{curve.price.toFixed(4)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users2 className="w-4 h-4 text-gray-400" />
                <span className="text-white font-semibold">{curve.holders}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm transition-all shadow-lg shadow-orange-500/25"
              disabled={!curve || curve.state !== 'active'}
            >
              <Flame className="w-4 h-4" />
              Buy Keys
            </button>

            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition-all border border-white/10">
              <Users2 className="w-4 h-4" />
              Collaborate
            </button>

            <button className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition-all border border-white/10">
              Details
            </button>
          </div>
        </div>
      </div>

      {curve && (
        <SimpleBuySellModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          curve={curve}
          ownerName={projectName}
          ownerAvatar={projectLogo}
          userBalance={userBalance}
          userKeys={userKeys}
          onTrade={handleTrade}
        />
      )}
    </>
  )
}
