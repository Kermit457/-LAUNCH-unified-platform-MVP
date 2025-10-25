/**
 * RecommendedRooms - AI-powered room recommendations
 */

'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, ArrowRight, Loader2 } from 'lucide-react'
import { useRecommendedRooms } from '@/hooks/blast/useRecommendedRooms'
import type { Room } from '@/lib/types/blast'

export function RecommendedRooms() {
  const router = useRouter()
  const { data: recommendations, isLoading } = useRecommendedRooms(5)

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'deal':
        return 'from-green-500 to-emerald-500'
      case 'airdrop':
        return 'from-purple-500 to-pink-500'
      case 'job':
        return 'from-blue-500 to-cyan-500'
      case 'collab':
        return 'from-cyan-500 to-teal-500'
      case 'funding':
        return 'from-yellow-500 to-orange-500'
      default:
        return 'from-zinc-500 to-zinc-600'
    }
  }

  if (isLoading) {
    return (
      <div className="btdemo-glass rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#00FF88]" />
        </div>
      </div>
    )
  }

  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="btdemo-glass rounded-xl p-6 border border-[#00FF88]/20 bg-gradient-to-br from-[#00FF88]/5 to-transparent"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#00FF88]/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#00FF88]" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white">Recommended For You</h3>
          <p className="text-xs text-zinc-400">AI-powered matches based on your activity</p>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-3">
        {recommendations.map((match, index) => {
          const room = match.room!

          return (
            <motion.div
              key={room.$id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/BLAST/room/${room.$id}`)}
              className="btdemo-glass rounded-lg p-4 border border-zinc-800 hover:border-[#00FF88]/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                {/* Rank Badge */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#00FF88]/20 to-cyan-500/20 flex items-center justify-center">
                  <span className="text-sm font-black text-[#00FF88]">
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Type Badge & Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`px-2 py-1 rounded-full bg-gradient-to-r ${getRoomTypeColor(
                        room.type
                      )} text-white text-xs font-bold uppercase`}
                    >
                      {room.type}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <TrendingUp className="w-3 h-3" />
                      {match.score.toFixed(0)}% match
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-white text-sm mb-2 truncate group-hover:text-[#00FF88] transition-colors">
                    {room.title}
                  </h4>

                  {/* Match Reasons */}
                  {match.reasons && match.reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {match.reasons.slice(0, 2).map((reason, idx) => (
                        <span
                          key={idx}
                          className="text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Room Stats */}
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>{room.filledSlots} applicants</span>
                    {room.minKeys && room.minKeys > 0 && (
                      <>
                        <span>•</span>
                        <span>{room.minKeys} keys min</span>
                      </>
                    )}
                    <span>•</span>
                    <span className="text-[#00FF88]">{room.motionScore} motion</span>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#00FF88] group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 text-center">
          Match scores update every 5 minutes based on your activity
        </p>
      </div>
    </motion.div>
  )
}
